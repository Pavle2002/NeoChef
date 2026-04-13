import type {
  CanonicalIngredient,
  Cuisine,
  DishType,
  Recipe,
  SimilarityExplanation,
} from "@neochef/common";
import type { IRecommendationRepository } from "../interfaces/recommendation-repository.interface.js";
import type { IQueryExecutor } from "../interfaces/query-executor.interface.js";

export class RecommendationRepository implements IRecommendationRepository {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async findTopPicksBasic(userId: string): Promise<Recipe[]> {
    const query = `
      MATCH (u:User {id: $userId})

      // Social Candidates
      OPTIONAL MATCH (u)-[rel1:LIKES|SAVED]->(:Recipe)<-[rel2:LIKES|SAVED]-(peer:User)
      WITH u, peer, 
           SUM(CASE WHEN type(rel1)='SAVED' THEN 2 ELSE 1 END + 
               CASE WHEN type(rel2)='SAVED' THEN 2 ELSE 1 END) as totalSimilarity
      ORDER BY totalSimilarity DESC
      LIMIT 100 
      
      OPTIONAL MATCH (peer)-[:LIKES|SAVED]->(r1:Recipe)
      WITH u, collect(DISTINCT r1) AS c1

      // Diet Candidates
      OPTIONAL MATCH (u)-[:FOLLOWS]->(:Diet)<-[:SUITABLE_FOR]-(r2:Recipe)
      WITH u, c1, collect(DISTINCT r2) AS c2

      // Cuisine Candidates
      OPTIONAL MATCH (u)-[:PREFERS]->(:Cuisine)<-[:BELONGS_TO]-(r3:Recipe)
      WITH u, c1, c2, collect(DISTINCT r3) AS c3
      
      // Combine candidates
      WITH u, c1 + c2 + c3 AS allCandidates

      // Unwind and Deduplicate
      UNWIND allCandidates AS r
      
      WITH u, r, count(r) as preScore
      
      // 2. Filter Candidates
      WHERE r IS NOT NULL
        AND NOT (u)-[:LIKES|SAVED]->(r)
        AND NOT EXISTS {
          MATCH (u)-[:DISLIKES]->(disliked:CanonicalIngredient)
          MATCH (r)-[:CONTAINS]->(i:Ingredient)-[:MAPS_TO]->(ci:CanonicalIngredient)
          WHERE ci = disliked OR (ci)-[:IS_A*]->(disliked)
        }
      
      ORDER BY preScore DESC
      LIMIT 500

      // Diet Score
      OPTIONAL MATCH (u)-[:FOLLOWS]->(d:Diet)<-[:SUITABLE_FOR]-(r)
      WITH u, r, count(DISTINCT d) AS dietMatches

      // Cuisine Score
      OPTIONAL MATCH (u)-[:PREFERS]->(c:Cuisine)<-[:BELONGS_TO]-(r)
      WITH u, r, dietMatches, count(DISTINCT c) AS cuisineMatches

      // Social Score
      OPTIONAL MATCH (u)-[:LIKES|SAVED]->(:Recipe)<-[:LIKES|SAVED]-(other:User)-[rel:LIKES|SAVED]->(r)
      WITH u, r, dietMatches, cuisineMatches, 
           SUM(CASE 
             WHEN rel IS NULL THEN 0 
             WHEN type(rel) = 'SAVED' THEN 2 
             ELSE 1 
           END) AS socialScore

      // Final Weighted Score
      WITH r, 
           (dietMatches * 20) + 
           (cuisineMatches * 10) + 
           (coalesce(socialScore, 0) * 2) AS score

      ORDER BY score DESC
      LIMIT 10
      
      // 4. Return Recipe Data
      OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
      RETURN r, count(l) as likeCount
    `;

    const result = await this.queryExecutor.run(query, { userId });

    return result.records.map((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = recipe.createdAt.toString();
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });
  }

  async findSimilarToLastLikedBasic(
    userId: string,
  ): Promise<{ lastLiked: Recipe; recipes: Recipe[] } | null> {
    const query = `
      MATCH (u:User {id: $userId})-[l:LIKES]->(last:Recipe)
      WITH u, last
      ORDER BY l.likedAt DESC
      LIMIT 1
      
      MATCH (r:Recipe)
      WHERE r.id <> last.id AND NOT (u)-[:LIKES|SAVED]->(r)
      WITH DISTINCT last, r, u
      
      // Count shared Cuisines
      OPTIONAL MATCH (last)-[:BELONGS_TO]->(c:Cuisine)<-[:BELONGS_TO]-(r)
      WITH u, last, r, count(DISTINCT c) as cuisineMatches
      
      // Count shared DishTypes
      OPTIONAL MATCH (last)-[:IS_OF_TYPE]->(dt:DishType)<-[:IS_OF_TYPE]-(r)
      WITH u, last, r, cuisineMatches, count(DISTINCT dt) as dishTypeMatches
      
      // Count shared CanonicalIngredients 
      OPTIONAL MATCH (last)-[:CONTAINS]->(:Ingredient)-[:MAPS_TO]->(lastCi:CanonicalIngredient)
      OPTIONAL MATCH (r)-[:CONTAINS]->(:Ingredient)-[:MAPS_TO]->(recCi:CanonicalIngredient)
      WITH last, r, cuisineMatches, dishTypeMatches,
           sum(CASE 
             WHEN lastCi = recCi THEN 3  // Exact match
             WHEN (lastCi)-[:IS_A*]->(recCi) OR (recCi)-[:IS_A*]->(lastCi) THEN 1  // Parent-child relationship
             ELSE 0 
           END) as ingredientScore
      
      // Calculate total score
      WITH last, r,
           (cuisineMatches * 10) + (dishTypeMatches * 5) + ingredientScore as totalScore
      
      WHERE totalScore > 0
      
      ORDER BY totalScore DESC
      LIMIT 10
      
      OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
      RETURN last, r, count(l) as likeCount
    `;

    const result = await this.queryExecutor.run(query, { userId });

    const firstRecord = result.records[0];
    if (!firstRecord) {
      return null;
    }

    const lastLiked = firstRecord.get("last").properties as Recipe;
    const recipes = result.records.map((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = recipe.createdAt.toString();
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });

    return { lastLiked, recipes };
  }

  async findFridgeBased(userId: string): Promise<Recipe[]> {
    const query = `
      MATCH (u:User {id: $userId})
      MATCH (u)-[:HAS]->(userCi:CanonicalIngredient)
      MATCH (r:Recipe)-[:CONTAINS]->(i:Ingredient)-[:MAPS_TO]->(matchedCi:CanonicalIngredient)
      WHERE matchedCi = userCi OR (matchedCi)-[:IS_A*]->(userCi) OR (userCi)-[:IS_A*]->(matchedCi)
      
      WITH r, count(DISTINCT matchedCi) as matchCount
      
      // Find total canonical ingredients for these candidate recipes
      MATCH (r)-[:CONTAINS]->(Ingredient)-[:MAPS_TO]->(allCi:CanonicalIngredient)
      WITH r, matchCount, count(DISTINCT allCi) as totalCanonicalIngredients
      
      // Calculate score:
      // 1. Coverage (How much of the recipe can I make? - based on canonical ingredients)
      // 2. Usage (How many of my canonical ingredients does it use?)
      WITH r, matchCount, totalCanonicalIngredients, 
           (toFloat(matchCount) / totalCanonicalIngredients) as coverage
      
      // Filter out recipes with very low coverage (e.g., < 20%) to avoid irrelevant suggestions
      WHERE coverage >= 0.15
           
      ORDER BY coverage DESC, matchCount DESC
      LIMIT 10
      
      OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
      RETURN r, count(l) as likeCount
    `;

    const result = await this.queryExecutor.run(query, { userId });

    return result.records.map((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = recipe.createdAt.toString();
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });
  }

  async findTopPicksAdvanced(userId: string): Promise<Recipe[]> {
    const query = `
      MATCH (u:User {id: $userId})
      WHERE u.recommendationEmbedding IS NOT NULL

      MATCH (r:Recipe)
      WHERE r.recommendationEmbedding IS NOT NULL
        AND NOT (u)-[:LIKES|SAVED]->(r)
        AND NOT EXISTS {
          MATCH (u)-[:DISLIKES]->(disliked:CanonicalIngredient)
          MATCH (r)-[:CONTAINS]->(:Ingredient)-[:MAPS_TO]->(ci:CanonicalIngredient)
          WHERE ci = disliked OR (ci)-[:IS_A*]->(disliked)
        }

      WITH u, r, gds.similarity.cosine(u.recommendationEmbedding, r.recommendationEmbedding) AS similarity

      ORDER BY similarity DESC
      LIMIT 10

      OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
      RETURN r, count(l) as likeCount
      `;

    const result = await this.queryExecutor.run(query, { userId });

    return result.records.map((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = recipe.createdAt.toString();
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });
  }

  async findSimilarToLastLikedAdvanced(
    userId: string,
  ): Promise<{ lastLiked: Recipe; recipes: Recipe[] } | null> {
    const query = `
      MATCH (u:User {id: $userId})-[l:LIKES]->(last:Recipe)
      WITH u, last
      ORDER BY l.likedAt DESC
      LIMIT 1
      
      MATCH (r:Recipe)
      WHERE r.id <> last.id
        AND r.similarityEmbedding IS NOT NULL
        AND NOT (u)-[:LIKES|SAVED]->(r)
        
      WITH last, r, gds.similarity.cosine(last.similarityEmbedding, r.similarityEmbedding) as similarity
            
      ORDER BY similarity DESC
      LIMIT 10
      
      OPTIONAL MATCH (r)<-[l:LIKES]-(:User)
      RETURN last, r, count(l) as likeCount
    `;

    const result = await this.queryExecutor.run(query, { userId });

    const firstRecord = result.records[0];
    if (!firstRecord) {
      return null;
    }

    const lastLiked = firstRecord.get("last").properties as Recipe;
    const recipes = result.records.map((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = recipe.createdAt.toString();
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });

    return { lastLiked, recipes };
  }

  async getSimilarityExplanation(
    recipe1Id: string,
    recipe2Id: string,
  ): Promise<SimilarityExplanation> {
    const query = `
      MATCH (r1:Recipe {id: $recipe1Id})
      MATCH (r2:Recipe {id: $recipe2Id})

      OPTIONAL MATCH (r1)-[:CONTAINS]->(:Ingredient)-[:MAPS_TO]->(ci1:CanonicalIngredient)
      WITH r1, r2, collect(DISTINCT ci1) AS r1Ingredients

      OPTIONAL MATCH (r2)-[:CONTAINS]->(:Ingredient)-[:MAPS_TO]->(ci2:CanonicalIngredient)
      WITH r1, r2, r1Ingredients, collect(DISTINCT ci2) AS r2Ingredients

      WITH r1, r2, [ci IN r1Ingredients
            WHERE ANY(other IN r2Ingredients
              WHERE ci = other
                OR EXISTS { MATCH (ci)-[:IS_A]->(other) }
                OR EXISTS { MATCH (other)-[:IS_A]->(ci) }
            )
          ] AS sharedIngredients

      OPTIONAL MATCH (r1)-[:BELONGS_TO]->(c:Cuisine)<-[:BELONGS_TO]-(r2)
      WITH r1, r2, sharedIngredients, collect(DISTINCT c) AS sharedCuisines

      OPTIONAL MATCH (r1)-[:IS_OF_TYPE]->(dt:DishType)<-[:IS_OF_TYPE]-(r2)
      WITH r1, r2, sharedIngredients, sharedCuisines, collect(DISTINCT dt) AS sharedDishTypes

      RETURN sharedCuisines, sharedDishTypes, sharedIngredients
    `;

    const result = await this.queryExecutor.run(query, {
      recipe1Id,
      recipe2Id,
    });
    const record = result.records[0];
    if (!record) {
      return {
        sharedCuisines: [],
        sharedDishTypes: [],
        sharedIngredients: [],
      };
    }

    const sharedCuisines = record
      .get("sharedCuisines")
      .map((c: any) => c.properties) as Cuisine[];

    const sharedDishTypes = record
      .get("sharedDishTypes")
      .map((dt: any) => dt.properties) as DishType[];

    const sharedIngredients = record
      .get("sharedIngredients")
      .map((i: any) => i.properties) as CanonicalIngredient[];

    return {
      sharedCuisines,
      sharedDishTypes,
      sharedIngredients,
    };
  }
}

import type { Recipe } from "@neochef/common";
import type { IRecommendationRepository } from "../interfaces/recommendation-repository.interface.js";
import type { IQueryExecutor } from "../interfaces/query-executor.interface.js";
import { neo4jDateTimeConverter } from "../utils/neo4j-datetime-converter.js";

export class RecommendationRepository implements IRecommendationRepository {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async findTopPicks(userId: string): Promise<Recipe[]> {
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
      recipe.createdAt = neo4jDateTimeConverter.toStandardDate(
        recipe.createdAt,
      );
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });
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
      recipe.createdAt = neo4jDateTimeConverter.toStandardDate(
        recipe.createdAt,
      );
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });
  }

  async findSimilarToLastLiked(
    userId: string,
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null> {
    const query = `
      MATCH (u:User {id: $userId})-[l:LIKES]->(last:Recipe)
      WITH u, last
      ORDER BY l.likedAt DESC
      LIMIT 1
      
      // Find candidate recipes that share Cuisine or DishType (pre-filter for performance)
      MATCH (last)-[:BELONGS_TO|IS_OF_TYPE]->(attr)<-[:BELONGS_TO|IS_OF_TYPE]-(r:Recipe)
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
      RETURN last.title as basedOn, r, count(l) as likeCount
    `;

    const result = await this.queryExecutor.run(query, { userId });

    const firstRecord = result.records[0];
    if (!firstRecord) {
      return null;
    }

    const basedOn = firstRecord.get("basedOn");
    const recipes = result.records.map((record) => {
      const recipe = record.get("r").properties;
      recipe.createdAt = neo4jDateTimeConverter.toStandardDate(
        recipe.createdAt,
      );
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });

    return { basedOn, recipes };
  }
}

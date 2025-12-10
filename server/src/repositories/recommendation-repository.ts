import type { IQueryExecutor } from "@interfaces/query-executor.interface.js";
import type { IRecommendationRepository } from "@interfaces/recommendation-repository.interface.js";
import type { Recipe } from "@common/schemas/recipe.js";
import { neo4jDateTimeConverter } from "@utils/neo4j-datetime-converter.js";

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
        AND NOT (u)-[:DISLIKES]->(:Ingredient)<-[:CONTAINS]-(r)
      
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
        recipe.createdAt
      );
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });
  }

  async findFridgeBased(userId: string): Promise<Recipe[]> {
    const query = `
      MATCH (u:User {id: $userId})
      MATCH (u)-[:HAS]->(i:Ingredient)<-[:CONTAINS]-(r:Recipe)
      
      WITH r, count(DISTINCT i) as matchCount
      
      // Find total ingredients for these candidate recipes to calculate coverage
      MATCH (r)-[:CONTAINS]->(all:Ingredient)
      WITH r, matchCount, count(DISTINCT all) as totalIngredients
      
      // Calculate score:
      // 1. Coverage (How much of the recipe can I make?)
      // 2. Usage (How many of my ingredients does it use?)
      WITH r, matchCount, totalIngredients, 
           (toFloat(matchCount) / totalIngredients) as coverage
      
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
        recipe.createdAt
      );
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });
  }

  async findSimilarToLastLiked(
    userId: string
  ): Promise<{ basedOn: string; recipes: Recipe[] } | null> {
    const query = `
      MATCH (u:User {id: $userId})-[l:LIKES]->(last:Recipe)
      WITH u, last
      ORDER BY l.likedAt DESC
      LIMIT 1
      
      // Optimization: Only find recipes that share at least one attribute
      // (Cuisine, DishType, or Ingredient) to avoid scanning the whole DB.
      MATCH (last)-[:BELONGS_TO|IS_OF_TYPE|CONTAINS]->(common)<-[:BELONGS_TO|IS_OF_TYPE|CONTAINS]-(r:Recipe)
      WHERE r.id <> last.id 
        AND NOT (u)-[:LIKES|SAVED]->(r)
      
      // Calculate score based on the type of shared attribute
      WITH last, r, 
           sum(CASE 
             WHEN 'Cuisine' IN labels(common) THEN 10 
             WHEN 'DishType' IN labels(common) THEN 5 
             WHEN 'Ingredient' IN labels(common) THEN 2 
             ELSE 0 
           END) as totalScore
      
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
        recipe.createdAt
      );
      recipe.likeCount = record.get("likeCount");
      return recipe as Recipe;
    });

    return { basedOn, recipes };
  }
}

import type { EmbeddingPurpose } from "@neochef/common";
import type { IQueryExecutor } from "../interfaces/query-executor.interface.js";

export class GDSService {
  constructor(private readonly queryExecutor: IQueryExecutor) {}

  async createRecommendationsProjection(): Promise<void> {
    await this.queryExecutor.run(
      `CALL {
        MATCH (u:User)-[r:LIKES|SAVED]->(rec:Recipe)
        RETURN 
          u AS source,
          rec AS target,
          type(r) AS relType,
          CASE type(r)
            WHEN 'SAVED' THEN 3.0
            ELSE 2.0
          END AS weight

        UNION ALL

        MATCH (u:User)-[:PREFERS]->(c:Cuisine)
        RETURN 
          u AS source,
          c AS target,
          'PREFERS' AS relType,
          1.5 AS weight

        UNION ALL

        MATCH (u:User)-[:FOLLOWS]->(d:Diet)
        RETURN 
          u AS source,
          d AS target,
          'FOLLOWS' AS relType,
          1.5 AS weight

        UNION ALL

        MATCH (r:Recipe)-[:BELONGS_TO]->(c:Cuisine)
        RETURN 
          r AS source,
          c AS target,
          'BELONGS_TO' AS relType,
          0.7 AS weight

        UNION ALL

        MATCH (r:Recipe)-[:SUITABLE_FOR]->(d:Diet)
        RETURN 
          r AS source,
          d AS target,
          'SUITABLE_FOR' AS relType,
          0.7 AS weight

        UNION ALL

        MATCH (r:Recipe)-[:CONTAINS]->(:Ingredient)-[:MAPS_TO]->(ci:CanonicalIngredient)
        RETURN 
          r AS source,
          ci AS target,
          'HAS_CANONICAL' AS relType,
          1.5 AS weight

        UNION ALL

        MATCH (ci1:CanonicalIngredient)-[:IS_A]->(ci2:CanonicalIngredient)
        RETURN
          ci1 AS source,
          ci2 AS target,
          'IS_A' AS relType,
          1.0 AS weight
    }

    WITH gds.graph.project(
      'recommendations',
      source,
      target,
      {
        sourceNodeLabels: labels(source),
        targetNodeLabels: labels(target),
        relationshipType: relType,
        relationshipProperties: { weight: weight }
      },
      {
        undirectedRelationshipTypes: ['*'],
        memory: '2GB'
      }
    ) AS g

    RETURN 
      g.graphName AS graph,
      g.nodeCount AS nodes,
      g.relationshipCount AS relationships;
      `,
    );
  }

  async runFastRPOnRecommendationsProjection(): Promise<void> {
    await this.queryExecutor.run(
      `CALL gds.fastRP.write('recommendations', {
        embeddingDimension: 256,
        iterationWeights: [0.0, 1.0, 1.0],
        nodeSelfInfluence: 0.0,
        normalizationStrength: 0.5,
        relationshipWeightProperty: 'weight',
        randomSeed: 42,
        writeProperty: 'recommendationEmbedding'
      })
      YIELD nodeCount, nodePropertiesWritten;`,
    );
    await this.queryExecutor.run(
      `MATCH (n)
      WHERE NOT (n:Recipe OR n:User)
      REMOVE n.recommendationEmbedding;`,
    );
  }

  async createRecipeSimilarityProjection(): Promise<void> {
    await this.queryExecutor.run(
      `CALL {
        MATCH (r:Recipe)-[:CONTAINS]->(:Ingredient)-[:MAPS_TO]->(ci:CanonicalIngredient)
        RETURN 
          r AS source,
          ci AS target,
          'HAS_CANONICAL' AS relType,
          2.0 AS weight

        UNION ALL

        MATCH (ci1:CanonicalIngredient)-[:IS_A]->(ci2:CanonicalIngredient)
        RETURN
          ci1 AS source,
          ci2 AS target,
          'IS_A' AS relType,
          1.5 AS weight

        UNION ALL

        MATCH (r:Recipe)-[:BELONGS_TO]->(c:Cuisine)
        RETURN 
          r AS source,
          c AS target,
          'BELONGS_TO' AS relType,
          1.5 AS weight

        UNION ALL

        MATCH (r:Recipe)-[:IS_OF_TYPE]->(d:DishType)
        RETURN 
          r AS source,
          d AS target,
          'IS_OF_TYPE' AS relType,
          0.7 AS weight
    }

    WITH gds.graph.project(
      'recipe-similarity',
      source,
      target,
      {
        sourceNodeLabels: labels(source),
        targetNodeLabels: labels(target),
        relationshipType: relType,
        relationshipProperties: { weight: weight }
      },
      {
        undirectedRelationshipTypes: ['*'],
        memory: '2GB'
      }
    ) AS g

    RETURN 
      g.graphName AS graph,
      g.nodeCount AS nodes,
      g.relationshipCount AS relationships;
      `,
    );
  }

  async runFastRPOnRecipeSimilarityProjection(): Promise<void> {
    await this.queryExecutor.run(
      `CALL gds.fastRP.write('recipe-similarity', {
        embeddingDimension: 256,
        iterationWeights: [0.0, 1.0, 1.0],
        nodeSelfInfluence: 0.0,
        normalizationStrength: 0.0,
        relationshipWeightProperty: 'weight',
        randomSeed: 42,
        writeProperty: 'similarityEmbedding'
        })
        YIELD nodeCount, nodePropertiesWritten;`,
    );
    await this.queryExecutor.run(
      `MATCH (n)
      WHERE NOT n:Recipe
      REMOVE n.similarityEmbedding;`,
    );
  }

  async dropProjection(name: EmbeddingPurpose): Promise<void> {
    await this.queryExecutor.run(
      `CALL gds.graph.drop('${name}', false) YIELD graphName;`,
    );
  }
}

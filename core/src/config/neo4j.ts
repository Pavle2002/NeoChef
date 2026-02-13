import neo4j, { Driver } from "neo4j-driver";

export async function createNeo4jClient(
  url: string,
  username: string,
  password: string,
) {
  const client = neo4j.driver(url, neo4j.auth.basic(username, password), {
    disableLosslessIntegers: true,
  });
  await createConstraints(client);
  await createIndexes(client);
  return client;
}

async function createConstraints(client: Driver): Promise<void> {
  await client.executeQuery(`
    CREATE CONSTRAINT recipe_source_unique IF NOT EXISTS
    FOR (r:Recipe)
    REQUIRE (r.sourceName, r.sourceId) IS UNIQUE
  `);

  await client.executeQuery(`
    CREATE CONSTRAINT ingredient_source_unique IF NOT EXISTS
    FOR (i:Ingredient)
    REQUIRE (i.sourceName, i.sourceId) IS UNIQUE
  `);

  await client.executeQuery(`
    CREATE CONSTRAINT equipment_source_unique IF NOT EXISTS
    FOR (e:Equipment)
    REQUIRE (e.sourceName, e.sourceId) IS UNIQUE
  `);

  await client.executeQuery(`
    CREATE CONSTRAINT cuisine_name_unique IF NOT EXISTS
    FOR (c:Cuisine)
    REQUIRE c.name IS UNIQUE
  `);

  await client.executeQuery(`
    CREATE CONSTRAINT diet_name_unique IF NOT EXISTS
    FOR (d:Diet)
    REQUIRE d.name IS UNIQUE
  `);

  await client.executeQuery(`
    CREATE CONSTRAINT dish_type_name_unique IF NOT EXISTS
    FOR (dt:DishType)
    REQUIRE dt.name IS UNIQUE
  `);

  await client.executeQuery(`
    CREATE CONSTRAINT user_username_unique IF NOT EXISTS
    FOR (u:User)
    REQUIRE u.username IS UNIQUE
  `);

  await client.executeQuery(`
    CREATE CONSTRAINT user_email_unique IF NOT EXISTS
    FOR (u:User)
    REQUIRE u.email IS UNIQUE
  `);
}

async function createIndexes(client: Driver): Promise<void> {
  await client.executeQuery(
    `CREATE VECTOR INDEX canonical_embedding_index IF NOT EXISTS
    FOR (i:CanonicalIngredient)
    ON (i.embedding)
    OPTIONS {
      indexConfig: {
        \`vector.dimensions\`: 384,
        \`vector.similarity_function\`: 'cosine'
      }
    }`,
  );
  await client.executeQuery(
    `CREATE VECTOR INDEX recipe_embedding_index IF NOT EXISTS
    FOR (r:Recipe)
    ON (r.embedding)
    OPTIONS {
      indexConfig: {
        \`vector.dimensions\`: 384,
        \`vector.similarity_function\`: 'cosine'
      }
    }`,
  );
  // await client.executeQuery(
  //   `CREATE FULLTEXT INDEX recipeFullTextIndex IF NOT EXISTS
  //   FOR (r:Recipe) ON EACH [r.title, r.description]`,
  // );
}

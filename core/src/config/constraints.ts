import type { IQueryExecutor } from "src/index.js";

export async function ensureConstraints(
  queryExecutor: IQueryExecutor,
): Promise<void> {
  await queryExecutor.run(`
    CREATE CONSTRAINT recipe_source_unique IF NOT EXISTS
    FOR (r:Recipe)
    REQUIRE (r.sourceName, r.sourceId) IS UNIQUE
  `);

  await queryExecutor.run(`
    CREATE CONSTRAINT ingredient_source_unique IF NOT EXISTS
    FOR (i:Ingredient)
    REQUIRE (i.sourceName, i.sourceId) IS UNIQUE
  `);

  await queryExecutor.run(`
    CREATE CONSTRAINT equipment_source_unique IF NOT EXISTS
    FOR (e:Equipment)
    REQUIRE (e.sourceName, e.sourceId) IS UNIQUE
  `);

  await queryExecutor.run(`
    CREATE CONSTRAINT cuisine_name_unique IF NOT EXISTS
    FOR (c:Cuisine)
    REQUIRE c.name IS UNIQUE
  `);

  await queryExecutor.run(`
    CREATE CONSTRAINT diet_name_unique IF NOT EXISTS
    FOR (d:Diet)
    REQUIRE d.name IS UNIQUE
  `);

  await queryExecutor.run(`
    CREATE CONSTRAINT dish_type_name_unique IF NOT EXISTS
    FOR (dt:DishType)
    REQUIRE dt.name IS UNIQUE
  `);

  await queryExecutor.run(`
    CREATE CONSTRAINT user_username_unique IF NOT EXISTS
    FOR (u:User)
    REQUIRE u.username IS UNIQUE
  `);

  await queryExecutor.run(`
    CREATE CONSTRAINT user_email_unique IF NOT EXISTS
    FOR (u:User)
    REQUIRE u.email IS UNIQUE
  `);

  await queryExecutor.run(
    `CREATE FULLTEXT INDEX recipeFullTextIndex IF NOT EXISTS 
    FOR (r:Recipe) ON EACH [r.title, r.description]`,
  );
}

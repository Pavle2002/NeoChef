import type { Driver } from "neo4j-driver";

export async function ensureConstraints(driver: Driver): Promise<void> {
  await driver.executeQuery(`
    CREATE CONSTRAINT recipe_source_unique IF NOT EXISTS
    FOR (r:Recipe)
    REQUIRE (r.sourceName, r.sourceId) IS UNIQUE
  `);

  await driver.executeQuery(`
    CREATE CONSTRAINT ingredient_source_unique IF NOT EXISTS
    FOR (i:Ingredient)
    REQUIRE (i.sourceName, i.sourceId) IS UNIQUE
  `);

  await driver.executeQuery(`
    CREATE CONSTRAINT equipment_source_unique IF NOT EXISTS
    FOR (e:Equipment)
    REQUIRE (e.sourceName, e.sourceId) IS UNIQUE
  `);

  await driver.executeQuery(`
    CREATE CONSTRAINT cuisine_name_unique IF NOT EXISTS
    FOR (c:Cuisine)
    REQUIRE c.name IS UNIQUE
  `);

  await driver.executeQuery(`
    CREATE CONSTRAINT diet_name_unique IF NOT EXISTS
    FOR (d:Diet)
    REQUIRE d.name IS UNIQUE
  `);

  await driver.executeQuery(`
    CREATE CONSTRAINT dish_type_name_unique IF NOT EXISTS
    FOR (dt:DishType)
    REQUIRE dt.name IS UNIQUE
  `);

  await driver.executeQuery(`
    CREATE CONSTRAINT user_username_unique IF NOT EXISTS
    FOR (u:User)
    REQUIRE u.username IS UNIQUE
  `);

  await driver.executeQuery(`
    CREATE CONSTRAINT user_email_unique IF NOT EXISTS
    FOR (u:User)
    REQUIRE u.email IS UNIQUE
  `);
}

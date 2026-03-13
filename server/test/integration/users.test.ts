import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "src/app.js";
import { randomUUID } from "crypto";
import {
  type SuccessResponse,
  type Preferences,
  type CanonicalIngredient,
  SafeUserSchema,
  PreferencesSchema,
  type UserData,
  ErrorCodes,
  CanonicalIngredientSchema,
} from "@neochef/common";
import {
  expectError,
  getValidCanonicalIngredientsData,
  getValidCuisine,
  getValidDiet,
  getValidUser,
  loginUser,
  registerUser,
  SuccessResponseSchema,
  type TestAgent,
} from "./helpers.js";

const ingredientRepository = globalThis.ingredientRepository;
const cuisineRepository = globalThis.cuisineRepository;
const dietRepository = globalThis.dietRepository;

describe("GET /users/me", () => {
  let agent: TestAgent;
  let user: UserData;

  beforeEach(async () => {
    user = getValidUser();
    agent = request.agent(app);
    await registerUser(user, agent);
    await loginUser(user, agent);
  });

  it("returns 200 with safe user data when authenticated", async () => {
    const res = await agent.get("/users/me");
    expect(res.status).toBe(200);

    const parsed = SuccessResponseSchema(SafeUserSchema).safeParse(res.body);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.data.email).toBe(user.email);
  });

  it("returns 200 with null data when not authenticated", async () => {
    const res = await request(app).get("/users/me");
    expect(res.status).toBe(200);

    const body = res.body as SuccessResponse<null>;
    expect(body.success).toBe(true);
    expect(body.data).toBe(null);
  });
});

describe("GET /users/:id", () => {
  let agent: TestAgent;
  let user: UserData;

  beforeEach(async () => {
    user = getValidUser();
    agent = request.agent(app);
    await registerUser(user, agent);
    await loginUser(user, agent);
  });

  it("returns 200 with safe user data when user exists", async () => {
    const someUser = await registerUser(getValidUser(), agent);

    const res = await agent.get(`/users/${someUser.id}`);
    expect(res.status).toBe(200);

    const parsed = SuccessResponseSchema(SafeUserSchema).safeParse(res.body);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.data).toEqual(someUser);
  });

  it("returns 404 when user does not exist", async () => {
    const res = await agent.get(`/users/${randomUUID()}`);
    expectError(res, 404, ErrorCodes.RES_NOT_FOUND);
  });

  it("returns 400 when id is not a valid UUID", async () => {
    const res = await agent.get("/users/not-a-valid-uuid");
    expectError(res, 400, ErrorCodes.VAL_FAILED);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).get(`/users/${randomUUID()}`);

    expectError(res, 401, ErrorCodes.AUTH_EXPIRED);
  });
});

describe("GET /users/me/preferences", () => {
  let agent: TestAgent;
  let user: UserData;
  let preferences: Preferences;

  beforeEach(async () => {
    user = getValidUser();
    preferences = await seedPreferences();
    agent = request.agent(app);
    await registerUser(user, agent);
    await loginUser(user, agent);
  });

  it("returns 200 with user preferences when authenticated", async () => {
    const putRes = await agent.put("/users/me/preferences").send(preferences);
    expect(putRes.status).toBe(200);
    const putBody = putRes.body as SuccessResponse<Preferences>;

    const res = await agent.get("/users/me/preferences");
    expect(res.status).toBe(200);

    const parsed = SuccessResponseSchema(PreferencesSchema).safeParse(res.body);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.data).toEqual(putBody.data);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).get("/users/me/preferences");
    expectError(res, 401, ErrorCodes.AUTH_EXPIRED);
  });
});

describe("PUT /users/me/preferences", () => {
  let agent: TestAgent;
  let user: UserData;
  let preferences: Preferences;

  beforeEach(async () => {
    user = getValidUser();
    preferences = await seedPreferences();
    agent = request.agent(app);
    await registerUser(user, agent);
    await loginUser(user, agent);
  });

  it("returns 200 with updated preferences when valid", async () => {
    const res = await agent.put("/users/me/preferences").send(preferences);
    expect(res.status).toBe(200);

    const parsed = SuccessResponseSchema(PreferencesSchema).safeParse(res.body);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.data).toEqual(preferences);

    const getRes = await agent.get("/users/me/preferences");
    expect(getRes.status).toBe(200);
    const body = getRes.body as SuccessResponse<Preferences>;
    expect(body.data).toEqual(preferences);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app)
      .put("/users/me/preferences")
      .send(preferences);

    expectError(res, 401, ErrorCodes.AUTH_EXPIRED);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await agent.put("/users/me/preferences").send({});
    expectError(res, 400, ErrorCodes.VAL_MISSING_FIELD);
  });

  it("returns 400 when fields have invalid types", async () => {
    const res = await agent.put("/users/me/preferences").send({
      dislikesIngredients: "not-an-array",
      prefersCuisines: "not-an-array",
      followsDiets: "not-an-array",
    });
    expectError(res, 400, ErrorCodes.VAL_INVALID_TYPE);
  });
});

describe("GET /users/me/fridge", () => {
  let agent: TestAgent;
  let user: UserData;
  let fridge: CanonicalIngredient[];

  beforeEach(async () => {
    user = getValidUser();
    fridge = await ingredientRepository.createManyCanonical(
      getValidCanonicalIngredientsData(),
    );
    agent = request.agent(app);
    await registerUser(user, agent);
    await loginUser(user, agent);
  });

  it("returns 200 with fridge items when authenticated", async () => {
    const putRes = await agent.put("/users/me/fridge").send(fridge);
    expect(putRes.status).toBe(200);
    const putBody = putRes.body as SuccessResponse<CanonicalIngredient[]>;

    const res = await agent.get("/users/me/fridge");
    expect(res.status).toBe(200);

    const parsed = SuccessResponseSchema(
      CanonicalIngredientSchema.array(),
    ).safeParse(res.body);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.data).toEqual(putBody.data);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).get("/users/me/fridge");
    expectError(res, 401, ErrorCodes.AUTH_EXPIRED);
  });
});

describe("PUT /users/me/fridge", () => {
  let agent: TestAgent;
  let user: UserData;
  let fridge: CanonicalIngredient[];

  beforeEach(async () => {
    user = getValidUser();
    fridge = await ingredientRepository.createManyCanonical(
      getValidCanonicalIngredientsData(),
    );
    agent = request.agent(app);
    await registerUser(user, agent);
    await loginUser(user, agent);
  });

  it("returns 200 with updated fridge when valid", async () => {
    const res = await agent.put("/users/me/fridge").send(fridge);
    expect(res.status).toBe(200);

    const parsed = SuccessResponseSchema(
      CanonicalIngredientSchema.array(),
    ).safeParse(res.body);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.data).toEqual(fridge);

    const getRes = await agent.get("/users/me/fridge");
    expect(getRes.status).toBe(200);
    const body = getRes.body as SuccessResponse<CanonicalIngredient[]>;
    expect(body.data).toEqual(fridge);
  });

  it("returns 400 when body is not an array", async () => {
    const res = await agent.put("/users/me/fridge").send("not-an-array");
    expectError(res, 400, ErrorCodes.VAL_INVALID_TYPE);
  });

  it("returns 400 when array items have invalid structure", async () => {
    const res = await agent.put("/users/me/fridge").send(["not-an-object"]);

    expectError(res, 400, ErrorCodes.VAL_INVALID_TYPE);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).put("/users/me/fridge").send([]);
    expectError(res, 401, ErrorCodes.AUTH_EXPIRED);
  });
});

async function seedPreferences(): Promise<Preferences> {
  const dislikedIngredients = await ingredientRepository.createManyCanonical(
    getValidCanonicalIngredientsData(),
  );
  const preferedCuisine = await cuisineRepository.create(getValidCuisine());
  const followedDiet = await dietRepository.create(getValidDiet());
  return {
    dislikesIngredients: dislikedIngredients,
    prefersCuisines: [preferedCuisine],
    followsDiets: [followedDiet],
  };
}

import {
  SafeUserSchema,
  type CanonicalIngredientData,
  type Cuisine,
  type Diet,
  type ErrorCode,
  type FailResponse,
  type UserCredentials,
  type UserData,
} from "@neochef/common";
import { randomUUID } from "crypto";
import z from "zod";
import request from "supertest";
import { expect } from "vitest";

export function SuccessResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string(),
  });
}

export function getValidUser(): UserData {
  const id = randomUUID().replace(/-/g, "").slice(0, 8);
  return {
    username: `testuser${id}`,
    email: `testuser${id}@example.com`,
    password: "Password1!",
    isAdmin: false,
  };
}

export function getValidCanonicalIngredientsData(): CanonicalIngredientData[] {
  return [
    {
      name: "Tomato",
      category: "Vegetable",
      nameEmbedding: [0.4, 0.5, 0.6],
    },
    {
      name: "Broccoli",
      category: "Vegetable",
      nameEmbedding: [0.1, 0.2, 0.3],
    },
    {
      name: "Onion",
      category: "Vegetable",
      nameEmbedding: [0.7, 0.8, 0.9],
    },
  ];
}

export function getValidCuisine(): Cuisine {
  return {
    name: "Italian",
  };
}

export function getValidDiet(): Diet {
  return {
    name: "Vegan",
  };
}

export type TestAgent = ReturnType<typeof request.agent>;

export async function registerUser(userData: UserData, agent: TestAgent) {
  const regRes = await agent.post("/auth/register").send(userData);
  expect(regRes.status).toBe(201);

  const parsed = SuccessResponseSchema(SafeUserSchema).safeParse(regRes.body);
  expect(parsed.success).toBe(true);

  return parsed.data!.data;
}

export async function loginUser(user: UserData, agent: TestAgent) {
  const credentials: UserCredentials = {
    email: user.email,
    password: user.password,
  };
  const loginRes = await agent.post("/auth/login").send(credentials);
  expect(loginRes.status).toBe(200);

  const parsed = SuccessResponseSchema(SafeUserSchema).safeParse(loginRes.body);
  expect(parsed.success).toBe(true);

  return parsed.data!.data;
}

export function expectError(
  res: request.Response,
  statusCode: number,
  expectedErrorCode: ErrorCode,
) {
  expect(res.status).toBe(statusCode);

  const body = res.body as FailResponse;
  expect(body.success).toBe(false);
  expect(body.errorCode).toBe(expectedErrorCode);
}

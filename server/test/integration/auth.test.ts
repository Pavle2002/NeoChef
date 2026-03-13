import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "src/app.js";
import {
  ErrorCodes,
  SafeUserSchema,
  type SuccessResponse,
  type UserData,
} from "@neochef/common";
import type { SafeUser } from "@neochef/common";
import { expectError, getValidUser, SuccessResponseSchema } from "./helpers.js";

describe("POST /auth/register", () => {
  it("registers a new user and returns 201 with safe user data", async () => {
    const validUser = getValidUser();
    const res = await request(app).post("/auth/register").send(validUser);
    expect(res.status).toBe(201);

    const parsed = SuccessResponseSchema(SafeUserSchema).safeParse(res.body);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.data.email).toBe(validUser.email);

    const getRes = await request(app).post(`/auth/login`).send({
      email: validUser.email,
      password: validUser.password,
    });
    expect(getRes.status).toBe(200);
  });

  it("returns 409 when email is already taken", async () => {
    const validUser = getValidUser();
    await request(app).post("/auth/register").send(validUser);

    const validUser2: UserData = {
      ...validUser,
      username: "testuser2",
    };

    const res = await request(app).post("/auth/register").send(validUser2);
    expectError(res, 409, ErrorCodes.RES_CONFLICT_EMAIL);
  });

  it("returns 409 when username is already taken", async () => {
    const validUser = getValidUser();
    await request(app).post("/auth/register").send(validUser);

    const validUser2: UserData = {
      ...validUser,
      email: "testuser2@example.com",
    };

    const res = await request(app).post("/auth/register").send(validUser2);
    expectError(res, 409, ErrorCodes.RES_CONFLICT_USERNAME);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "missing@example.com" });

    expectError(res, 400, ErrorCodes.VAL_MISSING_FIELD);
  });

  it("returns 400 when password does not meet requirements", async () => {
    const validUser = getValidUser();
    const res = await request(app)
      .post("/auth/register")
      .send({
        ...validUser,
        password: "weak",
      });

    expectError(res, 400, ErrorCodes.VAL_FAILED);
  });

  it("returns 400 when email is invalid", async () => {
    const validUser = getValidUser();
    const res = await request(app)
      .post("/auth/register")
      .send({
        ...validUser,
        email: "not-an-email",
      });

    expectError(res, 400, ErrorCodes.VAL_FAILED);
  });
});

describe("POST /auth/login", () => {
  let testUser: UserData;

  beforeEach(async () => {
    testUser = getValidUser();
    const regRes = await request(app).post("/auth/register").send(testUser);
    expect(regRes.status).toBe(201);
  });

  it("logs in user and returns 200 with safe user data", async () => {
    const agent = request.agent(app);

    const res = await agent.post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);

    const parsed = SuccessResponseSchema(SafeUserSchema).safeParse(res.body);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.data.email).toBe(testUser.email);

    const currentUserRes = await agent.get("/users/me");
    expect(currentUserRes.status).toBe(200);
    const currentUserBody = currentUserRes.body as SuccessResponse<SafeUser>;
    expect(currentUserBody.data.email).toBe(testUser.email);
  });

  it("returns 401 with wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "WrongPassword1!",
    });
    expectError(res, 401, ErrorCodes.AUTH_INVALID);
  });

  it("returns 401 when user does not exist", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "nonexistent@example.com",
      password: testUser.password,
    });
    expectError(res, 401, ErrorCodes.AUTH_INVALID);
  });
});

describe("POST /auth/logout", () => {
  let testUser: UserData;

  beforeEach(async () => {
    testUser = getValidUser();
    const regRes = await request(app).post("/auth/register").send(testUser);
    expect(regRes.status).toBe(201);
  });

  it("logs out an authenticated user and clears the session cookie", async () => {
    const agent = request.agent(app);

    const loginRes = await agent.post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(loginRes.status).toBe(200);

    const res = await agent.post("/auth/logout");

    expect(res.status).toBe(200);
    const body = res.body as SuccessResponse<null>;
    expect(body.success).toBe(true);

    const currentUserRes = await agent.get("/users/me");
    expect(currentUserRes.status).toBe(200);
    const currentUserBody = currentUserRes.body as SuccessResponse<null>;
    expect(currentUserBody.data).toBe(null);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).post("/auth/logout");
    expectError(res, 401, ErrorCodes.AUTH_EXPIRED);
  });
});

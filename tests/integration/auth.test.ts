import request from "supertest";
import app from "../../src/app";
import { createTestRoles, createTestEmployees } from "../helpers/testHelpers";

describe("Authentication API", () => {
  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const roles = await createTestRoles();
      await createTestEmployees(roles);
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          identifier: "testadmin@test.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user.email).toBe("testadmin@test.com");
      expect(response.body.data.user.role).toBe("Admin");
    });

    it("should return 401 for invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          identifier: "nonexistent@test.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Invalid credentials");
    });

    it("should return 401 for invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          identifier: "testadmin@test.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toContain("Invalid credentials");
    });

    it("should return 400 for missing identifier", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          password: "password123",
        })
        .expect(400);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for missing password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          identifier: "testadmin@test.com",
        })
        .expect(400);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          identifier: "not-an-email",
          password: "password123",
        })
        .expect(400);

      expect(response.body.status).toBe("error");
      expect(response.body.message).toBe("Validation failed");
    });

    it("should include user role in response", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          identifier: "testmanager@test.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body.data.user.role).toBe("Manager");
    });

    it("should not login inactive employee", async () => {
      // This would require creating an inactive employee first
      // Left as TODO if you implement employee deactivation
    });
  });
});

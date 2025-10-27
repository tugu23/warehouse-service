import request from "supertest";
import app from "../../src/app";
import {
  setupTestEnvironment,
  loginAndGetToken,
  prisma,
} from "../helpers/testHelpers";

describe("Agents API", () => {
  let adminToken: string;
  let managerToken: string;
  let agentToken: string;
  let testData: any;

  beforeEach(async () => {
    testData = await setupTestEnvironment();

    adminToken = await loginAndGetToken(
      request(app),
      "testadmin@test.com",
      "password123"
    );

    managerToken = await loginAndGetToken(
      request(app),
      "testmanager@test.com",
      "password123"
    );

    agentToken = await loginAndGetToken(
      request(app),
      "testagent@test.com",
      "password123"
    );
  });

  describe("POST /api/agents/:id/location", () => {
    it("should record agent location as agent (own location)", async () => {
      const response = await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          latitude: 47.9186,
          longitude: 106.9177,
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.location).toBeDefined();
      expect(response.body.data.location.latitude).toBe(47.9186);
      expect(response.body.data.location.longitude).toBe(106.9177);
      expect(response.body.data.location.agentId).toBe(
        testData.employees.agent.id
      );
    });

    it("should record agent location as admin", async () => {
      const response = await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          latitude: 47.92,
          longitude: 106.91,
        })
        .expect(201);

      expect(response.body.status).toBe("success");
    });

    it("should record agent location as manager", async () => {
      const response = await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          latitude: 47.915,
          longitude: 106.92,
        })
        .expect(201);

      expect(response.body.status).toBe("success");
    });

    it("should not allow agent to record another agent location", async () => {
      // This test assumes the controller checks if agent is recording own location
      // Create another agent
      const anotherAgent = await prisma.employee.create({
        data: {
          name: "Another Agent",
          email: "anotheragent@test.com",
          phoneNumber: "+976-66666666",
          passwordHash: await require("bcryptjs").hash("password123", 10),
          roleId: testData.roles.agentRole.id,
          isActive: true,
        },
      });

      // Try to record location for another agent
      await request(app)
        .post(`/api/agents/${anotherAgent.id}/location`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          latitude: 47.9186,
          longitude: 106.9177,
        })
        .expect(403);
    });

    it("should return 400 for invalid latitude", async () => {
      await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          latitude: "invalid",
          longitude: 106.9177,
        })
        .expect(400);
    });

    it("should return 400 for invalid longitude", async () => {
      await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          latitude: 47.9186,
          longitude: "invalid",
        })
        .expect(400);
    });

    it("should return 400 for missing coordinates", async () => {
      await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({})
        .expect(400);
    });

    it("should return 401 without authentication", async () => {
      await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .send({
          latitude: 47.9186,
          longitude: 106.9177,
        })
        .expect(401);
    });
  });

  describe("GET /api/agents/:id/route", () => {
    beforeEach(async () => {
      // Record some locations for the agent
      await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          latitude: 47.9186,
          longitude: 106.9177,
        });

      await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          latitude: 47.92,
          longitude: 106.91,
        });
    });

    it("should get agent route as admin", async () => {
      const response = await request(app)
        .get(`/api/agents/${testData.employees.agent.id}/route`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("route");
      expect(Array.isArray(response.body.data.route)).toBe(true);
      expect(response.body.data.route.length).toBeGreaterThan(0);
    });

    it("should get agent route as manager", async () => {
      const response = await request(app)
        .get(`/api/agents/${testData.employees.agent.id}/route`)
        .set("Authorization", `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
    });

    it("should not allow agent to access route endpoint", async () => {
      await request(app)
        .get(`/api/agents/${testData.employees.agent.id}/route`)
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(403);
    });

    it("should filter route by date range", async () => {
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .get(`/api/agents/${testData.employees.agent.id}/route`)
        .query({ startDate, endDate })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("route");
      expect(response.body.data).toHaveProperty("totalPoints");
    });

    it("should return 400 for invalid date format", async () => {
      await request(app)
        .get(`/api/agents/${testData.employees.agent.id}/route`)
        .query({ startDate: "invalid-date" })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });

    it("should return 404 for non-existent agent", async () => {
      await request(app)
        .get("/api/agents/99999/route")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe("GET /api/agents/locations/all", () => {
    beforeEach(async () => {
      // Record locations for the agent
      await request(app)
        .post(`/api/agents/${testData.employees.agent.id}/location`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          latitude: 47.9186,
          longitude: 106.9177,
        });
    });

    it("should get all agent locations as admin", async () => {
      const response = await request(app)
        .get("/api/agents/locations/all")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("agents");
      expect(Array.isArray(response.body.data.agents)).toBe(true);
    });

    it("should get all agent locations as manager", async () => {
      const response = await request(app)
        .get("/api/agents/locations/all")
        .set("Authorization", `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
    });

    it("should not allow agent to access all locations", async () => {
      await request(app)
        .get("/api/agents/locations/all")
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(403);
    });

    it("should filter by date", async () => {
      const date = new Date().toISOString();

      const response = await request(app)
        .get("/api/agents/locations/all")
        .query({ date })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
    });

    it("should return 400 for invalid date format", async () => {
      await request(app)
        .get("/api/agents/locations/all")
        .query({ date: "invalid-date" })
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });

    it("should return 401 without authentication", async () => {
      await request(app).get("/api/agents/locations/all").expect(401);
    });
  });
});

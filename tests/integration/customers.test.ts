import request from "supertest";
import app from "../../src/app";
import { setupTestEnvironment, loginAndGetToken } from "../helpers/testHelpers";

describe("Customers API", () => {
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

  describe("POST /api/customers", () => {
    it("should create customer as admin", async () => {
      const response = await request(app)
        .post("/api/customers")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Customer Store",
          address: "District 2, UB",
          phoneNumber: "+976-88888888",
          locationLatitude: 47.92,
          locationLongitude: 106.91,
          customerTypeId: testData.customerTypes.wholesale.id,
          assignedAgentId: testData.employees.agent.id,
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.customer.name).toBe("New Customer Store");
      expect(response.body.data.customer.customerTypeId).toBe(
        testData.customerTypes.wholesale.id
      );
    });

    it("should create customer as manager", async () => {
      const response = await request(app)
        .post("/api/customers")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          name: "Manager Customer",
          address: "Test Address",
        })
        .expect(201);

      expect(response.body.status).toBe("success");
    });

    it("should not allow agent to create customer", async () => {
      await request(app)
        .post("/api/customers")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          name: "Agent Customer",
        })
        .expect(403);
    });

    it("should return 400 for missing name", async () => {
      await request(app)
        .post("/api/customers")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          address: "Some address",
        })
        .expect(400);
    });
  });

  describe("GET /api/customers", () => {
    it("should get all customers as admin", async () => {
      const response = await request(app)
        .get("/api/customers")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("customers");
      expect(Array.isArray(response.body.data.customers)).toBe(true);
      expect(response.body.data.customers.length).toBeGreaterThan(0);
    });

    it("should get all customers as manager", async () => {
      const response = await request(app)
        .get("/api/customers")
        .set("Authorization", `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("customers");
      expect(Array.isArray(response.body.data.customers)).toBe(true);
    });

    it("should get only assigned customers as agent", async () => {
      const response = await request(app)
        .get("/api/customers")
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("customers");
      expect(Array.isArray(response.body.data.customers)).toBe(true);
      // Agent should only see their assigned customers
      response.body.data.customers.forEach((customer: any) => {
        expect(customer.assignedAgentId).toBe(testData.employees.agent.id);
      });
    });

    it("should return 401 without authentication", async () => {
      await request(app).get("/api/customers").expect(401);
    });
  });

  describe("GET /api/customers/:id", () => {
    it("should get customer by id as admin", async () => {
      const response = await request(app)
        .get(`/api/customers/${testData.customer.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.customer.id).toBe(testData.customer.id);
      expect(response.body.data.customer.name).toBe("Test Customer");
    });

    it("should get assigned customer as agent", async () => {
      const response = await request(app)
        .get(`/api/customers/${testData.customer.id}`)
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.customer.id).toBe(testData.customer.id);
    });

    it("should return 404 for non-existent customer", async () => {
      await request(app)
        .get("/api/customers/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should return 400 for invalid id format", async () => {
      await request(app)
        .get("/api/customers/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });
  });

  describe("PUT /api/customers/:id", () => {
    it("should update customer as admin", async () => {
      const response = await request(app)
        .put(`/api/customers/${testData.customer.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated Customer Name",
          address: "New Address",
          phoneNumber: "+976-77777777",
        })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.customer.name).toBe("Updated Customer Name");
      expect(response.body.data.customer.address).toBe("New Address");
    });

    it("should update customer location", async () => {
      const response = await request(app)
        .put(`/api/customers/${testData.customer.id}`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          locationLatitude: 48.0,
          locationLongitude: 107.0,
        })
        .expect(200);

      expect(response.body.data.customer.locationLatitude).toBe(48.0);
      expect(response.body.data.customer.locationLongitude).toBe(107.0);
    });

    it("should not allow agent to update customer", async () => {
      await request(app)
        .put(`/api/customers/${testData.customer.id}`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          name: "Agent Update",
        })
        .expect(403);
    });

    it("should return 404 for non-existent customer", async () => {
      await request(app)
        .put("/api/customers/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Update" })
        .expect(404);
    });

    it("should reassign customer to different agent", async () => {
      // Create another agent first
      const anotherAgent = await request(app)
        .post("/api/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Another Agent",
          email: "anotheragent@test.com",
          password: "password123",
          roleName: "SalesAgent",
        });

      const response = await request(app)
        .put(`/api/customers/${testData.customer.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          assignedAgentId: anotherAgent.body.data.id,
        })
        .expect(200);

      expect(response.body.data.assignedAgentId).toBe(
        anotherAgent.body.data.id
      );
    });
  });
});

import request from "supertest";
import app from "../../src/app";
import { setupTestEnvironment, loginAndGetToken } from "../helpers/testHelpers";

describe("Employees API", () => {
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

  describe("POST /api/employees", () => {
    it("should create employee as admin", async () => {
      const response = await request(app)
        .post("/api/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Employee",
          email: "newemployee@test.com",
          phoneNumber: "+976-44444444",
          password: "password123",
          roleName: "Manager",
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.employee.name).toBe("New Employee");
      expect(response.body.data.employee.email).toBe("newemployee@test.com");
    });

    it("should not create employee without admin role", async () => {
      await request(app)
        .post("/api/employees")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          name: "New Employee",
          email: "newemployee@test.com",
          password: "password123",
          roleName: "Manager",
        })
        .expect(403);
    });

    it("should return 401 without authentication", async () => {
      await request(app)
        .post("/api/employees")
        .send({
          name: "New Employee",
          email: "newemployee@test.com",
          password: "password123",
          roleName: "Manager",
        })
        .expect(401);
    });

    it("should return 400 for invalid email", async () => {
      const response = await request(app)
        .post("/api/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Employee",
          email: "invalid-email",
          password: "password123",
          roleName: "Manager",
        })
        .expect(400);

      expect(response.body.status).toBe("error");
    });

    it("should return 400 for short password", async () => {
      await request(app)
        .post("/api/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Employee",
          email: "newemployee@test.com",
          password: "123",
          roleName: "Manager",
        })
        .expect(400);
    });

    it("should return 400 for invalid role", async () => {
      await request(app)
        .post("/api/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Employee",
          email: "newemployee@test.com",
          password: "password123",
          roleName: "InvalidRole",
        })
        .expect(400);
    });
  });

  describe("GET /api/employees", () => {
    it("should get all employees as admin", async () => {
      const response = await request(app)
        .get("/api/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("employees");
      expect(Array.isArray(response.body.data.employees)).toBe(true);
      expect(response.body.data.employees.length).toBeGreaterThan(0);
    });

    it("should not allow non-admin to access", async () => {
      await request(app)
        .get("/api/employees")
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(403);
    });
  });

  describe("GET /api/employees/:id", () => {
    it("should get employee by id as admin", async () => {
      const response = await request(app)
        .get(`/api/employees/${testData.employees.manager.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.employee.id).toBe(
        testData.employees.manager.id
      );
      expect(response.body.data.employee.email).toBe("testmanager@test.com");
    });

    it("should return 404 for non-existent employee", async () => {
      await request(app)
        .get("/api/employees/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should return 400 for invalid id format", async () => {
      await request(app)
        .get("/api/employees/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });
  });

  describe("PUT /api/employees/:id", () => {
    it("should update employee as admin", async () => {
      const response = await request(app)
        .put(`/api/employees/${testData.employees.manager.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated Manager Name",
          phoneNumber: "+976-55555555",
        })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.employee.name).toBe("Updated Manager Name");
    });

    it("should update employee role", async () => {
      const response = await request(app)
        .put(`/api/employees/${testData.employees.agent.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          roleName: "Manager",
        })
        .expect(200);

      expect(response.body.status).toBe("success");
    });

    it("should deactivate employee", async () => {
      const response = await request(app)
        .put(`/api/employees/${testData.employees.agent.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          isActive: false,
        })
        .expect(200);

      expect(response.body.data.employee.isActive).toBe(false);
    });

    it("should return 404 for non-existent employee", async () => {
      await request(app)
        .put("/api/employees/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "New Name" })
        .expect(404);
    });
  });

  describe("DELETE /api/employees/:id", () => {
    it("should delete employee as admin", async () => {
      // Create a temporary employee to delete with unique email
      const uniqueEmail = `temp-${Date.now()}@test.com`;
      const tempEmployee = await request(app)
        .post("/api/employees")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Temp Employee",
          email: uniqueEmail,
          phoneNumber: "+976-99999999",
          password: "password123",
          roleName: "SalesAgent",
        })
        .expect(201);

      const tempEmployeeId = tempEmployee.body.data.employee.id;

      await request(app)
        .delete(`/api/employees/${tempEmployeeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      // Verify employee is soft-deleted (isActive set to false)
      const deletedEmployee = await request(app)
        .get(`/api/employees/${tempEmployeeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(deletedEmployee.body.data.employee.isActive).toBe(false);
    });

    it("should return 404 for non-existent employee", async () => {
      await request(app)
        .delete("/api/employees/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should not allow non-admin to delete", async () => {
      await request(app)
        .delete(`/api/employees/${testData.employees.agent.id}`)
        .set("Authorization", `Bearer ${managerToken}`)
        .expect(403);
    });
  });
});

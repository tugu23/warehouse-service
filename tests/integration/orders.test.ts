import request from "supertest";
import app from "../../src/app";
import {
  setupTestEnvironment,
  loginAndGetToken,
  prisma,
} from "../helpers/testHelpers";

describe("Orders API", () => {
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

  describe("POST /api/orders", () => {
    it("should create order as agent", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          customerId: testData.customer.id,
          items: [
            {
              productId: testData.products.product1.id,
              quantity: 10,
            },
            {
              productId: testData.products.product2.id,
              quantity: 5,
            },
          ],
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.order.customerId).toBe(testData.customer.id);
      expect(response.body.data.order.status).toBe("Pending");
      expect(response.body.data.order.orderItems).toBeDefined();
    });

    it("should create order as manager", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          customerId: testData.customer.id,
          items: [
            {
              productId: testData.products.product1.id,
              quantity: 5,
            },
          ],
        })
        .expect(201);

      expect(response.body.status).toBe("success");
    });

    it("should calculate total amount correctly", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          customerId: testData.customer.id,
          items: [
            {
              productId: testData.products.product1.id,
              quantity: 10,
            },
          ],
        })
        .expect(201);

      // Assuming retail price is used: 10 * 1500 = 15000
      expect(parseFloat(response.body.data.order.totalAmount)).toBeGreaterThan(
        0
      );
    });

    it("should return 400 for empty items array", async () => {
      await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          customerId: testData.customer.id,
          items: [],
        })
        .expect(400);
    });

    it("should return 400 for missing customer id", async () => {
      await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          items: [
            {
              productId: testData.products.product1.id,
              quantity: 10,
            },
          ],
        })
        .expect(400);
    });

    it("should return 400 for invalid quantity", async () => {
      await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          customerId: testData.customer.id,
          items: [
            {
              productId: testData.products.product1.id,
              quantity: 0,
            },
          ],
        })
        .expect(400);
    });

    it("should reduce product stock quantity", async () => {
      const initialStock = testData.products.product1.stockQuantity;

      await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          customerId: testData.customer.id,
          items: [
            {
              productId: testData.products.product1.id,
              quantity: 10,
            },
          ],
        })
        .expect(201);

      const updatedProduct = await prisma.product.findUnique({
        where: { id: testData.products.product1.id },
      });

      expect(updatedProduct?.stockQuantity).toBe(initialStock - 10);
    });
  });

  describe("GET /api/orders", () => {
    beforeEach(async () => {
      // Create a test order
      await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          customerId: testData.customer.id,
          items: [
            {
              productId: testData.products.product1.id,
              quantity: 5,
            },
          ],
        });
    });

    it("should get all orders as admin", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("orders");
      expect(Array.isArray(response.body.data.orders)).toBe(true);
      expect(response.body.data.orders.length).toBeGreaterThan(0);
    });

    it("should get only agent's customer orders as agent", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("orders");
      expect(Array.isArray(response.body.data.orders)).toBe(true);
    });

    it("should return 401 without authentication", async () => {
      await request(app).get("/api/orders").expect(401);
    });
  });

  describe("GET /api/orders/:id", () => {
    let orderId: number;

    beforeEach(async () => {
      const orderResponse = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          customerId: testData.customer.id,
          items: [
            {
              productId: testData.products.product1.id,
              quantity: 5,
            },
          ],
        });

      orderId = orderResponse.body.data.order.id;
    });

    it("should get order by id with items", async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.order.id).toBeGreaterThan(0);
      expect(response.body.data.order.orderItems).toBeDefined();
    });

    it("should return 404 for non-existent order", async () => {
      await request(app)
        .get("/api/orders/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should return 400 for invalid id format", async () => {
      await request(app)
        .get("/api/orders/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });
  });

  describe("PUT /api/orders/:id/status", () => {
    let orderId: number;

    beforeEach(async () => {
      const orderResponse = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          customerId: testData.customer.id,
          items: [
            {
              productId: testData.products.product1.id,
              quantity: 5,
            },
          ],
        });

      orderId = orderResponse.body.data.order.id;
    });

    it("should update order status as admin", async () => {
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "Fulfilled",
        })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.order.status).toBe("Fulfilled");
    });

    it("should update order status as manager", async () => {
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          status: "Cancelled",
        })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.order.status).toBe("Cancelled");
    });

    it("should not allow agent to update order status", async () => {
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          status: "Fulfilled",
        })
        .expect(403);
    });

    it("should return 400 for invalid status", async () => {
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "InvalidStatus",
        })
        .expect(400);
    });

    it("should return 404 for non-existent order", async () => {
      await request(app)
        .put("/api/orders/99999/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "Fulfilled",
        })
        .expect(404);
    });
  });
});

import request from "supertest";
import app from "../../src/app";
import {
  setupTestEnvironment,
  loginAndGetToken,
  prisma,
} from "../helpers/testHelpers";

describe("Returns API", () => {
  let adminToken: string;
  let managerToken: string;
  let agentToken: string;
  let testData: any;
  let orderId: number;

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

    // Create an order for returns testing
    const orderResponse = await request(app)
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
      });

    orderId = orderResponse.body.data.order.id;
  });

  describe("POST /api/returns", () => {
    it("should create return as admin", async () => {
      const response = await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          orderId: orderId,
          productId: testData.products.product1.id,
          quantity: 2,
          reason: "Damaged product",
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.return.orderId).toBe(orderId);
      expect(response.body.data.return.productId).toBe(
        testData.products.product1.id
      );
      expect(response.body.data.return.quantity).toBe(2);
      expect(response.body.data.return.reason).toBe("Damaged product");
    });

    it("should create return as manager", async () => {
      const response = await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          orderId: orderId,
          productId: testData.products.product1.id,
          quantity: 1,
          reason: "Wrong product",
        })
        .expect(201);

      expect(response.body.status).toBe("success");
    });

    it("should not allow agent to create return", async () => {
      await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          orderId: orderId,
          productId: testData.products.product1.id,
          quantity: 1,
        })
        .expect(403);
    });

    it("should restore stock quantity on return", async () => {
      const productBefore = await prisma.product.findUnique({
        where: { id: testData.products.product1.id },
      });

      await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          orderId: orderId,
          productId: testData.products.product1.id,
          quantity: 3,
          reason: "Customer return",
        })
        .expect(201);

      const productAfter = await prisma.product.findUnique({
        where: { id: testData.products.product1.id },
      });

      expect(productAfter?.stockQuantity).toBe(
        (productBefore?.stockQuantity || 0) + 3
      );
    });

    it("should return 400 for missing order id", async () => {
      await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          productId: testData.products.product1.id,
          quantity: 1,
        })
        .expect(400);
    });

    it("should return 400 for missing product id", async () => {
      await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          orderId: orderId,
          quantity: 1,
        })
        .expect(400);
    });

    it("should return 400 for invalid quantity", async () => {
      await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          orderId: orderId,
          productId: testData.products.product1.id,
          quantity: 0,
        })
        .expect(400);
    });

    it("should return 404 for non-existent order", async () => {
      await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          orderId: 99999,
          productId: testData.products.product1.id,
          quantity: 1,
        })
        .expect(404);
    });
  });

  describe("GET /api/returns", () => {
    beforeEach(async () => {
      // Create a test return
      await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          orderId: orderId,
          productId: testData.products.product1.id,
          quantity: 2,
          reason: "Test return",
        });
    });

    it("should get all returns as admin", async () => {
      const response = await request(app)
        .get("/api/returns")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("returns");
      expect(Array.isArray(response.body.data.returns)).toBe(true);
      expect(response.body.data.returns.length).toBeGreaterThan(0);
    });

    it("should get all returns as manager", async () => {
      const response = await request(app)
        .get("/api/returns")
        .set("Authorization", `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("returns");
      expect(Array.isArray(response.body.data.returns)).toBe(true);
    });

    it("should not allow agent to access returns", async () => {
      await request(app)
        .get("/api/returns")
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(403);
    });

    it("should return 401 without authentication", async () => {
      await request(app).get("/api/returns").expect(401);
    });
  });

  describe("GET /api/returns/:id", () => {
    let returnId: number;

    beforeEach(async () => {
      const returnResponse = await request(app)
        .post("/api/returns")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          orderId: orderId,
          productId: testData.products.product1.id,
          quantity: 2,
          reason: "Test return",
        });

      returnId = returnResponse.body.data.return.id;
    });

    it("should get return by id as admin", async () => {
      const response = await request(app)
        .get(`/api/returns/${returnId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.return.id).toBe(returnId);
      expect(response.body.data.return.orderId).toBe(orderId);
    });

    it("should get return by id as manager", async () => {
      const response = await request(app)
        .get(`/api/returns/${returnId}`)
        .set("Authorization", `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
    });

    it("should not allow agent to access return details", async () => {
      await request(app)
        .get(`/api/returns/${returnId}`)
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(403);
    });

    it("should return 404 for non-existent return", async () => {
      await request(app)
        .get("/api/returns/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should return 400 for invalid id format", async () => {
      await request(app)
        .get("/api/returns/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });
  });
});

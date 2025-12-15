import request from "supertest";
import app from "../../src/app";
import { setupTestEnvironment, loginAndGetToken } from "../helpers/testHelpers";

describe("Products API", () => {
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

  describe("POST /api/products", () => {
    it("should create product as admin", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Шинэ бараа",
          nameEnglish: "New Product",
          productCode: "TEST-003",
          supplierId: testData.supplier.id,
          stockQuantity: 75,
          priceWholesale: 1500,
          priceRetail: 2000,
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.product.nameMongolian).toBe("Шинэ бараа");
      expect(response.body.data.product.nameEnglish).toBe("New Product");
      expect(response.body.data.product.stockQuantity).toBe(75);
    });

    it("should create product with isActive field", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Идэвхгүй бараа",
          nameEnglish: "Inactive Product",
          productCode: "TEST-INACTIVE",
          supplierId: testData.supplier.id,
          isActive: false,
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.product.isActive).toBe(false);
    });

    it("should default isActive to true when not provided", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Идэвхтэй бараа",
          nameEnglish: "Active Product",
          productCode: "TEST-ACTIVE",
          supplierId: testData.supplier.id,
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.product.isActive).toBe(true);
    });

    it("should create product as manager", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          nameMongolian: "Менежерийн бараа",
          nameEnglish: "Manager Product",
          productCode: "TEST-004",
          supplierId: testData.supplier.id,
        })
        .expect(201);

      expect(response.body.status).toBe("success");
    });

    it("should not allow agent to create product", async () => {
      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          nameMongolian: "Агентын бараа",
          supplierId: testData.supplier.id,
        })
        .expect(403);
    });

    it("should return 400 for missing Mongolian name", async () => {
      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameEnglish: "Product without Mongolian name",
          supplierId: testData.supplier.id,
        })
        .expect(400);
    });
  });

  describe("GET /api/products", () => {
    it("should get all products for authenticated user", async () => {
      const response = await request(app)
        .get("/api/products")
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("products");
      expect(Array.isArray(response.body.data.products)).toBe(true);
      expect(response.body.data.products.length).toBeGreaterThan(0);
    });

    it("should return 401 without authentication", async () => {
      await request(app).get("/api/products").expect(401);
    });

    it("should include product details", async () => {
      const response = await request(app)
        .get("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      const product = response.body.data.products[0];
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("nameMongolian");
      expect(product).toHaveProperty("stockQuantity");
      expect(product).toHaveProperty("priceRetail");
      expect(product).toHaveProperty("isActive");
      expect(typeof product.isActive).toBe("boolean");
    });
  });

  describe("GET /api/products/:id", () => {
    it("should get product by id", async () => {
      const response = await request(app)
        .get(`/api/products/${testData.products.product1.id}`)
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.product.id).toBe(testData.products.product1.id);
      expect(response.body.data.product.nameEnglish).toBe("Test Product 1");
    });

    it("should return 404 for non-existent product", async () => {
      await request(app)
        .get("/api/products/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should return 400 for invalid id format", async () => {
      await request(app)
        .get("/api/products/invalid")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should update product as admin", async () => {
      const response = await request(app)
        .put(`/api/products/${testData.products.product1.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Шинэчлэгдсэн бараа",
          nameEnglish: "Updated Product",
          priceRetail: 1800,
        })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.product.nameEnglish).toBe("Updated Product");
      expect(parseFloat(response.body.data.product.priceRetail)).toBe(1800);
    });

    it("should toggle product isActive status", async () => {
      const response = await request(app)
        .put(`/api/products/${testData.products.product1.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          isActive: false,
        })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.product.isActive).toBe(false);

      // Toggle back to active
      const response2 = await request(app)
        .put(`/api/products/${testData.products.product1.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          isActive: true,
        })
        .expect(200);

      expect(response2.body.data.product.isActive).toBe(true);
    });

    it("should update product as manager", async () => {
      const response = await request(app)
        .put(`/api/products/${testData.products.product2.id}`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          priceWholesale: 2200,
        })
        .expect(200);

      expect(parseFloat(response.body.data.product.priceWholesale)).toBe(2200);
    });

    it("should not allow agent to update product", async () => {
      await request(app)
        .put(`/api/products/${testData.products.product1.id}`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          nameEnglish: "Agent Update",
        })
        .expect(403);
    });

    it("should return 404 for non-existent product", async () => {
      await request(app)
        .put("/api/products/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ nameEnglish: "Update" })
        .expect(404);
    });
  });

  describe("POST /api/products/inventory/adjust", () => {
    it("should adjust inventory as admin", async () => {
      const response = await request(app)
        .post("/api/products/inventory/adjust")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          productId: testData.products.product1.id,
          adjustment: 50,
          reason: "Stock replenishment",
        })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("product");
      expect(response.body.data.product.stockQuantity).toBeGreaterThan(0);
    });

    it("should adjust inventory as manager", async () => {
      const response = await request(app)
        .post("/api/products/inventory/adjust")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          productId: testData.products.product2.id,
          adjustment: -10,
          reason: "Damaged goods",
        })
        .expect(200);

      expect(response.body.status).toBe("success");
    });

    it("should not allow agent to adjust inventory", async () => {
      await request(app)
        .post("/api/products/inventory/adjust")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          productId: testData.products.product1.id,
          adjustment: 10,
        })
        .expect(403);
    });

    it("should return 400 for invalid adjustment type", async () => {
      await request(app)
        .post("/api/products/inventory/adjust")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          productId: testData.products.product1.id,
          adjustment: "not-a-number",
        })
        .expect(400);
    });

    it("should return 404 for non-existent product", async () => {
      await request(app)
        .post("/api/products/inventory/adjust")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          productId: 99999,
          adjustment: 10,
        })
        .expect(404);
    });
  });
});

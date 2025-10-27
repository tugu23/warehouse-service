import request from "supertest";
import app from "../../src/app";
import { setupTestEnvironment, loginAndGetToken } from "../helpers/testHelpers";

describe("Categories API", () => {
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

  describe("POST /api/categories", () => {
    it("should create category as admin", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Хүнсний бүтээгдэхүүн",
          nameEnglish: "Food Products",
          description: "All food and grocery items",
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.category.nameMongolian).toBe(
        "Хүнсний бүтээгдэхүүн"
      );
      expect(response.body.data.category.nameEnglish).toBe("Food Products");
      expect(response.body.data.category.description).toBe(
        "All food and grocery items"
      );
    });

    it("should create category as manager", async () => {
      const response = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          nameMongolian: "Ундаа",
          nameEnglish: "Beverages",
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.category.nameMongolian).toBe("Ундаа");
    });

    it("should not allow agent to create category", async () => {
      await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          nameMongolian: "Агентын ангилал",
          nameEnglish: "Agent Category",
        })
        .expect(403);
    });

    it("should return 400 for missing Mongolian name", async () => {
      await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameEnglish: "Category without Mongolian name",
        })
        .expect(400);
    });

    it("should not allow duplicate category names", async () => {
      // Create first category
      await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Unique Category",
          nameEnglish: "Unique Category EN",
        })
        .expect(201);

      // Try to create duplicate
      await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Unique Category",
          nameEnglish: "Another Name",
        })
        .expect(400);
    });
  });

  describe("GET /api/categories", () => {
    it("should get all categories for authenticated user", async () => {
      const response = await request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.categories).toBeDefined();
      expect(Array.isArray(response.body.data.categories)).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });

    it("should support search query", async () => {
      // Create test categories
      await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Хүнс",
          nameEnglish: "Food",
        });

      await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Ундаа",
          nameEnglish: "Drinks",
        });

      const response = await request(app)
        .get("/api/categories?search=Food")
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(200);

      expect(response.body.data.categories).toBeDefined();
    });

    it("should not allow unauthenticated access", async () => {
      await request(app).get("/api/categories").expect(401);
    });
  });

  describe("GET /api/categories/:id", () => {
    it("should get category by id with associated products", async () => {
      // Create a category
      const categoryResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Тест ангилал",
          nameEnglish: "Test Category",
        })
        .expect(201);

      const categoryId = categoryResponse.body.data.category.id;

      // Create a product in this category
      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Тест бараа",
          nameEnglish: "Test Product",
          productCode: "TEST-CAT-001",
          categoryId: categoryId,
          supplierId: testData.supplier.id,
        })
        .expect(201);

      // Get category with products
      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.category.id).toBe(categoryId);
      expect(response.body.data.category.products).toBeDefined();
      expect(Array.isArray(response.body.data.category.products)).toBe(true);
    });

    it("should return 404 for non-existent category", async () => {
      await request(app)
        .get("/api/categories/99999")
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(404);
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("should update category as admin", async () => {
      // Create category
      const createResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Өгөгдмөл ангилал",
          nameEnglish: "Original Category",
        })
        .expect(201);

      const categoryId = createResponse.body.data.category.id;

      // Update category
      const updateResponse = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Шинэчлэгдсэн ангилал",
          nameEnglish: "Updated Category",
          description: "Updated description",
        })
        .expect(200);

      expect(updateResponse.body.status).toBe("success");
      expect(updateResponse.body.data.category.nameMongolian).toBe(
        "Шинэчлэгдсэн ангилал"
      );
      expect(updateResponse.body.data.category.nameEnglish).toBe(
        "Updated Category"
      );
    });

    it("should not allow agent to update category", async () => {
      // Create category
      const createResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Тест ангилал",
          nameEnglish: "Test Category",
        })
        .expect(201);

      const categoryId = createResponse.body.data.category.id;

      // Try to update as agent
      await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          nameMongolian: "Updated by agent",
        })
        .expect(403);
    });

    it("should return 404 for non-existent category", async () => {
      await request(app)
        .put("/api/categories/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Updated name",
        })
        .expect(404);
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("should delete category without products as admin", async () => {
      // Create category
      const createResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Устгах ангилал",
          nameEnglish: "Delete Category",
        })
        .expect(201);

      const categoryId = createResponse.body.data.category.id;

      // Delete category
      const deleteResponse = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(deleteResponse.body.status).toBe("success");
      expect(deleteResponse.body.message).toBe("Category deleted successfully");

      // Verify deletion
      await request(app)
        .get(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });

    it("should not delete category with associated products", async () => {
      // Create category
      const categoryResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Бүтээгдэхүүнтэй ангилал",
          nameEnglish: "Category with Products",
        })
        .expect(201);

      const categoryId = categoryResponse.body.data.category.id;

      // Create product in this category
      await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Бараа",
          nameEnglish: "Product",
          productCode: "TEST-DEL-001",
          categoryId: categoryId,
          supplierId: testData.supplier.id,
        })
        .expect(201);

      // Try to delete category
      await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(400);
    });

    it("should not allow agent to delete category", async () => {
      // Create category
      const createResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          nameMongolian: "Тест ангилал",
          nameEnglish: "Test Category",
        })
        .expect(201);

      const categoryId = createResponse.body.data.category.id;

      // Try to delete as agent
      await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${agentToken}`)
        .expect(403);
    });

    it("should return 404 for non-existent category", async () => {
      await request(app)
        .delete("/api/categories/99999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});

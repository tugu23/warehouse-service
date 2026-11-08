import request from "supertest";
import app from "../../src/app";
import {
  createTestRoles,
  createTestEmployees,
  createCustomerTypes,
  createTestSupplier,
  createTestProducts,
  createTestCustomer,
} from "../helpers/testHelpers";

/** Logs in and returns the JWT for the given test account. */
async function login(email: string, password: string): Promise<string> {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ identifier: email, password });

  return response.body?.data?.token;
}

/**
 * The order and customer endpoints embed the full employee record, which
 * carries the bcrypt hash. These tests pin the behaviour that the hash never
 * reaches the client.
 */
describe("Password hash exposure", () => {
  let adminToken: string;
  let agentToken: string;
  let customerId: number;
  let productId: number;

  // The shared setup wipes the tables after every test, so the fixtures have
  // to be rebuilt before each one.
  beforeEach(async () => {
    const roles = await createTestRoles();
    const employees = await createTestEmployees(roles);
    const customerTypes = await createCustomerTypes();
    const supplier = await createTestSupplier();
    const products = await createTestProducts(supplier.id);
    const customer = await createTestCustomer(
      customerTypes.retail.id,
      employees.agent.id
    );

    customerId = customer.id;
    productId = products.product1.id;

    adminToken = await login("testadmin@test.com", "password123");
    agentToken = await login("testagent@test.com", "password123");
  });

  it("does not expose passwordHash on the orders list", async () => {
    await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        customerId,
        items: [{ productId, quantity: 1 }],
        paymentMethod: "Cash",
        orderType: "Store",
      })
      .expect(201);

    const response = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).not.toContain("passwordHash");
  });

  it("does not expose passwordHash on a single order", async () => {
    const created = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        customerId,
        items: [{ productId, quantity: 1 }],
        paymentMethod: "Cash",
        orderType: "Store",
      })
      .expect(201);

    const orderId = created.body?.data?.order?.id;
    expect(orderId).toBeDefined();

    const detail = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(detail.status).toBe(200);
    expect(JSON.stringify(detail.body)).not.toContain("passwordHash");
  });

  it("does not expose passwordHash on the customers list", async () => {
    const response = await request(app)
      .get("/api/customers")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).not.toContain("passwordHash");
  });

  it("does not expose passwordHash on a single customer", async () => {
    const response = await request(app)
      .get(`/api/customers/${customerId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).not.toContain("passwordHash");
  });

  it("still returns the employee fields the app needs", async () => {
    const response = await request(app)
      .get("/api/employees/me")
      .set("Authorization", `Bearer ${agentToken}`);

    expect(response.status).toBe(200);
    expect(response.body?.data?.employee?.email).toBe("testagent@test.com");
    expect(response.body?.data?.employee?.role).toBeDefined();
    expect(response.body?.data?.employee?.id).toBeDefined();
  });
});

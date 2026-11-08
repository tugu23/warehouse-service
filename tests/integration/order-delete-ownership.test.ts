import request from "supertest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import app from "../../src/app";
import {
  createTestRoles,
  createTestEmployees,
  createCustomerTypes,
  createTestSupplier,
  createTestProducts,
  createTestCustomer,
} from "../helpers/testHelpers";

/**
 * A sales agent owns the orders they create. Deleting an order is only
 * allowed for the agent who created it; an admin or manager may delete any
 * order. These tests run against the isolated test database only.
 */
describe("Order delete ownership", () => {
  const prisma = new PrismaClient();
  let adminToken: string;
  let agentToken: string;
  let otherAgentToken: string;
  let customerId: number;
  let productId: number;

  async function login(email: string, password: string): Promise<string> {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ identifier: email, password });

    return response.body?.data?.token;
  }

  /** Creates an order and returns its id. */
  async function createOrder(token: string): Promise<number> {
    const created = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        customerId,
        items: [{ productId, quantity: 1 }],
        paymentMethod: "Cash",
        orderType: "Store",
      })
      .expect(201);

    const id = created.body?.data?.order?.id;
    expect(id).toBeDefined();
    return id;
  }

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

    // A second sales agent, used to prove that an agent cannot touch another
    // agent's order.
    await prisma.employee.create({
      data: {
        name: "Other Agent",
        email: "otheragent@test.com",
        phoneNumber: "+976-44444444",
        passwordHash: await bcrypt.hash("password123", 10),
        roleId: roles.agentRole.id,
        isActive: true,
      },
    });
    otherAgentToken = await login("otheragent@test.com", "password123");
  });

  it("lets a sales agent delete an order they created", async () => {
    const orderId = await createOrder(agentToken);

    const response = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${agentToken}`);

    expect(response.status).toBe(200);
    expect(response.body?.status).toBe("success");

    const after = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(after.status).toBe(404);
  });

  it("refuses to let a sales agent delete another agent's order", async () => {
    const orderId = await createOrder(agentToken);

    const response = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${otherAgentToken}`);

    expect(response.status).toBe(403);

    // The order must still exist.
    const after = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(after.status).toBe(200);
  });

  it("lets an admin delete an order created by a sales agent", async () => {
    const orderId = await createOrder(agentToken);

    const response = await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
  });

  it("refuses an unauthenticated delete", async () => {
    const orderId = await createOrder(agentToken);

    const response = await request(app).delete(`/api/orders/${orderId}`);

    expect(response.status).toBe(401);
  });

  it("applies the ownership check to every sales-agent role alias", async () => {
    // The legacy seeds also create MarketSalesperson / StoreSalesperson. A
    // literal "Agent"/"SalesAgent" comparison used to let those roles delete
    // anyone's order.
    for (const roleName of ["MarketSalesperson", "StoreSalesperson"]) {
      const role = await prisma.role.create({ data: { name: roleName } });
      const employee = await prisma.employee.create({
        data: {
          name: `Agent ${roleName}`,
          email: `${roleName.toLowerCase()}@test.com`,
          phoneNumber: "+976-55555555",
          passwordHash: await bcrypt.hash("password123", 10),
          roleId: role.id,
          isActive: true,
        },
      });

      const token = await login(employee.email, "password123");
      const orderId = await createOrder(agentToken);

      const response = await request(app)
        .delete(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
    }
  });
});

import { Request, Response, NextFunction } from "express";

/**
 * Employee records are included in many query results (the agent on an
 * order, the assigned agent on a customer, the creator on a payment).
 * Prisma returns every column, so the bcrypt hash travels with them.
 *
 * Stripping it here keeps every endpoint safe without having to remember a
 * `select` clause at each of the many include sites.
 */
const SENSITIVE_EMPLOYEE_FIELDS = ["passwordHash"] as const;

type EmployeeLike = Record<string, unknown> & {
  passwordHash?: unknown;
};

/** Removes the password hash from one employee-shaped object. */
function scrubEmployee(employee: EmployeeLike): void {
  for (const field of SENSITIVE_EMPLOYEE_FIELDS) {
    if (field in employee) {
      delete employee[field];
    }
  }
}

/** Recursively scrubs employee objects nested in a response payload. */
function scrubValue(value: unknown, depth = 0): unknown {
  // Guard against pathological nesting; API payloads are shallow in practice.
  if (depth > 8) return value;

  if (Array.isArray(value)) {
    for (const item of value) scrubValue(item, depth + 1);
    return value;
  }

  if (value === null || typeof value !== "object") return value;

  const record = value as Record<string, unknown>;

  // An object that carries an employee role and id is an employee record.
  if ("passwordHash" in record) {
    scrubEmployee(record as EmployeeLike);
  }

  for (const nested of Object.values(record)) {
    scrubValue(nested, depth + 1);
  }

  return value;
}

/**
 * Response interceptor that removes password hashes from every JSON payload.
 */
export const scrubPasswordHash = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalJson = res.json.bind(res);

  res.json = ((body: unknown) => {
    if (body !== null && typeof body === "object") {
      scrubValue(body);
    }
    return originalJson(body);
  }) as Response["json"];

  next();
};

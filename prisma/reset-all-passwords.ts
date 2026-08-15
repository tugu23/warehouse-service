import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetAllPasswords() {
  console.log("Starting password reset for all employees...\n");

  // Default password for all users
  const defaultPassword = "agent123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // Get all employees
  const employees = await prisma.employee.findMany({
    select: { id: true, name: true, email: true, isActive: true },
  });

  console.log(`Found ${employees.length} employees\n`);

  // Update all passwords
  const updatePromises = employees.map((emp) =>
    prisma.employee.update({
      where: { id: emp.id },
      data: { passwordHash },
    })
  );

  await Promise.all(updatePromises);

  console.log("✅ All passwords have been reset!\n");
  console.log("========================================");
  console.log("LOGIN CREDENTIALS (all users):");
  console.log("========================================");
  console.log(`Email: [any employee email]`);
  console.log(`Password: ${defaultPassword}`);
  console.log("========================================\n");
  console.log("Employees with new passwords:");
  employees.forEach((emp) => {
    console.log(`  - ${emp.email} (${emp.name})`);
  });
}

resetAllPasswords()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

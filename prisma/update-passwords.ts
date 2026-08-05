import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function updateAgentPasswords() {
  console.log("🔄 Ажилчдын нууц үг шинэчилж байна...");

  // Бүх agent-уудын жагсаалт
  const agents = await prisma.employee.findMany({
    where: {
      OR: [
        { email: { endsWith: "@warehouse.mn" } },
        { email: { contains: "agent" } },
      ],
    },
  });

  console.log(`✅ ${agents.length} ажилчид олдлоо`);

  // Бүх agent-ын нууц үгийг "123456" болгох
  const defaultPassword = "123456";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  for (const agent of agents) {
    await prisma.employee.update({
      where: { id: agent.id },
      data: { passwordHash: hashedPassword },
    });
    console.log(`✅ ${agent.email} - нууц үг шинэчлэгдлээ`);
  }

  console.log("\n🎉 Бүх ажилчдын нууц үг шинэчлэгдлээ!");
  console.log(`📧 Email: agent6@warehouse.mn (эсвэл бусад)`);
  console.log(`🔑 Password: ${defaultPassword}`);
}

updateAgentPasswords()
  .catch((e) => {
    console.error("❌ Алдаа:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

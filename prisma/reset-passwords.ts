import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetAllPasswords() {
  console.log("🔄 Бүх ажилчдын нууц үг шинэчилж байна...\n");

  // Шинэ нууц үг: 123456
  const newPassword = "123456";
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  console.log("Generated hash:", hashedPassword);
  console.log("");

  // Бүх @warehouse.mn email-тэй хэрэглэгчдийг шинэчлэх
  const result = await prisma.employee.updateMany({
    where: {
      email: {
        endsWith: "@warehouse.mn",
      },
    },
    data: {
      passwordHash: hashedPassword,
    },
  });

  console.log(`✅ ${result.count} ажилчдын нууц үг шинэчлэгдлээ`);
  console.log(`\n🔑 Шинэ нууц үг: ${newPassword}`);
  console.log("\nНэвтрэх мэдээлэл:");
  console.log("  agent6@warehouse.mn / 123456");
  console.log("  agent10@warehouse.mn / 123456");
  console.log("  admin@warehouse.mn / 123456");
}

resetAllPasswords()
  .catch((e) => {
    console.error("❌ Алдаа:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

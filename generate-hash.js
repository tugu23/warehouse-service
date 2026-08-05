import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "123456";
  const hash = await bcrypt.hash(password, 10);
  console.log("Password:", password);
  console.log("Hash:", hash);

  // Тест хийх
  const isValid = await bcrypt.compare(password, hash);
  console.log("Test valid:", isValid);
}

generateHash();

import { ebarimtService } from "../src/services/ebarimt.service";
import { config } from "../src/config";
import logger from "../src/utils/logger";

async function verifyConnection() {
  console.log("Starting E-Barimt Connection Verification...");
  console.log("----------------------------------------");
  
  // 1. Check Configuration
  console.log("Configuration Status:");
  console.log(`- API URL: ${config.ebarimt.apiUrl}`);
  console.log(`- Mock Mode: ${config.ebarimt.mockMode}`);
  console.log(`- POS Number: ${config.ebarimt.posNo ? "Set" : "Not Set"}`);
  console.log(`- Merchant TIN: ${config.ebarimt.merchantTin ? "Set" : "Not Set"}`);
  
  if (config.ebarimt.mockMode) {
    console.log("\n⚠️  WARNING: System is in MOCK MODE.");
    console.log("To connect to real environment, set EBARIMT_MOCK_MODE=false in .env");
    return;
  }

  // 2. Test Connection
  console.log("\nTesting Connectivity...");
  try {
    const status = await ebarimtService.checkStatus();
    console.log("Status Check Result:", status);
    
    if (status.success && status.online) {
      console.log("\n✅ SUCCESS: Connected to E-Barimt system successfully!");
    } else {
      console.log("\n❌ FAILED: Could not connect to E-Barimt system.");
      console.log("Error:", status.message);
    }
  } catch (error) {
    console.log("\n❌ ERROR: Exception during connection test.");
    console.error(error);
  }
}

verifyConnection().catch(console.error);









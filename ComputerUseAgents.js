import { Stagehand } from "@browserbasehq/stagehand";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stagehand = new Stagehand({
  env: "LOCAL",
  localBrowserLaunchOptions: {
    headless: false,
    viewport: {
      width: 1920,
      height: 1080,
    },
  }
});

try {
  await stagehand.init();

  // Navigate to a website
  await stagehand.page.goto(process.env.BASE_URL);

  console.log("Starting onboarding and login process...");

  // Complete onboarding using regular Stagehand methods
  await stagehand.page.act("Complete the onboarding process by clicking through all slides and clicking 'Let's get started!'");

  // Login using regular Stagehand methods
  await stagehand.page.act(`Login with email: ${process.env.ADMIN_EMAIL} and password: ${process.env.ADMIN_PASSWORD}`);

  console.log("Process completed!");
} catch (error) {
  console.error("Error:", error.message);
} finally {
  await stagehand.close();
}
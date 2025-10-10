import { Stagehand } from "@browserbasehq/stagehand";
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

export async function createBrowser() {
  const stagehand = new Stagehand({
    env: "LOCAL",
    useAPI: false,
    verbose: 1,
    localBrowserLaunchOptions: {
      headless: false
    },
    // Uses Stagehand's default viewport (1024×768) - optimal for Computer Use Agent
  });
  
  await stagehand.init();
  return stagehand;
}

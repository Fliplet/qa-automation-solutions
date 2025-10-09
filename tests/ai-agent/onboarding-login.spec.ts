import { test, expect } from '@playwright/test';
import { Stagehand } from "@browserbasehq/stagehand";

test('Computer Use Agent - Onboarding and Login', async () => {
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

  await stagehand.init();

  try {
    await stagehand.page.goto(process.env.BASE_URL || 'https://apps.fliplet.com/fliplet-aqa-events-aqa-aibe-2-eat');

    const agent = stagehand.agent({
      provider: "openai",
      model: "computer-use-preview",
      instructions: `You are a helpful assistant that can use a web browser.
      Do not ask follow up questions, the user will trust your judgement.`,
      options: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    });

    const task = "Pass the onboarding process and try to login to the app using the credentials provided: " + 
                 process.env.ADMIN_EMAIL + " " + process.env.ADMIN_PASSWORD;
    
    await agent.execute(task);
    await expect(stagehand.page).toHaveURL(/.*dashboard|.*home|.*main|.*app/);
    
  } finally {
    await stagehand.close();
  }
});

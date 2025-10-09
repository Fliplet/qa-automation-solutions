import { test, expect } from '@playwright/test';
import { createBrowser } from '../../helpers/ai/browser';
import { createAgent } from '../../helpers/ai/agent';

test.describe('AI Agent Tests with Helpers', () => {
  let stagehand: any;
  let agent: any;

  test.beforeEach(async () => {
    // Use browser helper
    stagehand = await createBrowser();
    
    await stagehand.page.goto(process.env.BASE_URL || 'https://apps.fliplet.com/fliplet-aqa-events-aqa-aibe-2-eat');
    // Use agent helper
    agent = createAgent(stagehand);
  });

  test.afterEach(async () => {
    if (stagehand) {
      await stagehand.close();
    }
  });

  test('should complete onboarding and login process', async () => {
    
    const task = "Pass the onboarding process and try to login to the app using the credentials provided: " + 
                 process.env.ADMIN_EMAIL + " " + process.env.ADMIN_PASSWORD;
    
    await agent.execute(task);
    await expect(stagehand.page).toHaveURL(/.*dashboard|.*home|.*main/);

  });

  test('should handle login with invalid credentials', async () => {

    const task = "Try to login with invalid credentials: invalid@email.com wrongpassword";
    
    await agent.execute(task);
    await expect(stagehand.page.locator('text=Invalid|text=Error|text=Login')).toBeVisible();
  });
});

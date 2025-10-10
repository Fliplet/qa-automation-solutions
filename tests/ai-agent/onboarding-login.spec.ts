import { test, expect } from '@playwright/test';
import { createBrowser } from '../../helpers/ai/browser';
import { createAgent } from '../../helpers/ai/agent';

test.describe('AI Agent Tests with Helpers', () => {
  test.setTimeout(120000); // 2 minutes for Computer Use Agent
  
  let stagehand: any;
  let agent: any;

  test.beforeEach(async () => {
    // Initialize browser with default viewport (1024x768) - optimal for Computer Use Agent
    stagehand = await createBrowser();
    
    // Navigate to the application
    await stagehand.page.goto(process.env.BASE_URL || 'https://apps.fliplet.com/fliplet-aqa-events-aqa-aibe-2-eat');
    
    // Create Computer Use Agent
    agent = createAgent(stagehand);
  });

  test.afterEach(async () => {
    if (stagehand) {
      await stagehand.close();
    }
  });

  test('should complete onboarding and login process', async () => {
    
    // Define the task steps
    const onboardingSteps = [
      'Click "Explore More" button',
      'Click "Continue" button',  
      'Click "Continue" button',
      'Click "Let\'s get started!" button',
      'Verify you are redirected to the Login page'
    ];
    
    const loginSteps = [
      `Enter email: ${process.env.ADMIN_EMAIL}`,
      `Enter password: ${process.env.ADMIN_PASSWORD}`,
      'Click login button'
    ];
    
    const task = `
ONBOARDING STEPS:
${onboardingSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

LOGIN STEPS:
${loginSteps.map((step, index) => `${index + onboardingSteps.length + 1}. ${step}`).join('\n')}

CRITICAL: NEVER use keyboard keys like ArrowRight, ArrowLeft, Tab, Enter. 
ONLY use mouse clicks and typing text. Do not press any keyboard navigation keys.`;
    
    try {
      console.log('Starting Computer Use Agent execution...');
      console.log('Task:', task);
      
      const result = await agent.execute({
        instruction: task,
        maxSteps: 30,
        autoScreenshot: true
      });
      
      console.log('Agent execution completed:', result);
      
      // Verify success
      if (result.success) {
        console.log('✅ Task completed successfully!');
      } else {
        console.log('❌ Task failed or was incomplete');
        console.log('Result:', result);
      }
      
    } catch (error) {
      console.error('Agent execution failed:', error);
      throw error;
    }
    
    // Verify successful navigation to dashboard/home
    const currentUrl = stagehand.page.url();
    expect(currentUrl).toMatch(/.*dashboard|.*home|.*main/);
  });

  // Uncomment to test invalid credentials
  // test('should handle login with invalid credentials', async () => {
  //   const task = `Complete onboarding, then test invalid login:
  //   1. ONBOARDING: Click through slides (Explore More → Continue → Continue → Let's get started)
  //   2. INVALID LOGIN: Enter "invalid@email.com" and "wrongpassword", then submit
  //   3. VERIFY: Wait for error message to appear (should NOT navigate to dashboard)`;
  //   
  //   await agent.execute(task);
  //   await expect(stagehand.page.locator('text=Invalid|text=Error|text=Login')).toBeVisible();
  // });
});

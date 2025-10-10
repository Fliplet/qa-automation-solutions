import { test, expect } from '@playwright/test';
import { createBrowser } from '../../helpers/ai/browser';
import { createAgent } from '../../helpers/ai/agent';

test.describe('Computer Use Agent Test Template', () => {
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

  test('QA: Fill in your test description here', async () => {
    
    const task = `
1. [QA: Describe step 1]
2. [QA: Describe step 2]
3. [QA: Describe step 3]
4. [QA: Describe step 4]
5. [QA: Describe step 5]

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
        console.log(' Task completed successfully!');
      } else {
        console.log('Task failed or was incomplete');
        console.log('Result:', result);
      }
      
    } catch (error) {
      console.error('Agent execution failed:', error);
      throw error;
    }
    
    // Add your assertions here
    // const currentUrl = stagehand.page.url();
    // expect(currentUrl).toMatch(/.*dashboard|.*home|.*main/);
  });
});
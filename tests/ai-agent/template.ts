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
    
    // ============================================================================
    // TASK SECTION - Fill in your specific test steps here
    // ============================================================================
    
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
        maxSteps: 30, // Adjust based on task complexity
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
    
    // ============================================================================
    // ASSERTIONS SECTION - Add your specific assertions here
    // ============================================================================
    
    // Example assertions (customize for your test):
    // const currentUrl = stagehand.page.url();
    // expect(currentUrl).toMatch(/.*dashboard|.*home|.*main/);
    
    // Example element verification:
    // await expect(stagehand.page.locator('text=Success')).toBeVisible();
    
    // Example data extraction:
    // const pageTitle = await stagehand.page.title();
    // expect(pageTitle).toContain('Expected Title');
  });

  // ============================================================================
  // ADDITIONAL TEST TEMPLATES
  // ============================================================================
  
  // Uncomment and customize for additional test scenarios
  
  // test('QA: Test with invalid data', async () => {
  //   const task = `
  //   1. [QA: Describe invalid data scenario]
  //   2. [QA: Describe expected error handling]
  //   3. [QA: Describe verification steps]`;
  //   
  //   const result = await agent.execute({
  //     instruction: task,
  //     maxSteps: 20,
  //     autoScreenshot: true
  //   });
  //   
  //   // Verify error handling
  //   expect(result.success).toBe(false); // or true if error is expected
  // });
  
  // test('QA: Test edge case scenario', async () => {
  //   const task = `
  //   1. [QA: Describe edge case]
  //   2. [QA: Describe expected behavior]
  //   3. [QA: Describe verification steps]`;
  //   
  //   const result = await agent.execute({
  //     instruction: task,
  //     maxSteps: 25,
  //     autoScreenshot: true
  //   });
  //   
  //   expect(result.success).toBe(true);
  // });
});

// ============================================================================
// HELPER FUNCTIONS - Add reusable functions here
// ============================================================================

/**
 * Helper function to build dynamic tasks
 * @param steps - Array of step descriptions
 * @param credentials - Optional credentials object
 * @returns Formatted task string
 */
function buildTask(steps: string[], credentials?: { email?: string; password?: string }): string {
  const numberedSteps = steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
  
  return `
${numberedSteps}

CRITICAL: NEVER use keyboard keys like ArrowRight, ArrowLeft, Tab, Enter. 
ONLY use mouse clicks and typing text. Do not press any keyboard navigation keys.`;
}

/**
 * Helper function to verify successful completion
 * @param result - Agent execution result
 * @param expectedUrl - Expected URL pattern
 */
function verifySuccess(result: any, expectedUrl?: string): void {
  expect(result.success).toBe(true);
  expect(result.completed).toBe(true);
  
  if (expectedUrl) {
    const currentUrl = stagehand.page.url();
    expect(currentUrl).toMatch(expectedUrl);
  }
}

/**
 * Helper function to verify error handling
 * @param result - Agent execution result
 * @param expectedError - Expected error message
 */
function verifyError(result: any, expectedError?: string): void {
  if (expectedError) {
    expect(result.message).toContain(expectedError);
  }
  
  // Verify we're not on success page
  const currentUrl = stagehand.page.url();
  expect(currentUrl).not.toMatch(/.*dashboard|.*home|.*main/);
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Simple task with helper
const steps = [
  'Click the login button',
  'Enter email: admin@email.com',
  'Enter password: admin',
  'Click submit button',
  'Verify dashboard appears'
];

const task = buildTask(steps);
const result = await agent.execute({ instruction: task, maxSteps: 15 });
verifySuccess(result, /.*dashboard/);

// Example 2: Task with credentials
const loginSteps = [
  'Click the login button',
  `Enter email: ${credentials.email}`,
  `Enter password: ${credentials.password}`,
  'Click submit button',
  'Verify successful login'
];

const task = buildTask(loginSteps, credentials);
const result = await agent.execute({ instruction: task, maxSteps: 15 });
verifySuccess(result);

// Example 3: Error handling test
const errorSteps = [
  'Enter invalid email: invalid@email.com',
  'Enter wrong password: wrongpass',
  'Click submit button',
  'Verify error message appears'
];

const task = buildTask(errorSteps);
const result = await agent.execute({ instruction: task, maxSteps: 10 });
verifyError(result, 'Invalid credentials');
*/

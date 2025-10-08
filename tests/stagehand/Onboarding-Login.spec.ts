import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { 
  ADMIN_EMAIL, 
  ADMIN_PASSWORD, 
  BASE_URL 
} from '../../test-data/app.data';
import { AIOboardingPage } from '../../page-objects/AI/aiOnboarding.page';
import { AILoginPage } from '../../page-objects/AI/aiLogin.page';

let stagehand: Stagehand;
let aiOnboarding: AIOboardingPage;
let aiLogin: AILoginPage;

test.describe('AI Onboarding + Login Flow (Single Browser)', () => {

  test.beforeEach(async () => {
    // 1️Initialize Stagehand (creates its own Playwright browser + page)
    stagehand = new Stagehand({
      env: 'LOCAL',
      verbose: 2
    });
    await stagehand.init();

    const page = stagehand.page; // Stagehand’s Playwright page

    // 2️Initialize AI page objects
    aiOnboarding = new AIOboardingPage(page, stagehand);
    aiLogin = new AILoginPage(page, stagehand);

    // 3️Navigate to onboarding and complete it
    
    await page.goto(`${BASE_URL}/onboarding`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Starting onboarding completion...');
    await aiOnboarding.aiCompleteOnboarding(stagehand);

    // 4️Verify redirection to login using direct Playwright call
    const currentUrl = await stagehand.page.url();
    console.log('Current URL after onboarding:', currentUrl);
    expect(currentUrl).toMatch(/login|signin/);
  });

  test.afterEach(async () => {
    // 5️Close Stagehand browser cleanly
    await stagehand.close();
  });

  // -------------------------------------------------
  // Actual Login Test
  // -------------------------------------------------
  test('AI Login after completing onboarding', async () => {
    // Perform login
    await aiLogin.aiLogin(ADMIN_EMAIL, ADMIN_PASSWORD);

    // Verify successful navigation
    const urlAfterLogin = await aiLogin.page.url();
    expect(urlAfterLogin).toMatch(/dashboard|home|main/);
  });
});

import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { createBrowser } from '../helpers/ai/browser';
import { loginAsAttendee } from '../helpers/auth/login';

import { AIOnboardingPage } from '../page-objects/aiOnboarding.page';
import { AILoginPage } from '../page-objects/aiLogin.page';

let stagehand: Stagehand;
let aiOnboarding: AIOnboardingPage;
let aiLogin: AILoginPage;

test.describe('AI Onboarding + Login Flow (Single Browser)', () => {

  test.beforeEach(async () => {
    // 1️Initialize Stagehand using helper
    stagehand = await createBrowser();

    aiOnboarding = new AIOnboardingPage(stagehand);
    aiLogin = new AILoginPage(stagehand);

    await aiOnboarding.goto();
    await stagehand.page.waitForLoadState('networkidle');
    console.log('Starting onboarding completion...');
    await aiOnboarding.completeOnboarding();

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
    //await aiLogin.aiLogin(ADMIN_EMAIL, ADMIN_PASSWORD);
    await loginAsAttendee(stagehand);
    // Verify successful navigation
    const urlAfterLogin = stagehand.page.url();
    expect(urlAfterLogin).toMatch(/dashboard|home|main/);
  });
});

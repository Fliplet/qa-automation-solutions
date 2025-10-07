import { test, expect } from '@playwright/test';
import { AILoginPage } from '../../page-objects/aiLogin.page';
import { OnboardingPage } from '../../page-objects/onboarding.page';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../test-data/app.data';

test.describe('Stagehand Login Test', () => {
  test('STAGEHAND-TC-001: AI Login test', async ({ page }) => {
    // Complete onboarding first
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.goto();
    await onboardingPage.completeOnboarding();
    
    // Create AI Login page
    const loginPage = new AILoginPage(page);
    
    // Initialize Stagehand and perform AI login
    await loginPage.initStagehand();
    await loginPage.aiLogin(ADMIN_EMAIL, ADMIN_PASSWORD);
    
    // Verify successful login
    await expect(page).toHaveURL(/home|dashboard|main/);
  });
});

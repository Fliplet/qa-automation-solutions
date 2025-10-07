import { test, expect } from '@playwright/test';
import { AILoginPage } from '../../page-objects/aiLogin.page';
import { OnboardingPage } from '../../page-objects/onboarding.page';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../test-data/app.data';

/**
 * Stagehand Integration Tests
 * 
 * These tests demonstrate the integration of Stagehand with Playwright
 * using AI-powered page object methods.
 */
test.describe('Stagehand Integration Tests', () => {
  test('STAGEHAND-TC-001: AI Login test', async ({ page }) => {
    // Complete onboarding to reach login page
    await page.context().clearCookies();
    await page.context().clearPermissions();
    
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.goto();
    await onboardingPage.completeOnboarding();
    
    // Create AI Login page and perform login
    const loginPage = new AILoginPage(page);
    await loginPage.initStagehand();
    await loginPage.aiLogin(ADMIN_EMAIL, ADMIN_PASSWORD);
    
    // Verify successful login - wait for any navigation away from login page
    await expect(page).not.toBe(/login/);
  });

  test('STAGEHAND-TC-002: AI Login with error handling', async ({ page }) => {
    // Complete onboarding to reach login page
    await page.context().clearCookies();
    await page.context().clearPermissions();
    
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.goto();
    await onboardingPage.completeOnboarding();
    
    // Create AI Login page and test error scenarios
    const loginPage = new AILoginPage(page);
    await loginPage.initStagehand();
    
    // Test with invalid credentials
    const errorMessage = await loginPage.aiLoginAndDetectError('invalid@email.com', 'wrongpassword');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).not.toBe('Unknown error');
  });

  test('STAGEHAND-TC-003: AI Form validation test', async ({ page }) => {
    // Complete onboarding to reach login page
    await page.context().clearCookies();
    await page.context().clearPermissions();
    
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.goto();
    await onboardingPage.completeOnboarding();
    
    // Create AI Login page and test form validation
    const loginPage = new AILoginPage(page);
    await loginPage.initStagehand();
    await loginPage.aiValidateLoginForm();
    
    // Verify validation messages are shown
    await expect(loginPage.loginError).toBeVisible();
  });
});

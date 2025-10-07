// page-objects/aiLogin.page.ts

import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * AILoginPage represents the login screen enhanced with Stagehand AI automation.
 * Uses AI-powered visual recognition for more resilient and intelligent interactions.
 * 
 * Key Benefits:
 * - Self-healing tests that adapt to UI changes
 * - Natural language instructions for complex interactions
 * - Reduced maintenance overhead from brittle selectors
 * - Enhanced reliability through visual context understanding
 */
export class AILoginPage extends BasePage {
  // ===========================================
  // ESSENTIAL SELECTORS (Keep for hybrid approach)
  // ===========================================
  // We keep minimal selectors for:
  // 1. Hybrid approach (Playwright + Stagehand)
  // 2. Validation methods that need specific element access
  // 3. Performance-critical operations
  
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;
  
  // Error validation selectors (needed for specific assertions)
  public readonly loginError: Locator;
  public readonly alertContainer: Locator;

  constructor(page: Page) {
    super(page);

    // Keep only essential selectors for hybrid approach
    this.emailInput = page.locator('input[name="Email"]');
    this.passwordInput = page.locator('input[name="Password"]');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    
    // Error validation selectors
    this.loginError = page.locator('.login-error');
    this.alertContainer = page.locator('[role="alert"]');
  }

  // ===========================================
  // STAGEHAND-ENHANCED LOGIN METHODS
  // ===========================================

  /**
   * Performs login using Stagehand AI automation
   * Uses natural language instructions for more resilient interactions
   */
  async aiLogin(username: string, password: string): Promise<void> {
    // Auto-initialize Stagehand if not already initialized
    await this.ensureStagehandInitialized();
    
    // Use Stagehand for intelligent form filling
    await this.stagehand.page.act(`Fill the email field with ${username}`);
    await this.stagehand.page.act(`Fill the password field with ${password}`);
    await this.stagehand.page.act(`Click the login button`);
    
    // Wait for navigation using Playwright (more reliable)
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Hybrid login approach: Playwright for reliability + Stagehand for complex interactions
   * Best of both worlds - reliable and intelligent
   */
  async aiLoginHybrid(username: string, password: string): Promise<void> {
    // Use Playwright for reliable form filling
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    
    // Use Stagehand for intelligent button clicking (handles dynamic states)
    await this.stagehand.page.act(`Click the login button`);
    
    // Wait for navigation
    await this.page.waitForURL(/home|dashboard|main/);
  }

  /**
   * AI-powered password reset flow
   * Uses visual recognition to handle dynamic UI states
   */
  async aiResetPassword(email: string): Promise<void> {
    // Navigate to password reset using AI
    await this.stagehand.page.act(`Click on the "Forgot your password?" link`);
    
    // Wait for password reset form to appear
    await this.page.waitForLoadState('networkidle');
    
    // Fill email using AI
    await this.stagehand.page.act(`Fill the email field with ${email}`);
    
    // Click verify button using AI
    await this.stagehand.page.act(`Click the "Verify email" button`);
    
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * AI-powered registration navigation
   */
  async aiGoToRegistration(): Promise<void> {
    await this.stagehand.page.act(`Click the "Create account" button`);
  }

  /**
   * AI-powered form validation testing
   * Uses visual recognition to detect validation states
   */
  async aiValidateLoginForm(): Promise<void> {
    // Submit empty form using AI
    await this.stagehand.page.act(`Click the login button without filling any fields`);
    
    // Use AI to observe validation messages
    const validationMessages = await this.stagehand.page.observe(`What validation messages are shown on the form?`);
    
    // Verify validation messages appear
    await expect(this.loginError).toBeVisible();
  }

  /**
   * AI-powered error detection and validation
   * Uses visual recognition to identify specific error types
   */
  async aiLoginAndDetectError(email: string, password: string): Promise<string> {
    // Perform login using AI
    await this.stagehand.page.act(`Fill email field with ${email}`);
    await this.stagehand.page.act(`Fill password field with ${password}`);
    await this.stagehand.page.act(`Click the login button`);
    
    // Wait for response
    await this.page.waitForLoadState('networkidle');
    
    // Use AI to detect and identify error type
    const result = await this.stagehand.page.extract(`What error message is displayed on the login form?`);
    
    // Verify error is visible
    await expect(this.loginError).toBeVisible();
    
    return result.extraction || 'Unknown error';
  }

  /**
   * AI-powered state detection
   * Uses visual recognition to determine current form state
   */
  async aiDetectFormState(): Promise<string> {
    const result = await this.stagehand.page.extract(`What is the current state of the login form? Is it showing login fields, password reset, or verification?`);
    return result.extraction || 'Unknown state';
  }

  /**
   * AI-powered navigation to forgot password
   */
  async aiForgotPassword(): Promise<void> {
    await this.stagehand.page.act(`Click on the "Forgot your password?" link`);
    await this.page.waitForLoadState('networkidle');
  }

  // ===========================================
  // ADVANCED STAGEHAND METHODS
  // ===========================================

  /**
   * AI-powered comprehensive login flow testing
   * Tests multiple scenarios using natural language
   */
  async aiTestLoginScenarios(): Promise<void> {
    // Test empty form submission
    await this.stagehand.page.act(`Try to submit the login form without filling any fields`);
    await this.aiValidateLoginForm();
    
    // Test invalid email format
    await this.stagehand.page.act(`Fill email field with "invalid-email" and password with "test123"`);
    await this.stagehand.page.act(`Click the login button`);
    
    // Test non-existent user
    await this.stagehand.page.act(`Fill email field with "nonexistent@example.com" and password with "test123"`);
    await this.stagehand.page.act(`Click the login button`);
    
    // Wait for error detection
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * AI-powered form field validation
   * Uses visual recognition to check field states
   */
  async aiValidateFormFields(): Promise<void> {
    // Check email field validation
    const emailResult = await this.stagehand.page.extract(`What validation message appears for the email field when it's empty?`);
    
    // Check password field validation  
    const passwordResult = await this.stagehand.page.extract(`What validation message appears for the password field when it's empty?`);
    
    // Verify validation messages
    await expect(this.loginError).toBeVisible();
  }

  /**
   * AI-powered comprehensive error testing
   * Tests various error scenarios using natural language
   */
  async aiTestErrorScenarios(): Promise<void> {
    // Test empty form
    await this.stagehand.page.act(`Submit the login form without entering any information`);
    
    // Test invalid email format
    await this.stagehand.page.act(`Enter "not-an-email" in the email field and "password123" in the password field`);
    await this.stagehand.page.act(`Click the login button`);
    
    // Test wrong credentials
    await this.stagehand.page.act(`Enter "wrong@email.com" in the email field and "wrongpassword" in the password field`);
    await this.stagehand.page.act(`Click the login button`);
    
    // Wait for errors to appear
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * AI-powered form interaction testing
   * Tests form behavior using visual recognition
   */
  async aiTestFormInteractions(): Promise<void> {
    // Test field clearing
    await this.stagehand.page.act(`Fill the email field with "test@example.com"`);
    await this.stagehand.page.act(`Clear the email field`);
    
    // Test password visibility toggle (if exists)
    await this.stagehand.page.act(`Fill the password field with "testpassword"`);
    await this.stagehand.page.act(`Toggle password visibility`);
    
    // Test form submission with partial data
    await this.stagehand.page.act(`Fill only the email field with "test@example.com"`);
    await this.stagehand.page.act(`Click the login button`);
  }

  // ===========================================
  // UTILITY METHODS (Hybrid Approach)
  // ===========================================

  /**
   * Clear form using traditional Playwright (faster for simple operations)
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Check if in login state using hybrid approach
   */
  async isInLoginState(): Promise<boolean> {
    // Use Playwright for reliable state checking
    const emailVisible = await this.emailInput.isVisible();
    const passwordVisible = await this.passwordInput.isVisible();
    return emailVisible && passwordVisible;
  }

  /**
   * Wait for page to be ready using Playwright
   */
  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
  }

  /**
   * Traditional login method (kept for compatibility)
   * Use this when you need maximum reliability
   */
  async login(username: string, password: string): Promise<void> {
    await this.waitForPageReady();
    
    await this.emailInput.clear();
    await this.passwordInput.clear();
    
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    
    await expect(this.emailInput).toHaveValue(username);
    await expect(this.passwordInput).toHaveValue(password);
    await expect(this.loginButton).toBeEnabled();
    
    await Promise.all([
      this.page.waitForURL(/home|dashboard|main/),
      this.loginButton.click()
    ]);
  }
}
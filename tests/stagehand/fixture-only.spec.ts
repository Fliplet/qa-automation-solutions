import { test, expect } from '../../fixtures/stagehand.fixture';

test.describe('GEN-ONBOARDING-001 – Onboarding Screen Workflow and Navigation', () => {
  test('should navigate through onboarding screens and verify UI elements', async ({ page, stagehand }) => {
    // Arrange
    await page.goto('https://apps.fliplet.com/fliplet-aqa-events-aqa-aibe-2-eat');

    // Act & Assert
    // Verify initial header text
    await expect(page.getByRole('heading', { name: 'Welcome to the Fliplet Events App' })).toBeVisible();

    // Click "Explore More" button
    await stagehand.page.act('Click the "Explore More" button');

    // Verify next header text
    await expect(page.getByRole('heading', { name: 'Explore Agenda, Speakers, and Attendees' })).toBeVisible();

    // Click "Continue" button
    await stagehand.page.act('Click the "Continue" button');

    // Verify next header text
    await expect(page.getByRole('heading', { name: 'Check-In, Connect, and Participate' })).toBeVisible();

    // Click "Continue" button
    await stagehand.page.act('Click the "Continue" button');

    // Verify final onboarding screen
    await expect(page.getByRole('heading', { name: 'Get Started' })).toBeVisible();
    await expect(page.getByRole('button', { name: "Let's get started!" })).toBeVisible();

    // Click "Let's get started!" button
    await stagehand.page.act('Click the "Let\'s get started!" button');

    // Verify redirect to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // Verify login form fields
    await expect(page.getByLabel('Enter your email')).toBeVisible();
    await expect(page.getByLabel('Enter your password')).toBeVisible();

    // Verify additional text
    await expect(page.getByText('Enter your access details below')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { getStagehandConfig } from '../helpers/stagehand';
import { createTestInbox, waitForOtp6, deleteTestInbox } from '../../utils/mailslurp';

/**
 * Password Reset test using real email verification with MailSlurp.
 * This test demonstrates the complete password reset flow with dynamic OTP retrieval.
 */
test.describe('Password Reset with Email Verification', () => {
    test('Should reset password using email verification code', async () => {
        // Initialize Stagehand
        const stagehand = new Stagehand(getStagehandConfig());
        await stagehand.init();

        // Arrange: Create a temporary email inbox
        const { ms, inbox } = await createTestInbox();
        const testEmail = inbox.emailAddress;
        const newPassword = 'QaTest@2024!';

        try {
            // Navigate to login page
            await stagehand.page.goto('https://apps.fliplet.com/fliplet-aqa-events-aqa-aibe-2-eat/login-1n1lj');
            await stagehand.page.waitForLoadState('domcontentloaded');

            // Act: Initiate password reset
            await stagehand.page.act('Click the "Forgot your password?" link');
            await stagehand.page.waitForTimeout(2000);

            // Enter test email address
            await stagehand.page.act(`Fill the email field with ${testEmail}`);
            await stagehand.page.act('Click the "Verify email" button');

            // Wait for OTP email and extract the code
            console.log(`Waiting for verification code at ${testEmail}...`);
            const verificationCode = await waitForOtp6({
                ms,
                inboxId: inbox.id,
                subjectLike: 'verification',
                timeoutMs: 90_000 // 90 seconds
            });
            console.log(`Received verification code: ${verificationCode}`);

            // Enter verification code
            await stagehand.page.waitForTimeout(2000);
            await stagehand.page.act(`Fill the "Enter verification code" textbox with the code ${verificationCode}`);
            await stagehand.page.act('Click the "Verify" button');
            await stagehand.page.waitForTimeout(2000);

            // Set new password
            await stagehand.page.act(`Fill the new password field with ${newPassword}`);
            await stagehand.page.act(`Fill the confirm password field with ${newPassword}`);
            await stagehand.page.act('Click the "Reset password" button');
            await stagehand.page.waitForTimeout(2000);

            // Login with new password
            await stagehand.page.act('Click the "Log in" button');
            await stagehand.page.waitForTimeout(1000);
            await stagehand.page.act(`Fill the email field with ${testEmail}`);
            await stagehand.page.act(`Fill the password field with ${newPassword}`);
            await stagehand.page.act('Click the "Log in" button');
            await stagehand.page.waitForTimeout(3000);

            // Assert: Verify successful login
            const pageContent = await stagehand.page.extract('What is the main heading on this page?');
            console.log('Page content after login:', pageContent);

            // Verify we're on the home/dashboard page
            expect(pageContent.extraction).toBeTruthy();
            expect(pageContent.extraction).not.toBe('Login');
        } finally {
            // Cleanup: Delete the test inbox and close browser
            await deleteTestInbox(ms, inbox.id);
            await stagehand.close();
            console.log('Test inbox and browser cleaned up');
        }
    });
});

/**
 * Note:
 * - This test uses MailSlurp to create a real temporary email address
 * - The verification code is automatically extracted from the email
 * - The test inbox is automatically cleaned up after the test
 * - Requires MAILSLURP_API_KEY environment variable to be set
 * - Uses Stagehand AI for all browser interactions
 */


import { MailSlurp, MatchOptionFieldEnum, MatchOptionShouldEnum } from "mailslurp-client";

export type WaitOpts = {
    subjectLike?: string;     // e.g. "verification code"
    timeoutMs?: number;       // default 60s
};

/**
 * Creates a temporary MailSlurp inbox for testing email workflows.
 * @param apiKey - MailSlurp API key (defaults to MAILSLURP_API_KEY env var)
 * @returns Object containing MailSlurp client instance and inbox details
 * @throws Error if API key is missing or inbox creation fails
 * @example
 * const { ms, inbox } = await createTestInbox();
 * console.log(inbox.emailAddress); // use this email in your test
 */
export async function createTestInbox(apiKey = process.env.MAILSLURP_API_KEY!) {
    if (!apiKey) {
        throw new Error('MAILSLURP_API_KEY environment variable is required');
    }
    const ms = new MailSlurp({ apiKey });
    const inbox = await ms.createInbox();
    return { ms, inbox };
}

/**
 * Deletes a MailSlurp inbox to clean up test resources.
 * @param ms - MailSlurp client instance
 * @param inboxId - ID of the inbox to delete
 * @example
 * await deleteTestInbox(ms, inbox.id);
 */
export async function deleteTestInbox(ms: MailSlurp, inboxId: string): Promise<void> {
    try {
        await ms.inboxController.deleteInbox({ inboxId });
    } catch (error) {
        console.warn(`Failed to delete inbox ${inboxId}:`, error);
    }
}

/**
 * Waits for an email containing a 6-digit OTP code and extracts it.
 * Handles various formats: "123456", "123 456", "123-456".
 * @param ms - MailSlurp client instance
 * @param inboxId - ID of the inbox to monitor
 * @param subjectLike - Subject keyword to match (default: "verification")
 * @param timeoutMs - Wait timeout in milliseconds (default: 60000)
 * @returns The 6-digit OTP code as a string
 * @throws Error if no matching email found or OTP not found in email body
 * @example
 * const otp = await waitForOtp6({ ms, inboxId, subjectLike: "reset password" });
 * console.log(otp); // "123456"
 */
export async function waitForOtp6({
    ms,
    inboxId,
    subjectLike = "verification",
    timeoutMs = 60_000
}: {
    ms: MailSlurp;
    inboxId: string;
} & WaitOpts) {
    try {
        const emailPreviews = await ms.waitController.waitForMatchingEmails({
            inboxId,
            count: 1,
            timeout: timeoutMs,
            matchOptions: {
                matches: [
                    {
                        field: MatchOptionFieldEnum.SUBJECT,
                        should: MatchOptionShouldEnum.CONTAIN,
                        value: subjectLike
                    }
                ]
            },
            unreadOnly: true
        });

        if (!emailPreviews || emailPreviews.length === 0) {
            throw new Error(`No email found with subject containing "${subjectLike}"`);
        }

        // Fetch full email to get body content
        const fullEmail = await ms.emailController.getEmail({ emailId: emailPreviews[0].id! });

        // Try both body and HTML body for better compatibility
        const body = `${fullEmail.body ?? ""}`;

        // Robust to "123 456" or "123-456" formats
        const digits = body.match(/\d/g);
        if (!digits || digits.length < 6) {
            throw new Error("6-digit OTP not found in email body");
        }

        return digits.slice(0, 6).join("");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        console.error('MailSlurp OTP retrieval error:', errorMessage);
        throw new Error(`Failed to retrieve OTP: ${errorMessage}`);
    }
}

/**
 * Waits for an email containing a magic link (URL) and extracts it.
 * @param ms - MailSlurp client instance
 * @param inboxId - ID of the inbox to monitor
 * @param subjectLike - Subject keyword to match (default: "verification")
 * @param timeoutMs - Wait timeout in milliseconds (default: 60000)
 * @param urlPattern - RegEx pattern to match URLs (default: standard HTTP/HTTPS URLs)
 * @returns The extracted URL as a string
 * @throws Error if no matching email found or URL not found in email body
 * @example
 * const link = await waitForMagicLink({ ms, inboxId, subjectLike: "password reset" });
 * await page.goto(link);
 */
export async function waitForMagicLink({
    ms,
    inboxId,
    subjectLike = "verification",
    timeoutMs = 60_000,
    urlPattern = /https?:\/\/[^\s"'<>]+/i
}: {
    ms: MailSlurp;
    inboxId: string;
} & WaitOpts & { urlPattern?: RegExp }) {
    try {
        const emailPreviews = await ms.waitController.waitForMatchingEmails({
            inboxId,
            count: 1,
            timeout: timeoutMs,
            matchOptions: {
                matches: [
                    {
                        field: MatchOptionFieldEnum.SUBJECT,
                        should: MatchOptionShouldEnum.CONTAIN,
                        value: subjectLike
                    }
                ]
            },
            unreadOnly: true
        });

        if (!emailPreviews || emailPreviews.length === 0) {
            throw new Error(`No email found with subject containing "${subjectLike}"`);
        }

        // Fetch full email to get body content
        const fullEmail = await ms.emailController.getEmail({ emailId: emailPreviews[0].id! });

        // Try both body and HTML body for better compatibility
        const body = `${fullEmail.body ?? ""}`;
        const url = body.match(urlPattern)?.[0];

        if (!url) {
            throw new Error("Magic link not found in email body");
        }

        return url;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        console.error('MailSlurp magic link retrieval error:', errorMessage);
        throw new Error(`Failed to retrieve magic link: ${errorMessage}`);
    }
}

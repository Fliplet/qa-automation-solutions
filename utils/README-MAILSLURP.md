# MailSlurp Email Testing Utilities

This module provides utilities for testing email workflows using [MailSlurp](https://www.mailslurp.com/), enabling automated testing of email verification, password resets, and magic links.

## Setup

### 1. Install Dependencies

```bash
npm install mailslurp-client
```

### 2. Get API Key

1. Sign up at https://app.mailslurp.com/sign-up/
2. Navigate to API Keys section
3. Copy your API key

### 3. Configure Environment

Add your MailSlurp API key to `.env`:

```bash
MAILSLURP_API_KEY=your_api_key_here
```

## Usage

### Basic Email OTP Verification

```typescript
import { createTestInbox, waitForOtp6, deleteTestInbox } from '../utils/mailslurp';

test('Password reset with OTP', async ({ page }) => {
    // Create temporary email inbox
    const { ms, inbox } = await createTestInbox();
    const testEmail = inbox.emailAddress;

    try {
        // Use test email in your flow
        await page.getByLabel('Email').fill(testEmail);
        await page.getByRole('button', { name: 'Send Code' }).click();

        // Wait for and extract OTP
        const otp = await waitForOtp6({
            ms,
            inboxId: inbox.id,
            subjectLike: 'verification',
            timeoutMs: 60_000
        });

        // Use OTP in your test
        await page.getByLabel('Verification Code').fill(otp);
        await page.getByRole('button', { name: 'Verify' }).click();

        // Assert success
        await expect(page).toHaveURL(/dashboard/);
    } finally {
        // Clean up
        await deleteTestInbox(ms, inbox.id);
    }
});
```

### Magic Link Testing

```typescript
import { createTestInbox, waitForMagicLink, deleteTestInbox } from '../utils/mailslurp';

test('Email magic link login', async ({ page, context }) => {
    const { ms, inbox } = await createTestInbox();

    try {
        // Trigger magic link email
        await page.getByLabel('Email').fill(inbox.emailAddress);
        await page.getByRole('button', { name: 'Send Magic Link' }).click();

        // Wait for and extract magic link
        const magicLink = await waitForMagicLink({
            ms,
            inboxId: inbox.id,
            subjectLike: 'login',
            timeoutMs: 60_000
        });

        // Navigate to magic link
        await page.goto(magicLink);

        // Assert successful authentication
        await expect(page).toHaveURL(/dashboard/);
    } finally {
        await deleteTestInbox(ms, inbox.id);
    }
});
```

### Custom Subject Matching

```typescript
// Wait for password reset email
const resetCode = await waitForOtp6({
    ms,
    inboxId: inbox.id,
    subjectLike: 'password reset',  // Custom subject filter
    timeoutMs: 90_000                 // Longer timeout
});

// Wait for welcome email with custom URL pattern
const activationLink = await waitForMagicLink({
    ms,
    inboxId: inbox.id,
    subjectLike: 'welcome',
    urlPattern: /https:\/\/app\.example\.com\/activate\/.+/i
});
```

## API Reference

### `createTestInbox(apiKey?)`

Creates a temporary MailSlurp inbox for testing.

**Parameters:**
- `apiKey` (optional): MailSlurp API key (defaults to `process.env.MAILSLURP_API_KEY`)

**Returns:**
```typescript
{
    ms: MailSlurp,        // MailSlurp client instance
    inbox: {
        id: string,       // Inbox ID
        emailAddress: string, // Test email address
        // ... other inbox properties
    }
}
```

**Example:**
```typescript
const { ms, inbox } = await createTestInbox();
console.log(inbox.emailAddress); // "abc123@mailslurp.com"
```

---

### `deleteTestInbox(ms, inboxId)`

Deletes a test inbox to clean up resources.

**Parameters:**
- `ms`: MailSlurp client instance
- `inboxId`: ID of the inbox to delete

**Returns:** `Promise<void>`

**Example:**
```typescript
await deleteTestInbox(ms, inbox.id);
```

---

### `waitForOtp6(options)`

Waits for an email containing a 6-digit OTP and extracts it.

**Parameters:**
```typescript
{
    ms: MailSlurp,           // MailSlurp client instance
    inboxId: string,         // Inbox ID to monitor
    subjectLike?: string,    // Subject keyword (default: "verification")
    timeoutMs?: number       // Timeout in ms (default: 60000)
}
```

**Returns:** `Promise<string>` - The 6-digit OTP code

**Handles formats:**
- `123456`
- `123 456`
- `123-456`

**Example:**
```typescript
const otp = await waitForOtp6({
    ms,
    inboxId: inbox.id,
    subjectLike: 'reset password',
    timeoutMs: 90_000
});
console.log(otp); // "123456"
```

---

### `waitForMagicLink(options)`

Waits for an email containing a URL and extracts it.

**Parameters:**
```typescript
{
    ms: MailSlurp,
    inboxId: string,
    subjectLike?: string,         // Subject keyword (default: "verification")
    timeoutMs?: number,           // Timeout in ms (default: 60000)
    urlPattern?: RegExp           // URL pattern (default: /https?:\/\/[^\s"'<>]+/i)
}
```

**Returns:** `Promise<string>` - The extracted URL

**Example:**
```typescript
const link = await waitForMagicLink({
    ms,
    inboxId: inbox.id,
    subjectLike: 'password reset',
    urlPattern: /https:\/\/app\.example\.com\/.+/i
});
await page.goto(link);
```

## Best Practices

### 1. Always Clean Up

Use try/finally blocks to ensure inboxes are deleted:

```typescript
const { ms, inbox } = await createTestInbox();
try {
    // Your test logic
} finally {
    await deleteTestInbox(ms, inbox.id);
}
```

### 2. Use Appropriate Timeouts

Set realistic timeouts based on your email delivery times:

```typescript
// Development: 30-60 seconds
timeoutMs: 60_000

// Production: 90-120 seconds (slower email delivery)
timeoutMs: 120_000
```

### 3. Specific Subject Matching

Use specific subject keywords to avoid catching wrong emails:

```typescript
// Good: Specific
subjectLike: 'password reset verification'

// Bad: Too generic
subjectLike: 'email'
```

### 4. Parallel Test Isolation

Each test should use its own inbox to prevent conflicts:

```typescript
test.describe.parallel('Email tests', () => {
    test('test 1', async () => {
        const { ms, inbox } = await createTestInbox();
        // Test uses inbox 1
    });

    test('test 2', async () => {
        const { ms, inbox } = await createTestInbox();
        // Test uses inbox 2 (isolated)
    });
});
```

### 5. Error Handling

Handle email timeouts gracefully:

```typescript
try {
    const otp = await waitForOtp6({
        ms,
        inboxId: inbox.id,
        timeoutMs: 60_000
    });
} catch (error) {
    console.error('Failed to receive OTP:', error);
    // Take screenshot for debugging
    await page.screenshot({ path: 'otp-timeout.png' });
    throw error;
}
```

## Troubleshooting

### Email not received

1. **Check API key**: Ensure `MAILSLURP_API_KEY` is set correctly
2. **Increase timeout**: Some environments have slower email delivery
3. **Check subject filter**: Ensure `subjectLike` matches actual email subject
4. **Verify email was sent**: Check application logs

### Wrong code extracted

1. **Check email format**: Ensure email contains 6 consecutive digits
2. **Inspect email body**: Use `email.body` to see raw content
3. **Try HTML body**: Some emails only have HTML content

### API rate limits

Free tier has limits. Consider:
1. Reusing inboxes within test suites
2. Upgrading to paid plan for higher limits
3. Running fewer parallel tests

## Examples

See complete examples in:
- `/tests/stagehand/reset-password-with-email.spec.ts`
- `/tests/auth/` (for traditional Playwright approach)

## Resources

- [MailSlurp Documentation](https://docs.mailslurp.com/)
- [MailSlurp Playwright Guide](https://www.mailslurp.com/guides/playwright/)
- [API Reference](https://docs.mailslurp.com/api/)


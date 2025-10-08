# MailSlurp Integration Summary

## ✅ What's Been Added

### 1. **Core Utilities** (`utils/mailslurp.ts`)
- ✅ `createTestInbox()` - Creates temporary email inboxes
- ✅ `deleteTestInbox()` - Cleans up test inboxes
- ✅ `waitForOtp6()` - Extracts 6-digit OTP codes
- ✅ `waitForMagicLink()` - Extracts URLs from emails
- ✅ JSDoc documentation on all functions
- ✅ Error handling and HTML email support
- ✅ Flexible timeout and subject matching

### 2. **Environment Configuration**
- ✅ `.env.example` with all required environment variables
- ✅ Documentation for setup process

### 3. **Example Test**
- ✅ `tests/stagehand/reset-password-with-email.spec.ts`
- ✅ Complete password reset flow with real email verification
- ✅ Demonstrates MailSlurp integration with Stagehand AI

### 4. **Documentation**
- ✅ `utils/README-MAILSLURP.md` - Complete usage guide
- ✅ API reference
- ✅ Best practices
- ✅ Troubleshooting guide
- ✅ Multiple code examples

## 📋 Checklist - What to Do Next

### Step 1: Get MailSlurp API Key
- [ ] Sign up at https://app.mailslurp.com/sign-up/
- [ ] Copy your API key from the dashboard
- [ ] Add `MAILSLURP_API_KEY=your_key_here` to your `.env` file

### Step 2: Test the Integration
```bash
# Run the example test
npx playwright test tests/stagehand/reset-password-with-email.spec.ts --headed
```

### Step 3: Verify .gitignore
- [ ] Ensure `.env` is in `.gitignore` (already done)
- [ ] Never commit real API keys to the repository

### Step 4: Integrate with Existing Tests
Apply MailSlurp to your existing auth tests:
- [ ] `tests/auth/password-reset.spec.ts`
- [ ] `tests/auth/registration.spec.ts`
- [ ] `tests/auth/onboarding.spec.ts`

## 🎯 Recommended Next Steps

### 1. **Create a MailSlurp Fixture** (Optional but Recommended)

Create `tests/fixtures/mailslurp.fixture.ts`:

```typescript
import { test as base } from '@playwright/test';
import { createTestInbox, deleteTestInbox } from '../../utils/mailslurp';
import type { MailSlurp } from 'mailslurp-client';
import type { Inbox } from 'mailslurp-client/dist/generated/models/inbox';

type MailSlurpFixture = {
    mailslurp: {
        ms: MailSlurp;
        inbox: Inbox;
    };
};

export const test = base.extend<MailSlurpFixture>({
    mailslurp: async ({}, use) => {
        const { ms, inbox } = await createTestInbox();
        await use({ ms, inbox });
        await deleteTestInbox(ms, inbox.id);
    },
});

export { expect } from '@playwright/test';
```

**Usage:**
```typescript
import { test, expect } from '../fixtures/mailslurp.fixture';

test('Password reset', async ({ mailslurp }) => {
    const { ms, inbox } = mailslurp;
    // inbox is automatically created and cleaned up
});
```

### 2. **Add Email Templates Type Safety** (Advanced)

Create `types/email-templates.ts`:

```typescript
export type EmailTemplates = {
    passwordReset: {
        subject: string;
        otpLength: 6;
    };
    registration: {
        subject: string;
        otpLength: 6;
    };
    magicLink: {
        subject: string;
        urlPattern: RegExp;
    };
};

export const EMAIL_TEMPLATES: EmailTemplates = {
    passwordReset: {
        subject: 'password reset',
        otpLength: 6,
    },
    registration: {
        subject: 'welcome',
        otpLength: 6,
    },
    magicLink: {
        subject: 'login link',
        urlPattern: /https:\/\/apps\.fliplet\.com\/.+/i,
    },
};
```

### 3. **Create Helper for Registration Flow**

```typescript
// utils/mailslurp.ts

/**
 * Complete registration flow helper with email verification.
 */
export async function registerUserWithEmailVerification({
    ms,
    page,
    userData,
}: {
    ms: MailSlurp;
    page: Page;
    userData: { email: string; password: string; name: string };
}): Promise<string> {
    const { email, password, name } = userData;
    
    // Fill registration form
    await page.getByLabel('Name').fill(name);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Extract inbox ID from email
    const inboxId = email.split('@')[0]; // Depends on your inbox naming
    
    // Wait for verification code
    const otp = await waitForOtp6({
        ms,
        inboxId,
        subjectLike: 'registration',
        timeoutMs: 60_000,
    });
    
    // Enter verification code
    await page.getByLabel('Verification Code').fill(otp);
    await page.getByRole('button', { name: 'Verify' }).click();
    
    return otp;
}
```

### 4. **Add Retry Logic for Flaky Email Delivery**

```typescript
// utils/mailslurp.ts

export async function waitForOtpWithRetry({
    ms,
    inboxId,
    subjectLike = "verification",
    maxRetries = 3,
    retryDelayMs = 5000,
}: {
    ms: MailSlurp;
    inboxId: string;
    subjectLike?: string;
    maxRetries?: number;
    retryDelayMs?: number;
}): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await waitForOtp6({
                ms,
                inboxId,
                subjectLike,
                timeoutMs: 30_000,
            });
        } catch (error) {
            if (attempt === maxRetries) throw error;
            console.log(`Attempt ${attempt} failed, retrying in ${retryDelayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        }
    }
    throw new Error('All retry attempts failed');
}
```

### 5. **Add Test Data Management**

Create `fixtures/test-data.ts`:

```typescript
export const TEST_USERS = {
    validUser: {
        name: 'Test User',
        password: 'SecurePass123!',
    },
    adminUser: {
        name: 'Admin User',
        password: 'AdminPass123!',
    },
};

export const TEST_EMAIL_SUBJECTS = {
    passwordReset: 'reset your password',
    registration: 'verify your email',
    magicLink: 'sign in',
};
```

## 🚀 Integration Patterns

### Pattern 1: Playwright Only
```typescript
import { test, expect } from '@playwright/test';
import { createTestInbox, waitForOtp6, deleteTestInbox } from '../../utils/mailslurp';

test('Password reset', async ({ page }) => {
    const { ms, inbox } = await createTestInbox();
    try {
        // Traditional Playwright selectors
        await page.getByLabel('Email').fill(inbox.emailAddress);
        const otp = await waitForOtp6({ ms, inboxId: inbox.id });
        await page.getByLabel('Code').fill(otp);
    } finally {
        await deleteTestInbox(ms, inbox.id);
    }
});
```

### Pattern 2: Stagehand AI
```typescript
import { test } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';
import { createTestInbox, waitForOtp6, deleteTestInbox } from '../../utils/mailslurp';

test('Password reset with AI', async () => {
    const stagehand = new Stagehand(getStagehandConfig());
    await stagehand.init();
    
    const { ms, inbox } = await createTestInbox();
    try {
        // AI-powered actions
        await stagehand.page.act(`Fill email with ${inbox.emailAddress}`);
        const otp = await waitForOtp6({ ms, inboxId: inbox.id });
        await stagehand.page.act(`Fill verification code with ${otp}`);
    } finally {
        await deleteTestInbox(ms, inbox.id);
        await stagehand.close();
    }
});
```

### Pattern 3: Hybrid (Recommended)
```typescript
test('Password reset hybrid', async ({ page }) => {
    const stagehand = new Stagehand(getStagehandConfig());
    await stagehand.init();
    
    const { ms, inbox } = await createTestInbox();
    try {
        // Fast Playwright for simple actions
        await page.goto('/reset-password');
        await page.getByLabel('Email').fill(inbox.emailAddress);
        
        // AI for complex interactions
        await stagehand.page.act('Click the verification button');
        
        // MailSlurp for email verification
        const otp = await waitForOtp6({ ms, inboxId: inbox.id });
        
        // Back to Playwright for assertion
        await page.getByLabel('Code').fill(otp);
        await expect(page).toHaveURL(/success/);
    } finally {
        await deleteTestInbox(ms, inbox.id);
        await stagehand.close();
    }
});
```

## 📊 Cost Considerations

### MailSlurp Pricing
- **Free Tier**: 50 inboxes/month, good for development
- **Paid Tiers**: Start at $8/month for more inboxes

### Best Practices for Cost Optimization
1. Always delete inboxes after tests
2. Reuse inboxes within test suites when possible
3. Use `.only` during development to avoid running all tests
4. Consider inbox pooling for large test suites

## 🔒 Security Best Practices

1. **Never commit API keys**
   - ✅ Use `.env` for local development
   - ✅ Use CI/CD secrets for pipelines
   - ✅ Add `.env` to `.gitignore`

2. **Rotate API keys regularly**
   - Especially after team changes
   - Use separate keys for dev/staging/prod

3. **Limit API key permissions**
   - Use read-only keys where possible
   - Separate keys per environment

## 📝 Documentation Checklist

- [x] Create MailSlurp utility functions
- [x] Add JSDoc comments
- [x] Create `.env.example`
- [x] Write usage documentation
- [x] Create example test
- [ ] Add to main README.md
- [ ] Create team onboarding guide
- [ ] Add to CI/CD documentation

## 🎓 Resources

- [MailSlurp Documentation](https://docs.mailslurp.com/)
- [Playwright Email Testing Guide](https://www.mailslurp.com/guides/playwright/)
- [MailSlurp API Reference](https://docs.mailslurp.com/api/)
- [Your Local Documentation](utils/README-MAILSLURP.md)

---

**Need Help?**
- Check `utils/README-MAILSLURP.md` for detailed usage
- Review `tests/stagehand/reset-password-with-email.spec.ts` for examples
- Refer to MailSlurp docs for API details


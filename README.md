# 🤖 Stagehand Computer Use Agent Framework

This project is a **Computer Use Agent-focused** testing framework built on [Stagehand](https://github.com/browserbase/stagehand). The **Computer Use Agent** is the main feature - an AI-powered browser automation system that can perform complex, multi-step tasks autonomously using visual understanding.

## 🎯 Overview

**Computer Use Agent** is Stagehand's most advanced capability - it sees the screen like a human, understands context, and performs complex workflows autonomously. This framework is designed around leveraging this powerful AI agent for sophisticated browser automation testing.

### Key Features

- **🤖 Computer Use Agent**: Main feature - autonomous multi-step task execution
- **👁️ Visual Understanding**: Sees and understands web pages like a human
- **🧠 Context-Aware**: Adapts to UI changes and makes intelligent decisions
- **🔄 Autonomous Workflows**: Completes complex business processes without manual intervention
- **📝 Natural Language**: Write tests using plain English instructions
- **⚡ Rapid Development**: Create sophisticated tests quickly without complex selectors

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- **Computer Use Agent API key** (OpenAI or Google Gemini)
- Web application to test

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Setup

Add your **Computer Use Agent** API keys to `.env`:

```bash
# Computer Use Agent - OpenAI (Recommended)
OPENAI_API_KEY=your_openai_api_key_here
AGENT_OPENAI_MODEL=computer-use-preview-2025-03-11

# Computer Use Agent - Google Gemini (Alternative)
GEMINI_API_KEY=your_gemini_api_key_here
AGENT_GEMINI_MODEL=gemini-2.5-computer-use-preview-10-2025

# Application URLs
BASE_URL=https://your-app-url.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

### Your First Computer Use Agent Test

```bash
# Run the onboarding and login test
npx playwright test tests/ai-agent/onboarding-login.spec.ts --headed
```

This will demonstrate the **Computer Use Agent** completing a complex multi-step workflow autonomously!

## 🧪 Test Structure

### Computer Use Agent Tests (Main Focus)

Located in `tests/ai-agent/`:

- **`onboarding-login.spec.ts`** - Complete onboarding and login workflow (main example)
- **`helpers-test.spec.ts`** - Tests using helper functions
- **`computer-use-agent.spec.ts`** - Direct Stagehand implementation

### Helper Functions (Computer Use Agent Support)

Located in `helpers/ai/`:

- **`browser.ts`** - Browser initialization for Computer Use Agent
- **`agent.ts`** - Computer Use Agent creation and configuration

## 🔧 Usage Examples

### Basic Computer Use Agent Test

```typescript
import { test, expect } from '@playwright/test';
import { createBrowser } from '../../helpers/ai/browser';
import { createAgent } from '../../helpers/ai/agent';

test('Computer Use Agent login test', async () => {
  // Initialize browser for Computer Use Agent
  const stagehand = await createBrowser();
  
  // Navigate to page
  await stagehand.page.goto(process.env.BASE_URL);
  
  // Create Computer Use Agent
  const agent = createAgent(stagehand);
  
  // Execute complex workflow autonomously
  await agent.execute("Login with admin credentials and navigate to dashboard");
  
  // Verify result
  const currentUrl = stagehand.page.url();
  expect(currentUrl).toMatch(/.*dashboard/);
  
  // Cleanup
  await stagehand.close();
});
```

### Using Computer Use Agent Helpers (Recommended)

```typescript
test.beforeEach(async () => {
  stagehand = await createBrowser();                    // 1. Create browser for Computer Use Agent
  await stagehand.page.goto(process.env.BASE_URL);     // 2. Navigate to page
  agent = createAgent(stagehand);                       // 3. Create Computer Use Agent
});

test('should complete complex onboarding and login workflow', async () => {
  const task = "Pass the onboarding process and login with admin credentials";
  const result = await agent.execute({
    instruction: task,
    maxSteps: 30,
    autoScreenshot: true
  });
  
  // Verify Computer Use Agent completed successfully
  expect(result.success).toBe(true);
  expect(result.completed).toBe(true);
});
```

### Hybrid Approach (Playwright + AI)

```typescript
test('hybrid test approach', async ({ page }) => {
  // Use Playwright for reliable navigation
  await page.goto(process.env.BASE_URL);
  
  // Use AI for complex interactions
  const stagehand = await createBrowser();
  const agent = createAgent(stagehand);
  await agent.execute("Complete the complex multi-step form");
  
  // Use Playwright for assertions
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});
```

## 🤖 Computer Use Agent

The **Computer Use Agent** is Stagehand's most advanced AI capability - it can perform complex, multi-step tasks autonomously using visual understanding and natural language instructions.

### What is Computer Use Agent?

Computer Use Agent is an AI-powered browser automation system that:
- **Sees the screen** like a human would
- **Understands context** and can adapt to UI changes
- **Performs multi-step tasks** autonomously
- **Makes decisions** based on what it sees
- **Handles complex workflows** without manual intervention

### Computer Use Agent vs Regular Stagehand

| Feature | Regular Stagehand | Computer Use Agent |
|---------|------------------|-------------------|
| **Task Complexity** | Single actions | Multi-step workflows |
| **Visual Understanding** | Text-based selectors | Screenshot analysis |
| **Adaptability** | Fixed instructions | Context-aware decisions |
| **Autonomy** | Manual step-by-step | Autonomous execution |
| **Use Case** | Simple interactions | Complex business flows |

### Setting Up Computer Use Agent

#### 1. Environment Variables

Add these to your `.env` file:

```bash
# OpenAI Computer Use Agent
OPENAI_API_KEY=your_openai_api_key_here
AGENT_OPENAI_MODEL=computer-use-preview-2025-03-11

# Google Gemini Computer Use Agent (Alternative)
GEMINI_API_KEY=your_gemini_api_key_here
AGENT_GEMINI_MODEL=gemini-2.5-computer-use-preview-10-2025
```

#### 2. Browser Configuration

```typescript
// helpers/ai/browser.ts
export async function createBrowser() {
  const stagehand = new Stagehand({
    env: "LOCAL",
    useAPI: false,
    verbose: 1, // Shows agent reasoning
    localBrowserLaunchOptions: {
      headless: false // Computer Use Agent needs visual access
    }
  });
  
  await stagehand.init();
  return stagehand;
}
```

#### 3. Agent Configuration

```typescript
// helpers/ai/agent.ts
export function createAgent(stagehand: any) {
  return stagehand.agent({
    provider: "google", // or "openai"
    model: "gemini-2.5-computer-use-preview-10-2025",
    instructions: `You are a helpful assistant that can use a web browser.
    You are currently on the following page: ${stagehand.page.url()}.
    Do not ask follow up questions, the user will trust your judgement.`,
    options: {
      apiKey: process.env.GEMINI_API_KEY
    }
  });
}
```

### Computer Use Agent Examples

#### 1. Complete Onboarding and Login Flow

```typescript
test('should complete onboarding and login process', async () => {
  const onboardingSteps = [
    'Click "Explore More" button',
    'Click "Continue" button',  
    'Click "Continue" button',
    'Click "Let\'s get started!" button',
    'Verify you are redirected to the Login page'
  ];
  
  const loginSteps = [
    `Enter email: ${process.env.ADMIN_EMAIL}`,
    `Enter password: ${process.env.ADMIN_PASSWORD}`,
    'Click login button',
    'Verify you are redirected to the Dashboard/Home page'
  ];
  
  const task = `
ONBOARDING STEPS:
${onboardingSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

LOGIN STEPS:
${loginSteps.map((step, index) => `${index + onboardingSteps.length + 1}. ${step}`).join('\n')}

CRITICAL: NEVER use keyboard keys like ArrowRight, ArrowLeft, Tab, Enter. 
ONLY use mouse clicks and typing text. Do not press any keyboard navigation keys.`;
  
  const result = await agent.execute({
    instruction: task,
    maxSteps: 30,
    autoScreenshot: true
  });
  
  // Verify success
  expect(result.success).toBe(true);
  expect(result.completed).toBe(true);
});
```

#### 2. Complex E-commerce Workflow

```typescript
test('should complete full purchase flow', async () => {
  const task = `
1. Search for "wireless headphones" in the search bar
2. Click on the first product result
3. Select "Black" color option
4. Click "Add to Cart" button
5. Click "Proceed to Checkout" button
6. Enter shipping address:
   - Name: John Doe
   - Address: 123 Main St
   - City: New York
   - ZIP: 10001
7. Select "Standard Shipping" option
8. Enter payment information:
   - Card: 4111 1111 1111 1111
   - Expiry: 12/25
   - CVV: 123
9. Click "Place Order" button
10. Verify order confirmation page appears

IMPORTANT: Handle any popups, modals, or unexpected dialogs that appear during the process.`;
  
  const result = await agent.execute({
    instruction: task,
    maxSteps: 50,
    autoScreenshot: true
  });
  
  expect(result.success).toBe(true);
});
```

#### 3. Form Validation Testing

```typescript
test('should handle form validation errors', async () => {
  const task = `
1. Navigate to the registration form
2. Leave all fields empty
3. Click "Submit" button
4. Verify validation error messages appear for:
   - Email field (required)
   - Password field (required)
   - Confirm password field (required)
5. Enter invalid email format: "invalid-email"
6. Click "Submit" button
7. Verify email format error message appears
8. Enter valid email: "test@example.com"
9. Enter password: "123"
10. Click "Submit" button
11. Verify password length error message appears`;
  
  const result = await agent.execute({
    instruction: task,
    maxSteps: 25,
    autoScreenshot: true
  });
  
  expect(result.success).toBe(true);
});
```

### Computer Use Agent Best Practices

#### 1. Task Instructions

**✅ Good Instructions:**
```typescript
const task = `
1. Click the "Sign In" button in the top-right corner
2. Enter email: admin@example.com
3. Enter password: secretpassword
4. Click the blue "Login" button
5. Verify you see "Welcome, Admin!" message
6. Navigate to the "Settings" page using the sidebar menu`;
```

**❌ Poor Instructions:**
```typescript
const task = "Login and go to settings"; // Too vague
```

#### 2. Error Handling

```typescript
test('should handle login with invalid credentials', async () => {
  const task = `
1. Enter email: invalid@email.com
2. Enter password: wrongpassword
3. Click login button
4. Verify error message appears: "Invalid credentials"
5. Verify you remain on the login page (not redirected)`;
  
  try {
    const result = await agent.execute({
      instruction: task,
      maxSteps: 15,
      autoScreenshot: true
    });
    
    // Check if agent detected the error
    if (!result.success) {
      console.log('Agent correctly detected failure:', result.message);
    }
  } catch (error) {
    console.error('Agent execution failed:', error);
    throw error;
  }
});
```

#### 3. Dynamic Task Building

```typescript
function buildLoginTask(credentials: { email: string; password: string }) {
  return `
1. Enter email: ${credentials.email}
2. Enter password: ${credentials.password}
3. Click login button
4. Verify successful login by checking for dashboard elements`;
}

// Usage
const adminTask = buildLoginTask({ 
  email: process.env.ADMIN_EMAIL, 
  password: process.env.ADMIN_PASSWORD 
});
await agent.execute({ instruction: adminTask, maxSteps: 10 });
```

#### 4. Verification Steps

Always include verification steps in your tasks:

```typescript
const task = `
1. Complete the registration form
2. Submit the form
3. VERIFY: Check that success message appears
4. VERIFY: Check that you're redirected to dashboard
5. VERIFY: Check that user menu shows your name`;
```

### Computer Use Agent Configuration Options

```typescript
const result = await agent.execute({
  instruction: task,
  maxSteps: 30,        // Maximum number of steps
  autoScreenshot: true, // Take screenshots during execution
  timeout: 120000      // Timeout in milliseconds
});
```

### Troubleshooting Computer Use Agent

#### Common Issues

**1. Agent Not Clicking Elements**
- Ensure `headless: false` in browser config
- Check that viewport is set correctly (1024x768 recommended)
- Verify task instructions are specific enough

**2. Agent Using Wrong Keyboard Keys**
- Add explicit instructions: "NEVER use keyboard navigation keys"
- Specify: "ONLY use mouse clicks and typing text"

**3. Agent Getting Stuck**
- Increase `maxSteps` parameter
- Break complex tasks into smaller chunks
- Add more specific instructions

**4. Agent Not Completing Tasks**
- Check `result.success` and `result.completed` flags
- Review agent logs with `verbose: 1`
- Verify task instructions are achievable

### Performance Considerations

- **Computer Use Agent is slower** than regular Stagehand methods
- **Use for complex workflows** where the flexibility is worth the overhead
- **Combine with regular Stagehand** for hybrid approaches
- **Set appropriate timeouts** (120+ seconds for complex tasks)

### API Model Requirements

**OpenAI Computer Use:**
- Requires `computer-use-preview-2025-03-11` model
- Needs API key with Computer Use permissions
- More expensive than regular GPT models

**Google Gemini Computer Use:**
- Requires `gemini-2.5-computer-use-preview-10-2025` model
- Generally faster and more cost-effective
- Good alternative to OpenAI

## 🎭 Regular Stagehand Methods

### Natural Language Actions

```typescript
// Complex interactions
await stagehand.page.act("Fill out the registration form with valid user data");
await stagehand.page.act("Navigate to settings and update profile picture");
await stagehand.page.act("Complete the checkout process with test payment info");

// Error handling
await stagehand.page.act("Try to login with invalid credentials and verify error message");
```

### AI Methods

- **`agent.execute(instruction)`** - Computer Use Agent for complex workflows
- **`stagehand.page.act(instruction)`** - Direct page actions
- **`stagehand.page.observe(instruction)`** - Identify elements on page
- **`stagehand.page.extract(instruction)`** - Extract data from page

## 🏗️ Project Structure

```
my-stagehand-app/
├── helpers/ai/                 # AI helper functions
│   ├── browser.ts             # Browser initialization
│   └── agent.ts               # Agent creation
├── tests/ai-agent/            # AI-powered tests
│   ├── helpers-test.spec.ts   # Tests using helpers
│   ├── computer-use-agent.spec.ts
│   └── onboarding-login.spec.ts
├── tests/journeys/            # Traditional Playwright tests
├── page-objects/              # Shared page objects
├── test-data/                 # Test data
└── ComputerUseAgents.js       # Standalone script
```

## 🚀 Running Tests

### Computer Use Agent Tests

```bash
# Run Computer Use Agent tests
npx playwright test tests/ai-agent/onboarding-login.spec.ts

# Run with UI mode (recommended for Computer Use Agent)
npx playwright test tests/ai-agent/onboarding-login.spec.ts --headed

# Run with verbose logging to see agent reasoning
npx playwright test tests/ai-agent/onboarding-login.spec.ts --reporter=list
```

### AI Agent Tests

```bash
# Run all AI agent tests
npx playwright test --project="AI Agent: Computer Use"

# Run specific AI test file
npx playwright test tests/ai-agent/helpers-test.spec.ts

# Run with UI mode
npx playwright test --project="AI Agent: Computer Use" --ui
```

### Traditional Playwright Tests

```bash
# Run all traditional tests
npx playwright test

# Run specific project
npx playwright test --project="Journey: Admin"
```

### Standalone Script

```bash
# Run the original standalone script
node ComputerUseAgents.js
```

## ⚙️ Configuration

### Playwright Config

The AI Agent project is configured in `playwright.config.ts`:

```typescript
{
  name: 'AI Agent: Computer Use',
  testDir: './tests/ai-agent',
  testMatch: 'tests/ai-agent/**/*.spec.ts',
  timeout: 120000, // Longer timeout for AI operations
  use: { 
    ...devices['Desktop Chrome'],
    // No storage state - AI agent handles its own browser
  },
}
```

### Stagehand Configuration

```typescript
const stagehand = new Stagehand({
  env: "LOCAL", // or "BROWSERBASE" for cloud
  localBrowserLaunchOptions: {
    headless: false,
    viewport: { width: 1920, height: 1080 },
  }
});
```

## 🎯 When to Use Each Approach

### ✅ Use AI Agent Tests For:

- **Complex UI Interactions**: Multi-step forms, dynamic content
- **Rapid Test Creation**: Quick prototyping and exploratory testing
- **Maintenance-Heavy Tests**: Tests that break due to UI changes
- **Cross-Platform Testing**: Ensuring consistent behavior
- **Non-Technical Team Members**: Enabling QA to write tests

### ✅ Use Traditional Playwright For:

- **Performance-Critical Tests**: When speed is crucial
- **Simple Interactions**: Basic clicks and form fills
- **CI/CD Pipelines**: Where deterministic behavior is needed
- **Large-Scale Test Suites**: Where AI overhead is significant

## 🔧 Best Practices

### Effective AI Instructions

```typescript
// ✅ Good - Specific and contextual
await agent.execute("Click the blue 'Submit' button in the login form");
await agent.execute("Fill the email field with admin@example.com");

// ❌ Avoid - Too vague
await agent.execute("Click button");
await agent.execute("Fill form");
```

### Hybrid Approach

```typescript
// Use Playwright for reliable operations
await page.goto(url);
await page.waitForLoadState('networkidle');

// Use AI for complex interactions
await agent.execute("Complete the multi-step wizard");

// Use Playwright for assertions
await expect(page.locator('[data-testid="success"]')).toBeVisible();
```

### Performance Optimization

- **Cache Results**: Store `observe()` results to avoid repeated AI calls
- **Batch Operations**: Group related actions in single `execute()` calls
- **Environment Selection**: Use LOCAL for development, BROWSERBASE for CI/CD

## 🐛 Troubleshooting

### Common Issues

**API Key Errors:**
```
Error: 401 You have insufficient permissions for this operation
```
- Ensure OpenAI API key has correct permissions
- Enable "Read" for Models and "Write" for Model capabilities

**Browser Launch Issues:**
```
Error: Cannot find module 'playwright'
```
- Run `npx playwright install` to install browsers

**Timeout Issues:**
- AI operations take longer - increase timeout in config
- Use `timeout: 120000` for AI agent projects

### Debug Mode

```bash
# Run with debug output
npx playwright test --project="AI Agent: Computer Use" --debug

# Run with verbose logging
npx playwright test --project="AI Agent: Computer Use" --reporter=list
```

## 📊 Integration with Existing Framework

This Stagehand integration works alongside the existing Playwright test framework:

- **Shared Resources**: Same test data, page objects, and environment configs
- **Parallel Execution**: AI tests run independently of traditional tests
- **Unified Reporting**: All tests generate consistent Playwright reports
- **CI/CD Ready**: Integrates with existing pipeline configurations

## 🔄 Migration Path

1. **Start Small**: Begin with simple AI tests for complex interactions
2. **Hybrid Approach**: Combine AI with existing Playwright tests
3. **Gradual Adoption**: Migrate maintenance-heavy tests to AI
4. **Team Training**: Enable non-technical team members to write AI tests

## 📚 Resources

- [Stagehand Documentation](https://github.com/browserbase/stagehand)
- [Playwright Documentation](https://playwright.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🤝 Contributing

1. Follow existing code patterns and conventions
2. Add comprehensive test coverage for new AI features
3. Update documentation for any new helper functions
4. Ensure all tests pass before submitting PRs

---

**Branch**: `dev-stagehand-clean`  
**Last Updated**: 2025-01-09  
**Status**: Ready for AI-powered testing integration
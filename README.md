# 🤖 Stagehand AI Testing Framework Integration

This project integrates [Stagehand](https://github.com/browserbase/stagehand) AI-powered browser automation with our existing Playwright test framework, providing both traditional and AI-driven testing capabilities.

## 🎯 Overview

Stagehand is an SDK for automating browsers using natural language instructions. Built on top of [Playwright](https://playwright.dev/), it provides AI-powered automation that can understand and interact with web pages using human-like instructions.

### Key Features

- **Natural Language Testing**: Write tests using plain English instructions
- **AI-Powered Interactions**: Automatically find and interact with UI elements
- **Hybrid Approach**: Combine traditional Playwright with AI automation
- **Cross-Platform**: Works with any web application
- **Maintenance-Friendly**: Tests adapt to UI changes automatically

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- OpenAI API key (for computer-use model)
- Existing Playwright test framework

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Setup

Add your API keys to `.env`:

```bash
# Required for AI operations
OPENAI_API_KEY=your_openai_api_key_here

# Application URLs
BASE_URL=https://your-app-url.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

## 🧪 Test Structure

### AI Agent Tests

Located in `tests/ai-agent/`:

- **`helpers-test.spec.ts`** - Tests using helper functions (recommended)
- **`computer-use-agent.spec.ts`** - Direct Stagehand implementation
- **`onboarding-login.spec.ts`** - Isolated test approach

### Helper Functions

Located in `helpers/ai/`:

- **`browser.ts`** - Browser initialization helper
- **`agent.ts`** - AI agent creation helper

## 🔧 Usage Examples

### Basic AI Agent Test

```typescript
import { test, expect } from '@playwright/test';
import { createBrowser } from '../../helpers/ai/browser';
import { createAgent } from '../../helpers/ai/agent';

test('AI-powered login test', async () => {
  // Initialize browser
  const stagehand = await createBrowser();
  
  // Navigate to page
  await stagehand.page.goto(process.env.BASE_URL);
  
  // Create AI agent
  const agent = createAgent(stagehand);
  
  // Execute natural language task
  await agent.execute("Login with admin credentials and navigate to dashboard");
  
  // Verify result
  await expect(stagehand.page).toHaveURL(/.*dashboard/);
  
  // Cleanup
  await stagehand.close();
});
```

### Using Helpers (Recommended)

```typescript
test.beforeEach(async () => {
  stagehand = await createBrowser();                    // 1. Create browser
  await stagehand.page.goto(process.env.BASE_URL);     // 2. Navigate to page
  agent = createAgent(stagehand);                       // 3. Create agent
});

test('should complete onboarding and login', async () => {
  const task = "Pass the onboarding process and login with admin credentials";
  await agent.execute(task);
  await expect(stagehand.page).toHaveURL(/.*dashboard|.*home|.*main/);
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

## 🎭 AI Agent Capabilities

### Natural Language Actions

```typescript
// Complex interactions
await agent.execute("Fill out the registration form with valid user data");
await agent.execute("Navigate to settings and update profile picture");
await agent.execute("Complete the checkout process with test payment info");

// Error handling
await agent.execute("Try to login with invalid credentials and verify error message");
```

### AI Methods

- **`agent.execute(instruction)`** - Perform actions using natural language
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
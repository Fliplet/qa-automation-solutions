// Stagehand + Browserbase: Computer Use Agent (CUA) Example - See README.md for full documentation

import { Stagehand } from "@browserbasehq/stagehand";

// ============================================================================
// EXAMPLE INSTRUCTIONS - Choose one to test different scenarios
// ============================================================================

// Example 1: Learning Plan Creation
// const instruction = `I want to learn more about Sourdough Bread Making. It's my first time learning about it, and want to get a good grasp by investing 1 hour a day for the next 2 months. Go find online courses/resources, create a plan cross-referencing the time I want to invest with the modules/timelines of the courses and return the plan`;

// Example 2: Flight Search
// const instruction = `Use flights.google.com to find the lowest fare from all eligible one-way flights for 1 adult from JFK to Heathrow in the next 30 days.`;

// Example 3: Solar Eclipse Research
const instruction = `1.Click "Explore More" button
2. Click "Continue" button  
3. Click "Continue" button
4. Click "Let's get started!" button
5. Enter email: ${process.env.ADMIN_EMAIL}
6. Enter password: ${process.env.ADMIN_PASSWORD}
7. Click login button

CRITICAL: NEVER use keyboard keys like ArrowRight, ArrowLeft, Tab, Enter. ONLY use mouse clicks and typing text. Do not press any keyboard navigation keys.`;

// Example 4: GitHub PR Verification
// const instruction = `Find the most recently opened non-draft PR on Github for Browserbase's Stagehand project and make sure the combination-evals in the PR validation passed.`;

// ============================================================================

async function main() {

  const stagehand = new Stagehand({
    env: "LOCAL",
    // modelName: "google/gemini-2.5-pro", // this is the model stagehand uses in act, observe, extract (not agent)
    useAPI: false,
    verbose: 1,
    // 0 = errors only, 1 = info, 2 = debug 
    // (When handling sensitive data like passwords or API keys, set verbose: 0 to prevent secrets from appearing in logs.) 
    // https://docs.stagehand.dev/configuration/logging
    browserbaseSessionCreateParams: {
      projectId: process.env.BROWSERBASE_PROJECT_ID,
      proxies: true, // Using proxies will give the agent a better chance of success - requires Developer Plan or higher, comment out if you don't have access
      region: "us-west-2",
      browserSettings: {
        blockAds: true,
      },
    },
  });

  try {
    // Initialize browser session to start automation.
    await stagehand.init();
    console.log("Stagehand initialized successfully!");
    console.log(`Live View Link: https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`);

    const page = stagehand.page;

    // Navigate to search engine with extended timeout for slow-loading sites.
    await page.goto("https://apps.fliplet.com/fliplet-aqa-events-aqa-aibe-2-eat", {
      waitUntil: 'domcontentloaded',
    });

    // Create agent with computer use capabilities for autonomous web browsing.
    const agent = stagehand.agent({
      provider: "google",
      model: "gemini-2.5-computer-use-preview-10-2025",
      instructions: `You are a helpful assistant that can use a web browser.
      You are currently on the following page: ${page.url()}.
      Do not ask follow up questions, the user will trust your judgement. If you are getting blocked on google, try another search engine.`,
      options: {
        apiKey: process.env.GEMINI_API_KEY,
      },
    });

    console.log("Executing instruction:", instruction);
    const result = await agent.execute({
      instruction: instruction,
      maxSteps: 30,
      autoScreenshot: true
    });

    if (result.success === true) {
      console.log("Task completed successfully!");
      console.log("Result:", result);
    } else {
      console.log("Task failed or was incomplete");
    }

  } catch (error) {
    console.error("Error executing computer use agent:", error);
  } finally {
    await stagehand.close();
    console.log("Session closed successfully");
  }
}

main().catch((err) => {
  console.error("Error in computer use agent example:", err);
  console.error("Common issues:");
  console.error("  - Check .env file has BROWSERBASE_PROJECT_ID and BROWSERBASE_API_KEY");
  console.error("  - Verify GOOGLE_API_KEY is set for the agent");
  console.error("  - Ensure internet connection and website accessibility");
  console.error("Docs: https://docs.browserbase.com/stagehand");
  process.exit(1);
});
import { Stagehand } from "@browserbasehq/stagehand";

const stagehand = new Stagehand({
  env: "LOCAL",
  localBrowserLaunchOptions: {
    headless: false,
    viewport: {
      width: 1920,
      height: 1080,
    },
  }
});

await stagehand.init();

// Navigate to a website
await stagehand.page.goto(process.env.BASE_URL);

const agent = stagehand.agent({
	// You can use either OpenAI or Anthropic
	provider: "OpenAI",
	// The model to use (computer-use-preview for OpenAI)
	model: "computer-use-preview-2025-03-11",

	// Customize the system prompt
	instructions: `You are a helpful assistant that can use a web browser.
	Do not ask follow up questions, the user will trust your judgement.`,

	// Customize the API key
	options: {
		apiKey: process.env.OPENAI_API_KEY,
	},
});

// Execute the agent
await agent.execute("Pass the onboarding process and try to login to the app using the credentials provided: " + process.env.ADMIN_EMAIL + " " + process.env.ADMIN_PASSWORD);
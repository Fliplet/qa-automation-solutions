export interface AgentConfig {
  provider?: "openai" | "anthropic" | "google";
  model?: string;
  instructions?: string;
  apiKey?: string;
}

export function createAgent(stagehand: any, config: AgentConfig = {}) {
  const {
    provider = "google",
    model = process.env.AGENT_GEMINI_MODEL || "gemini-2.5-computer-use-preview-10-2025",
    instructions = `You are a helpful assistant that can use a web browser.
    You are currently on the following page: ${stagehand.page.url()}.
    Do not ask follow up questions, the user will trust your judgement.`,
    apiKey = process.env.GEMINI_API_KEY
  } = config;

  return stagehand.agent({
    provider,
    model,
    instructions,
    options: {
      apiKey,
    },
  });
}

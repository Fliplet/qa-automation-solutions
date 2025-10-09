export interface AgentConfig {
  provider?: "openai" | "anthropic";
  model?: string;
  instructions?: string;
  apiKey?: string;
}

export function createAgent(stagehand: any, config: AgentConfig = {}) {
  const {
    provider = "openai",
    model = "computer-use-preview",
    instructions = "You are a helpful assistant that can use a web browser. Do not ask follow up questions, the user will trust your judgement.",
    apiKey = process.env.OPENAI_API_KEY
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

import type { ConstructorParams } from '@browserbasehq/stagehand';

/**
 * Returns the Stagehand configuration based on environment variables.
 * @returns Stagehand configuration object
 */
export function getStagehandConfig(): ConstructorParams {
    return {
        env: (process.env.STAGEHAND_ENV as 'LOCAL' | 'BROWSERBASE') || 'LOCAL',
        apiKey: process.env.BROWSERBASE_API_KEY,
        projectId: process.env.BROWSERBASE_PROJECT_ID,
        domSettleTimeoutMs: 30_000,
        enableCaching: true,
        modelName: (process.env.STAGEHAND_MODEL as 'gpt-4o' | 'claude-3-5-sonnet-latest') || 'gpt-4o',
        modelClientOptions: {
            apiKey: process.env.OPENAI_API_KEY,
        },
        verbose: 2,
    } as ConstructorParams;
}


import { Stagehand } from "@browserbasehq/stagehand";

export interface BrowserConfig {
  headless?: boolean;
  viewport?: {
    width: number;
    height: number;
  };
}

export async function createBrowser(config: BrowserConfig = {}) {
  const {
    headless = false,
    viewport = { width: 1920, height: 1080 }
  } = config;

  const stagehand = new Stagehand({
    env: "LOCAL",
    localBrowserLaunchOptions: {
      headless,
      viewport,
    }
  });
  
  await stagehand.init();
  return stagehand;
}

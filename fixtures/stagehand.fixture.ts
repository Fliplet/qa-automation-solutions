import { test as base, Page } from '@playwright/test';
import { Stagehand } from "@browserbasehq/stagehand";

type StagehandType = typeof Stagehand;

type StagehandFixture = {
  stagehand: InstanceType<StagehandType>;
};

export const test = base.extend<StagehandFixture>({
  stagehand: async ({ page }: { page: Page }, use: (stagehand: InstanceType<StagehandType>) => Promise<void>) => {
    const stagehand = new Stagehand({
      env: 'LOCAL',
      verbose: 2,
    });

    await stagehand.init();
    await use(stagehand);
    await stagehand.close();
  }
});

export { expect } from '@playwright/test';

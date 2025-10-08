// base.page.ts
import { Page } from '@playwright/test';
import { Stagehand } from '@browserbasehq/stagehand';

/**
 * BasePage — shared parent for all page objects.
 * Receives an already initialized Stagehand instance.
 */
export abstract class BasePage {
  public  page: Page;
  protected stagehand?: Stagehand;

  constructor(page: Page, stagehand?: Stagehand) {
    this.page = page;
    this.stagehand = stagehand;
  }
}
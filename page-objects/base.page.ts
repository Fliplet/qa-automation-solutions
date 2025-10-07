import { Page } from '@playwright/test';
import { Stagehand } from "@browserbasehq/stagehand";

type StagehandType = typeof Stagehand;

/**
 * Represents the base page for all page objects.
 * It provides the common page property and Stagehand integration that can be shared across different pages.
 */
export abstract class BasePage {
  protected page: Page;
  protected stagehand: InstanceType<StagehandType>;

  /**
   * Initializes a new instance of the BasePage class.
   * @param page The Playwright page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.stagehand = new Stagehand({
      env: 'LOCAL',
      verbose: 2,
    });
  }

  /**
   * Initializes Stagehand for AI automation
   * Call this method before using any AI-powered methods
   */
  async initStagehand(): Promise<void> {
    // Initialize Stagehand
    await this.stagehand.init();
  }

  /**
   * Closes Stagehand session
   * Call this method when done with AI automation
   */
  async closeStagehand(): Promise<void> {
    await this.stagehand.close();
  }

  /**
   * Ensures Stagehand is initialized before use
   * This method can be called safely multiple times
   */
  protected async ensureStagehandInitialized(): Promise<void> {
    try {
      // Try to access stagehand.page to check if initialized
      await this.stagehand.page;
    } catch (error) {
      // If not initialized, initialize it
      await this.stagehand.init();
    }
  }
} 
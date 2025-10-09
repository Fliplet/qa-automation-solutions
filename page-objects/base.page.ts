import { Stagehand } from '@browserbasehq/stagehand';

/**
 * BasePage — shared parent for all page objects.
 * Receives an initialized Stagehand instance.
 */
export abstract class BasePage {
  protected stagehand: Stagehand;

  constructor(stagehand: Stagehand) {
    this.stagehand = stagehand;
  }
}
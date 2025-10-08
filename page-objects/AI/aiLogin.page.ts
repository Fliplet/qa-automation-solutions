// aiLogin.page.ts
import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { Stagehand } from '@browserbasehq/stagehand';

export class AILoginPage extends BasePage {
  constructor(page: Page, stagehand: Stagehand) {
    super(page, stagehand);
  }

  async aiLogin(username: string, password: string): Promise<void> {
    await this.stagehand.page.act(`Fill the email field with ${username}`);
    await this.stagehand.page.act(`Fill the password field with ${password}`);
    await this.stagehand.page.act(`Click the login button`);
    await this.page.waitForLoadState('networkidle');
  }

  // ... (all other methods unchanged)
}
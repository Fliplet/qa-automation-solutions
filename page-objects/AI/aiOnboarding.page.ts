import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { Stagehand } from '@browserbasehq/stagehand';


export class AIOboardingPage extends BasePage {
  constructor(page: Page, stagehand: Stagehand) {
    super(page, stagehand);
  }
  
  async aiCompleteOnboarding(stagehand: Stagehand): Promise<void> {
    // Slide 1 → Click "Explore More"
    let observed = await stagehand.page.observe('List all visible buttons or clickable elements');
    if (/Explore\s*More/i.test(JSON.stringify(observed))) {
      await stagehand.page.act('Click the "Explore More" button');
      await this.page.waitForTimeout(1000); // allow slide animation
    }
  
    // Slide 2 → Click "Continue"
    observed = await stagehand.page.observe('List all visible buttons or clickable elements');
    if (/Continue/i.test(JSON.stringify(observed))) {
      await stagehand.page.act('Click the "Continue" button');
      await this.page.waitForTimeout(1000);
    }
  
    // Slide 3 → Click "Continue"
    observed = await stagehand.page.observe('List all visible buttons or clickable elements');
    if (/Continue/i.test(JSON.stringify(observed))) {
      await stagehand.page.act('Click the "Continue" button');
      await this.page.waitForTimeout(1000);
    }
  
    // Slide 4 → Click "Let’s get started"
    observed = await stagehand.page.observe('List all visible buttons or clickable elements');
    if (/Let('|’)?s\s*get\s*started/i.test(JSON.stringify(observed))) {
      await stagehand.page.act('Click the "Let’s get started" button');
      await this.page.waitForTimeout(1500);
    }
  
    // Wait for login form or next page
    await this.page.waitForLoadState('networkidle');
  }
  

  // async aiCompleteOnboarding(stagehand: Stagehand): Promise<void> {
  //   // Repeat until "Let's get started" is found
  //   for (let i = 0; i < 5; i++) {
  //     const observed = await stagehand.page.observe(
  //       'List all visible buttons or clickable elements on the screen'
  //     );
  //     const text = JSON.stringify(observed);
  
  //     if (/Let('|’)?s\s*get\s*started/i.test(text)) {
  //       await stagehand.page.act('Click the "Let\'s get started" button');
  //       break;
  //     } else if (/Continue/i.test(text)) {
  //       await stagehand.page.act('Click the "Continue" button');
  //     } else if (/Explore\s*More/i.test(text)) {
  //       await stagehand.page.act('Click the "Explore More" button');
  //     } else {
  //       // nothing recognizable, stop retrying
  //       break;
  //     }
  
  //     await this.page.waitForLoadState('networkidle');
  //   }
  
  //   // Final wait for login or next screen
  //   await this.page.waitForLoadState('networkidle');
  // }
  
  // async aiCompleteOnboarding(stagehand: Stagehand): Promise<void> {
  //   // Slide 1
  //   await stagehand.page.act('Click the "Explore More" button on Slide 1');
  //   await this.page.waitForLoadState('networkidle');
  
  //   // Slide 2
  //   await stagehand.page.act('Click the "Continue" button on Slide 2');
  //   await this.page.waitForLoadState('networkidle');
  
  //   // Slide 3
  //   await stagehand.page.act('Click the "Continue" button on Slide 3');
  //   await this.page.waitForLoadState('networkidle');
  
  //   // Slide 4
  //   await stagehand.page.act('Click the "Let\'s get started" button on Slide 4');
  //   await this.page.waitForLoadState('networkidle');
  // }



  // async aiCompleteOnboarding(stagehand: Stagehand): Promise<void> {
  //   // Slide 1
  //   const slide1 = await stagehand.page.observe('List all visible buttons or clickable elements');
  //   if (/Explore\s*More/i.test(JSON.stringify(slide1))) {
  //     await stagehand.page.act('Click the "Explore More" button on Slide 1');
  //     await this.page.waitForLoadState('networkidle');
  //   }
  
  //   // Slide 2
  //   const slide2 = await stagehand.page.observe('List all visible buttons on Slide 2');
  //   if (/Continue/i.test(JSON.stringify(slide2))) {
  //     await stagehand.page.act('Click the "Continue" button on Slide 2');
  //     await this.page.waitForLoadState('networkidle');
  //   }
  
  //   // Slide 3
  //   const slide3 = await stagehand.page.observe('List all visible buttons on Slide 3');
  //   if (/Continue/i.test(JSON.stringify(slide3))) {
  //     await stagehand.page.act('Click the "Continue" button on Slide 3');
  //     await this.page.waitForLoadState('networkidle');
  //   }
  
  //   // Slide 4
  //   const slide4 = await stagehand.page.observe('List all visible buttons on Slide 4');
  //   if (/Let('|’)?s\s*get\s*started/i.test(JSON.stringify(slide4))) {
  //     await stagehand.page.act('Click the "Let\'s get started" button on Slide 4');
  //     await this.page.waitForLoadState('networkidle');
  //   }
  
  //   // Final wait for login form or next screen
  //   await this.page.waitForLoadState('networkidle');
  // }
}
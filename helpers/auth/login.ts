// helpers/auth/login.ts

import { Stagehand } from '@browserbasehq/stagehand';
import { AIOnboardingPage } from '../../page-objects/aiOnboarding.page';
import { AILoginPage } from '../../page-objects/aiLogin.page';
import { 
  ADMIN_EMAIL, 
  ADMIN_PASSWORD, 
  ATTENDEE_EMAIL, 
  ATTENDEE_PASSWORD,
  SPEAKER_EMAIL,
  SPEAKER_PASSWORD,
  EXHIBITOR_EMAIL,
  EXHIBITOR_PASSWORD
} from '../../test-data/app.data';

/**
 * Login as Admin user using Stagehand AI (includes onboarding completion)
 * @param stagehand - Stagehand instance
 */
export async function loginAsAdmin(stagehand: Stagehand): Promise<void> {
  const aiOnboarding = new AIOnboardingPage(stagehand);
  const aiLogin = new AILoginPage(stagehand);

  await aiOnboarding.goto();
  await stagehand.page.waitForLoadState('networkidle');
  await aiOnboarding.completeOnboarding();
  await aiLogin.aiLogin(ADMIN_EMAIL, ADMIN_PASSWORD);
  
  // Wait for navigation to complete
  await stagehand.page.waitForLoadState('networkidle');
}

/**
 * Login as Attendee user using Stagehand AI (includes onboarding completion)
 * @param stagehand - Stagehand instance
 */
export async function loginAsAttendee(stagehand: Stagehand): Promise<void> {
  const aiOnboarding = new AIOnboardingPage(stagehand);
  const aiLogin = new AILoginPage(stagehand);

  await aiOnboarding.goto();
  await stagehand.page.waitForLoadState('networkidle');
  await aiOnboarding.completeOnboarding();
  await aiLogin.aiLogin(ATTENDEE_EMAIL, ATTENDEE_PASSWORD);
  
  // Wait for navigation to complete
  await stagehand.page.waitForLoadState('networkidle');
}

/**
 * Login as Speaker user using Stagehand AI (includes onboarding completion)
 * @param stagehand - Stagehand instance
 */
export async function loginAsSpeaker(stagehand: Stagehand): Promise<void> {
  const aiOnboarding = new AIOnboardingPage(stagehand);
  const aiLogin = new AILoginPage(stagehand);

  await aiOnboarding.goto();
  await stagehand.page.waitForLoadState('networkidle');
  await aiOnboarding.completeOnboarding();
  await aiLogin.aiLogin(SPEAKER_EMAIL, SPEAKER_PASSWORD);
  
  // Wait for navigation to complete
  await stagehand.page.waitForLoadState('networkidle');
}

/**
 * Login as Exhibitor user using Stagehand AI (includes onboarding completion)
 * @param stagehand - Stagehand instance
 */
export async function loginAsExhibitor(stagehand: Stagehand): Promise<void> {
  const aiOnboarding = new AIOnboardingPage(stagehand);
  const aiLogin = new AILoginPage(stagehand);

  await aiOnboarding.goto();
  await stagehand.page.waitForLoadState('networkidle');
  await aiOnboarding.completeOnboarding();
  await aiLogin.aiLogin(EXHIBITOR_EMAIL, EXHIBITOR_PASSWORD);
  
  // Wait for navigation to complete
  await stagehand.page.waitForLoadState('networkidle');
}


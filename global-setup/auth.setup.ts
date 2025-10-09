// global-setup/auth.setup.ts
import { Stagehand } from '@browserbasehq/stagehand';
import { loginAsAdmin, loginAsAttendee, loginAsSpeaker, loginAsExhibitor } from '../helpers/auth/login';

/**
 * Save authentication state for reuse
 * @param stagehand - Stagehand instance
 * @param filename - Storage state filename
 */
async function saveAuthState(stagehand: Stagehand, filename: string): Promise<void> {
  await stagehand.page.context().storageState({ path: filename });
}

const ADMIN_STORAGE_STATE = 'storage-state/admin.json';
const SPEAKER_STORAGE_STATE = 'storage-state/speaker.json';
const ATTENDEE_STORAGE_STATE = 'storage-state/attendee.json';
const EXHIBITOR_STORAGE_STATE = 'storage-state/exhibitor.json';

async function globalSetup() {
  console.log('Starting Stagehand authentication setup...');

  // Setup Admin auth
  const adminStagehand = new Stagehand({
    env: 'LOCAL',
    verbose: 1
  });
  await adminStagehand.init();
  await loginAsAdmin(adminStagehand);
  await saveAuthState(adminStagehand, ADMIN_STORAGE_STATE);
  await adminStagehand.close();
  console.log('Admin authentication state saved');

  // Setup Speaker auth
  const speakerStagehand = new Stagehand({
    env: 'LOCAL',
    verbose: 1
  });
  await speakerStagehand.init();
  await loginAsSpeaker(speakerStagehand);
  await saveAuthState(speakerStagehand, SPEAKER_STORAGE_STATE);
  await speakerStagehand.close();
  console.log('Speaker authentication state saved');

  // Setup Attendee auth
  const attendeeStagehand = new Stagehand({
    env: 'LOCAL',
    verbose: 1
  });
  await attendeeStagehand.init();
  await loginAsAttendee(attendeeStagehand);
  await saveAuthState(attendeeStagehand, ATTENDEE_STORAGE_STATE);
  await attendeeStagehand.close();
  console.log('Attendee authentication state saved');

  // Setup Exhibitor auth
  const exhibitorStagehand = new Stagehand({
    env: 'LOCAL',
    verbose: 1
  });
  await exhibitorStagehand.init();
  await loginAsExhibitor(exhibitorStagehand);
  await saveAuthState(exhibitorStagehand, EXHIBITOR_STORAGE_STATE);
  await exhibitorStagehand.close();
  console.log('Exhibitor authentication state saved');

  console.log('All authentication states saved successfully!');
}

export default globalSetup;  
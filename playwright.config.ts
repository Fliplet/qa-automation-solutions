import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Storage state file paths
const ADMIN_STORAGE_STATE = 'storage-state/admin.json';
const ATTENDEE_STORAGE_STATE = 'storage-state/attendee.json';
const SPEAKER_STORAGE_STATE = 'storage-state/speaker.json';
const EXHIBITOR_STORAGE_STATE = 'storage-state/exhibitor.json';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  //globalSetup: path.resolve(__dirname, './global-setup/auth.setup.ts'),
  use: {
    actionTimeout: 0,
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    // Setup project (runs global setup)
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // ========== JOURNEY TESTS (E2E) ==========
    {
      name: 'Journey: Auth',
      dependencies: ['setup'],
      testDir: './tests/journeys/auth-journeys',
      testMatch: 'tests/journeys/auth-journeys/**/*.journey.spec.ts',
      use: { 
        storageState: ATTENDEE_STORAGE_STATE,
        trace: 'on' // Always trace journeys
      },
    },
    {
      name: 'Journey: Attendee',
      dependencies: ['setup'],
      testDir: './tests/journeys/attendee-journeys',
      testMatch: 'tests/journeys/attendee-journeys/**/*.journey.spec.ts',
      use: { 
        storageState: ATTENDEE_STORAGE_STATE,
        trace: 'on'
      },
    },
    {
      name: 'Journey: Admin',
      dependencies: ['setup'],
      testDir: './tests/journeys/admin-journeys',
      testMatch: 'tests/journeys/admin-journeys/**/*.journey.spec.ts',
      use: { 
        storageState: ADMIN_STORAGE_STATE,
        trace: 'on'
      },
    },
    {
      name: 'Journey: Integration',
      dependencies: ['setup'],
      testDir: './tests/journeys/integration-journeys',
      testMatch: 'tests/journeys/integration-journeys/**/*.journey.spec.ts',
      use: { 
        storageState: ADMIN_STORAGE_STATE, // Admin can do more
        trace: 'on'
      },
    },

    // ========== UNIT TESTS (No Auth) ==========
    {
      name: 'Unit: Onboarding',
      testDir: './tests',
      testMatch: 'tests/Onboarding-Login.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // No storage state - tests onboarding/login flow
      },
    },

    // ========== AI AGENT TESTS ==========
    {
      name: 'AI Agent: Computer Use',
      testDir: './tests/ai-agent',
      testMatch: 'tests/ai-agent/**/*.spec.ts',
      timeout: 120000, // Longer timeout for AI operations
      use: { 
        ...devices['Desktop Chrome'],
        // No storage state - AI agent handles its own browser
      },
    },


    // ========== BROWSER MATRIX (Optional) ==========
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

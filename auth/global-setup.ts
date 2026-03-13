import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

/**
 * Global setup — handles login & session persistence
 * Runs once before all tests to create authenticated browser state
 */
async function globalSetup(config: FullConfig) {
    const storagePath = path.resolve(__dirname, '../playwright/.auth/user.json');
    // TODO: Implement login flow or token injection
}

export default globalSetup;

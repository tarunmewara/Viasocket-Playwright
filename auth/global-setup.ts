import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: path.resolve(__dirname, '../.env') });

const STORAGE_PATH = path.resolve(__dirname, '../playwright/.auth/user.json');

/**
 * Global setup — handles login & session persistence
 * Runs once before all tests to create authenticated browser state
 *
 * Auth mechanism (from socket-flow-UI):
 *   getFromCookies(getCurrentEnvironment()) reads a cookie named after
 *   VITE_API_ENVIRONMENT (e.g. "testing") from .viasocket.com domain.
 *   If that cookie holds a valid proxy-auth token the user is logged in.
 *
 * Flow:
 *   1. If user.json exists → validate it (navigate & check for login page)
 *   2. If valid → done (preserves all original cookies)
 *   3. If expired → try injecting AUTH_TOKEN from .env as a fresh cookie
 *   4. If AUTH_TOKEN also fails or not set → error with instructions
 *
 * Required .env variables (only needed when user.json expires):
 *   AUTH_TOKEN          – value of the environment cookie (copy from browser DevTools → Cookies)
 *   AUTH_COOKIE_NAME    – cookie name, defaults to "testing"
 */
async function globalSetup(config: FullConfig) {
    const baseURL = config.projects[0]?.use?.baseURL || 'https://dev-flow.viasocket.com/';

    // Step 1: If user.json exists, validate it first
    if (fs.existsSync(STORAGE_PATH)) {
        const isValid = await validateStorageState(baseURL);
        if (isValid) {
            console.log('[global-setup] Existing storageState is valid.');
            return;
        }
        console.log('[global-setup] Existing storageState expired. Attempting token injection...');
    }

    // Step 2: Try injecting AUTH_TOKEN from .env
    const authToken = process.env.AUTH_TOKEN;
    if (!authToken) {
        throw new Error(
            '[global-setup] Auth expired and no AUTH_TOKEN in .env.\n' +
            'To fix, run:\n' +
            '  npx playwright codegen --save-storage=playwright/.auth/user.json ' + baseURL + '\n' +
            'Or copy the "testing" cookie from DevTools and add AUTH_TOKEN=<value> to .env'
        );
    }

    const cookieName = process.env.AUTH_COOKIE_NAME || 'testing';
    const domain = '.viasocket.com';
    const twoDays = Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60;

    // Load existing storageState so we preserve all other cookies (Cloudflare, analytics, etc.)
    const browser = await chromium.launch();
    const contextOptions: { storageState?: string } = {};
    if (fs.existsSync(STORAGE_PATH)) {
        contextOptions.storageState = STORAGE_PATH;
    }
    const context = await browser.newContext(contextOptions);

    // Overwrite just the auth cookies with fresh values
    await context.addCookies([
        {
            name: cookieName,
            value: authToken,
            domain,
            path: '/',
            expires: twoDays,
            httpOnly: false,
            secure: true,
            sameSite: 'Lax' as const,
        },
        {
            name: 'token_type',
            value: 'Token',
            domain,
            path: '/',
            expires: twoDays,
            httpOnly: false,
            secure: true,
            sameSite: 'Lax' as const,
        },
    ]);

    // Verify the injected token works
    const page = await context.newPage();
    await page.goto(`${baseURL}org`);

    const authHeading = page.getByRole('heading', { name: 'Select a Workspace' });
    const loginHeading = page.getByRole('heading', { name: 'Log in' });
    const result = await Promise.race([
        authHeading.waitFor({ timeout: 15000 }).then(() => 'auth' as const),
        loginHeading.waitFor({ timeout: 15000 }).then(() => 'login' as const),
    ]).catch(() => 'timeout' as const);

    if (result !== 'auth') {
        await browser.close();
        throw new Error(
            '[global-setup] AUTH_TOKEN is expired or invalid.\n' +
            'To fix, run:\n' +
            '  npx playwright codegen --save-storage=playwright/.auth/user.json ' + baseURL + '\n' +
            'Then update AUTH_TOKEN in .env with the fresh "testing" cookie value.'
        );
    }

    await context.storageState({ path: STORAGE_PATH });
    await browser.close();
    console.log('[global-setup] Auth refreshed via token injection and storageState saved.');
}

/**
 * Validate existing storageState by loading it and racing two signals:
 *   "Select a Workspace" heading → authenticated
 *   "Log in" heading             → session expired
 */
async function validateStorageState(baseURL: string): Promise<boolean> {
    const browser = await chromium.launch();
    try {
        const context = await browser.newContext({ storageState: STORAGE_PATH });
        const page = await context.newPage();
        await page.goto(`${baseURL}org`);

        const authenticated = page.getByRole('heading', { name: 'Select a Workspace' });
        const loginPage = page.getByRole('heading', { name: 'Log in' });

        // Wait for whichever heading appears first (up to 15s)
        const result = await Promise.race([
            authenticated.waitFor({ timeout: 15000 }).then(() => 'auth' as const),
            loginPage.waitFor({ timeout: 15000 }).then(() => 'login' as const),
        ]).catch(() => 'timeout' as const);

        return result === 'auth';
    } catch {
        return false;
    } finally {
        await browser.close();
    }
}

export default globalSetup;

import { Page, Locator } from '@playwright/test';

/**
 * Login Page
 * Handles: login page links
 * Reference: login.tsx
 */
export class LoginPage {
    readonly page: Page;

    readonly privacyLink: Locator;
    readonly termsLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.privacyLink = page.getByTestId('login-privacy-link');
        this.termsLink = page.getByTestId('login-terms-link');
    }

    async clickPrivacy(): Promise<void> {
        await this.privacyLink.click();
    }

    async clickTerms(): Promise<void> {
        await this.termsLink.click();
    }
}

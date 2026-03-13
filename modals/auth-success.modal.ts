import { Page, Locator } from '@playwright/test';

/**
 * Auth Success Modal
 * Handles: auth success popup (close, done, edit title)
 */
export class AuthSuccessModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // auth-success-close-button, auth-success-done-button
    // auth-success-edit-title-input
}

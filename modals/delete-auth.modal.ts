import { Page, Locator } from '@playwright/test';

/**
 * Delete Auth Modal
 * Handles: delete auth/connection confirmation and cancel
 */
export class DeleteAuthModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // delete-auth-confirm-button, delete-auth-cancel-button
}

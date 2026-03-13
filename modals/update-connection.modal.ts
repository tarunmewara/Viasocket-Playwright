import { Page, Locator } from '@playwright/test';

/**
 * Update Connection Modal
 * Handles: update connection dialog (reason input, send request, close)
 */
export class UpdateConnectionModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // connection-update-dialog-close-button, connection-update-reason-input
    // connection-update-send-request-button
}

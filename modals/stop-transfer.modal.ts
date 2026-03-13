import { Page, Locator } from '@playwright/test';

/**
 * Stop Transfer Modal
 * Handles: stop transfer confirmation and cancel buttons
 */
export class StopTransferModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // transfer-stop-confirm-button, transfer-stop-cancel-button
}

import { Page, Locator } from '@playwright/test';

/**
 * Delete Flow Modal
 * Handles: delete confirmation and cancel buttons
 */
export class DeleteFlowModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // flow-delete-confirm-button, flow-delete-cancel-button
}

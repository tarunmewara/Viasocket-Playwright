import { Page, Locator } from '@playwright/test';

/**
 * Publish Confirm Modal
 * Handles: publish confirmation and cancel buttons
 */
export class PublishConfirmModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // publish-confirm-button, publish-cancel-button
}

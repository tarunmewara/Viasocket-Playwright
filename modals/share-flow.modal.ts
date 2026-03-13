import { Page, Locator } from '@playwright/test';

/**
 * Share Flow Modal
 * Handles: share dialog close, copy link, create template, copy template link
 */
export class ShareFlowModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // share-dialog-close-button, share-copy-link-button
    // share-create-template-button, share-copy-template-link-button
}

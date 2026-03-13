import { Page, Locator } from '@playwright/test';

/**
 * Flow Options Page
 * Handles: flow more options menu (delete, duplicate, move, share, etc.)
 */
export class FlowOptionsPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // flow-more-options-button, flow-menu-item
}

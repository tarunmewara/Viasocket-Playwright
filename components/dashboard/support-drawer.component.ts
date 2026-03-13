import { Page, Locator } from '@playwright/test';

/**
 * Support Drawer Component
 * Handles: support drawer close, contact items, live chat
 */
export class SupportDrawerComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // support-drawer-close-button, support-contact-item, support-live-chat-item
}

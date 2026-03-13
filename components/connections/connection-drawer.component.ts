import { Page, Locator } from '@playwright/test';

/**
 * Connection Drawer Component
 * Handles: connection detail drawer (description, remove, copy auth id, show more)
 */
export class ConnectionDrawerComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // connection-drawer-close-button, connection-description-input
    // connection-remove-button, connection-copy-auth-id-button
    // connection-show-more-button, connection-project-expand-toggle
    // connection-flow-link
}

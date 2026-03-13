import { Page, Locator } from '@playwright/test';

/**
 * Service Drawer Component
 * Handles: service-level connection drawer (close, add connection)
 */
export class ServiceDrawerComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // auth-service-drawer-close-button, auth-service-add-connection-button
}

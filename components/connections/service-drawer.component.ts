import { Page, Locator } from '@playwright/test';

/**
 * Service Drawer Component
 * Handles: service-level connection drawer — lists all connections for a specific
 * service/app, allows adding a new connection
 * Reference: authenticationServiceDrawer.tsx
 */
export class ServiceDrawerComponent {
    readonly page: Page;

    // Header
    readonly heading: Locator;
    readonly closeButton: Locator;

    // Add connection
    readonly addConnectionButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from authenticationServiceDrawer.tsx
        this.closeButton = page.getByTestId('auth-service-drawer-close-button');
        this.addConnectionButton = page.getByTestId('auth-service-add-connection-button');

        // Role-based
        this.heading = page.getByRole('heading', { name: 'Connections' });
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async addNewConnection(): Promise<void> {
        await this.addConnectionButton.click();
    }

    async isVisible(): Promise<boolean> {
        return this.closeButton.isVisible();
    }
}

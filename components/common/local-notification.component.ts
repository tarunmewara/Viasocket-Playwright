import { Page, Locator } from '@playwright/test';

/**
 * Local Notification Component
 * Handles: in-app notification banners with action/close
 * Reference: LocalNotification component
 */
export class LocalNotificationComponent {
    readonly page: Page;

    readonly actionButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.actionButton = page.getByTestId('local-notification-action-button');
        this.closeButton = page.getByTestId('local-notification-close-button');
    }

    async clickAction(): Promise<void> {
        await this.actionButton.click();
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }
}

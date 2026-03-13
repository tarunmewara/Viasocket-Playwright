import { Page, Locator } from '@playwright/test';

/**
 * Support Drawer Component
 * Handles: support drawer — close, contact items, live chat
 * Reference: NewDashboardNavbar.tsx
 */
export class SupportDrawerComponent {
    readonly page: Page;

    readonly closeButton: Locator;
    readonly contactItem: Locator;
    readonly liveChatItem: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from NewDashboardNavbar.tsx
        this.closeButton = page.getByTestId('support-drawer-close-button');
        this.contactItem = page.getByTestId('support-contact-item');
        this.liveChatItem = page.getByTestId('support-live-chat-item');
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async clickContactItem(index: number): Promise<void> {
        await this.contactItem.nth(index).click();
    }

    async clickContactByText(text: string): Promise<void> {
        await this.contactItem.filter({ hasText: text }).click();
    }

    async openLiveChat(): Promise<void> {
        await this.liveChatItem.click();
    }

    async getContactItemCount(): Promise<number> {
        return this.contactItem.count();
    }

    async isVisible(): Promise<boolean> {
        return this.closeButton.isVisible();
    }
}

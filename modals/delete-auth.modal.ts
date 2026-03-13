import { Page, Locator } from '@playwright/test';

/**
 * Delete Auth Modal
 * Handles: delete auth/connection confirmation dialog
 * Reference: deleteAuthPopupModal.tsx
 */
export class DeleteAuthModal {
    readonly page: Page;

    // Actions
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from deleteAuthPopupModal.tsx
        this.confirmButton = page.getByTestId('delete-auth-confirm-button');
        this.cancelButton = page.getByTestId('delete-auth-cancel-button');
    }

    async confirm(): Promise<void> {
        await this.confirmButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async isVisible(): Promise<boolean> {
        return this.confirmButton.isVisible();
    }
}

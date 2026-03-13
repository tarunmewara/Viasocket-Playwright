import { Page, Locator } from '@playwright/test';

/**
 * Stop Transfer Modal
 * Handles: stop transfer confirmation dialog
 * Reference: transferOptionPage.tsx
 */
export class StopTransferModal {
    readonly page: Page;

    readonly confirmButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from transferOptionPage.tsx
        this.confirmButton = page.getByTestId('transfer-stop-confirm-button');
        this.cancelButton = page.getByTestId('transfer-stop-cancel-button');
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

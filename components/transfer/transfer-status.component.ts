import { Page, Locator } from '@playwright/test';

/**
 * Transfer Status Component
 * Handles: transfer status view — back, refresh, stop, transfer again
 * Reference: transferOptionPage.tsx
 */
export class TransferStatusComponent {
    readonly page: Page;

    readonly backButton: Locator;
    readonly refreshButton: Locator;
    readonly stopButton: Locator;
    readonly transferAgainButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from transferOptionPage.tsx
        this.backButton = page.getByTestId('transfer-status-back-button');
        this.refreshButton = page.getByTestId('transfer-status-refresh-button');
        this.stopButton = page.getByTestId('transfer-stop-button');
        this.transferAgainButton = page.getByTestId('transfer-again-button');
    }

    async goBack(): Promise<void> {
        await this.backButton.click();
    }

    async refresh(): Promise<void> {
        await this.refreshButton.click();
    }

    async stopTransfer(): Promise<void> {
        await this.stopButton.click();
    }

    async transferAgain(): Promise<void> {
        await this.transferAgainButton.click();
    }

    async isStopDisabled(): Promise<boolean> {
        return this.stopButton.isDisabled();
    }

    async isVisible(): Promise<boolean> {
        return this.backButton.isVisible();
    }
}

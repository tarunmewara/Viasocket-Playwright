import { Page, Locator } from '@playwright/test';

/**
 * Delete Flow Modal
 * Handles: delete/trash flow confirmation dialog
 * Reference: flowPageMoreOptions.tsx
 */
export class DeleteFlowModal {
    readonly page: Page;

    readonly confirmButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from flowPageMoreOptions.tsx
        this.confirmButton = page.getByTestId('flow-delete-confirm-button');
        this.cancelButton = page.getByTestId('flow-delete-cancel-button');
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

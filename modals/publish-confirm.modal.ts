import { Page, Locator } from '@playwright/test';

/**
 * Publish Confirm Modal
 * Handles: publish/revert confirmation dialog — shared by go-live and revert flows
 * Reference: PublishConfirmationModal.tsx
 */
export class PublishConfirmModal {
    readonly page: Page;

    readonly confirmButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from PublishConfirmationModal.tsx
        this.confirmButton = page.getByTestId('publish-confirm-button');
        this.cancelButton = page.getByTestId('publish-cancel-button');
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

    async isConfirmDisabled(): Promise<boolean> {
        return this.confirmButton.isDisabled();
    }
}

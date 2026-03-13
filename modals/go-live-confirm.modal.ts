import { Page, Locator } from '@playwright/test';

/**
 * Go Live / Revert Confirm Modal
 * Handles: publish and revert confirmation dialog (Yes / Cancel)
 * Reference: PublishConfirmationModal.tsx
 */
export class GoLiveConfirmModal {
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

import { Page, Locator } from '@playwright/test';

/**
 * Billing Modal
 * Handles: billing submit/cancel/done dialogs
 * Reference: billing components
 */
export class BillingModal {
    readonly page: Page;

    readonly cancelButton: Locator;
    readonly doneButton: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.cancelButton = page.getByTestId('billing-cancel-button');
        this.doneButton = page.getByTestId('billing-done-button');
        this.submitButton = page.getByTestId('billing-submit-button');
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async done(): Promise<void> {
        await this.doneButton.click();
    }
}

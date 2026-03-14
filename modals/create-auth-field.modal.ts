import { Page, Locator } from '@playwright/test';

/**
 * Create Auth Field Modal (Developer Hub)
 * Handles: creating new auth fields with required/URL checkboxes
 * Reference: createBasicAuthField.tsx
 */
export class CreateAuthFieldModal {
    readonly page: Page;

    readonly cancelButton: Locator;
    readonly submitButton: Locator;
    readonly isUrlCheckbox: Locator;
    readonly requiredCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;

        this.cancelButton = page.getByTestId('create-auth-field-cancel-button');
        this.submitButton = page.getByTestId('create-auth-field-submit-button');
        this.isUrlCheckbox = page.getByTestId('create-auth-field-is-url-checkbox');
        this.requiredCheckbox = page.getByTestId('create-auth-field-required-checkbox');
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async toggleIsUrl(): Promise<void> {
        await this.isUrlCheckbox.click();
    }

    async toggleRequired(): Promise<void> {
        await this.requiredCheckbox.click();
    }
}

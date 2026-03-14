import { Page, Locator } from '@playwright/test';

/**
 * Add Field Modal (Developer Hub)
 * Handles: adding auth fields with key/value/type, key switch confirm
 * Reference: AddFieldModal.tsx
 */
export class AddFieldModal {
    readonly page: Page;

    readonly keyInput: Locator;
    readonly valueInput: Locator;
    readonly typeRadioGroup: Locator;
    readonly cancelButton: Locator;
    readonly submitButton: Locator;
    readonly keySwitchCancelButton: Locator;
    readonly keySwitchConfirmButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.keyInput = page.getByTestId('add-field-key-input');
        this.valueInput = page.getByTestId('add-field-value-input');
        this.typeRadioGroup = page.getByTestId('add-field-type-radio-group');
        this.cancelButton = page.getByTestId('add-field-cancel-button');
        this.submitButton = page.getByTestId('add-field-submit-button');
        this.keySwitchCancelButton = page.getByTestId('add-key-switch-cancel-button');
        this.keySwitchConfirmButton = page.getByTestId('add-key-switch-confirm-button');
    }

    async fillKey(key: string): Promise<void> {
        await this.keyInput.fill(key);
    }

    async fillValue(value: string): Promise<void> {
        await this.valueInput.fill(value);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async confirmKeySwitch(): Promise<void> {
        await this.keySwitchConfirmButton.click();
    }

    async cancelKeySwitch(): Promise<void> {
        await this.keySwitchCancelButton.click();
    }
}

import { Page, Locator } from '@playwright/test';

/**
 * Rename Collection Modal
 * Handles: rename collection dialog — input, submit, cancel
 * Reference: CollectionList.tsx
 */
export class RenameCollectionModal {
    readonly page: Page;

    readonly nameInput: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from CollectionList.tsx
        this.nameInput = page.getByTestId('collection-rename-input');
        this.submitButton = page.getByTestId('collection-rename-submit-button');
        this.cancelButton = page.getByTestId('collection-rename-cancel-button');
    }

    async fillName(name: string): Promise<void> {
        await this.nameInput.locator('input').fill(name);
    }

    async clearName(): Promise<void> {
        await this.nameInput.locator('input').fill('');
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async renameCollection(newName: string): Promise<void> {
        await this.fillName(newName);
        await this.submit();
    }

    async isVisible(): Promise<boolean> {
        return this.nameInput.isVisible();
    }
}

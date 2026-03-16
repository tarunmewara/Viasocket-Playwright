import { Page, Locator } from '@playwright/test';

/**
 * Create Collection Modal
 * Handles: collection name input, quick suggestion chips, create/submit, cancel
 * Reference: createInputModalV2.tsx (with isCreateCollectionModal=true)
 */
export class CreateCollectionModal {
    readonly page: Page;

    // Title
    readonly dialogTitle: Locator;

    // Form fields
    readonly nameInput: Locator;

    // Suggestion chips
    readonly suggestionsContainer: Locator;
    readonly suggestionChips: Locator;

    // Actions
    readonly createButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Role/text based locators from createInputModalV2.tsx
        this.dialogTitle = page.locator('#responsive-dialog-title').filter({ hasText: 'New Collection' });
        this.nameInput = page.getByLabel('Name of Collection');
        this.suggestionsContainer = page.getByText('Quick Suggestions');
        this.suggestionChips = page.getByRole('button').filter({ has: page.locator('.MuiChip-root') });
        this.createButton = page.getByRole('button', { name: 'Create Collection' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async fillName(name: string): Promise<void> {
        await this.nameInput.fill(name);
    }

    async clearName(): Promise<void> {
        await this.nameInput.fill('');
    }

    async clickSuggestion(chipText: string): Promise<void> {
        await this.page.getByRole('dialog').locator('.MuiChip-root').filter({ hasText: chipText }).click();
    }

    async clickNthSuggestion(index: number): Promise<void> {
        await this.page.getByRole('dialog').locator('.MuiChip-root').nth(index).click();
    }

    async create(): Promise<void> {
        await this.createButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async createWithName(name: string): Promise<void> {
        await this.fillName(name);
        await this.create();
    }

    async isVisible(): Promise<boolean> {
        return this.dialogTitle.isVisible();
    }

    async isCreateDisabled(): Promise<boolean> {
        return this.createButton.isDisabled();
    }
}

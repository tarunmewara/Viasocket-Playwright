import { Page, Locator } from '@playwright/test';

/**
 * Storage Modal
 * Handles: storage collection creation
 * Reference: StorageModal component
 */
export class StorageModal {
    readonly page: Page;

    readonly collectionNameInput: Locator;
    readonly learnMoreLink: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.collectionNameInput = page.getByTestId('storage-collection-name-input');
        this.learnMoreLink = page.getByTestId('storage-learn-more-link');
        this.submitButton = page.getByTestId('storage-submit-button');
    }

    async fillCollectionName(name: string): Promise<void> {
        await this.collectionNameInput.fill(name);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async clickLearnMore(): Promise<void> {
        await this.learnMoreLink.click();
    }
}

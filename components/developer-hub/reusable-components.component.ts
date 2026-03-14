import { Page, Locator } from '@playwright/test';

/**
 * Reusable Components (Developer Hub)
 * Handles: add, edit, delete, import reusable components
 * Reference: reusableComponentsButton.tsx, addComponentSlider.tsx, ReusableComponentsPage.tsx
 */
export class ReusableComponentsComponent {
    readonly page: Page;

    readonly addButton: Locator;
    readonly addNewButton: Locator;
    readonly deleteButton: Locator;
    readonly editButton: Locator;
    readonly dropdownEditButton: Locator;
    readonly importButton: Locator;
    readonly importSelect: Locator;
    readonly infoButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addButton = page.getByTestId('reusable-component-add-button');
        this.addNewButton = page.getByTestId('reusable-component-add-new-button');
        this.deleteButton = page.getByTestId('reusable-component-delete-button');
        this.editButton = page.getByTestId('reusable-component-edit-button');
        this.dropdownEditButton = page.getByTestId('reusable-component-dropdown-edit-button');
        this.importButton = page.getByTestId('reusable-component-import-button');
        this.importSelect = page.getByTestId('reusable-component-import-select');
        this.infoButton = page.getByTestId('reusable-component-info-button');
    }

    async clickAdd(): Promise<void> {
        await this.addButton.click();
    }

    async clickAddNew(): Promise<void> {
        await this.addNewButton.click();
    }

    async clickDelete(): Promise<void> {
        await this.deleteButton.click();
    }

    async clickEdit(): Promise<void> {
        await this.editButton.click();
    }

    async clickImport(): Promise<void> {
        await this.importButton.click();
    }
}

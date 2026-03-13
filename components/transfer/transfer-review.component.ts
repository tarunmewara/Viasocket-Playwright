import { Page, Locator } from '@playwright/test';

/**
 * Transfer Review Component
 * Handles: transfer data review — back, all/selected data, refresh, pagination, cell expand
 * Reference: transferOptionPage.tsx
 */
export class TransferReviewComponent {
    readonly page: Page;

    // Navigation
    readonly backButton: Locator;

    // Data transfer actions
    readonly allDataButton: Locator;
    readonly selectedDataButton: Locator;
    readonly refreshButton: Locator;

    // Pagination
    readonly prevPageButton: Locator;
    readonly nextPageButton: Locator;

    // Cell expand
    readonly cellExpandChip: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from transferOptionPage.tsx
        this.backButton = page.getByTestId('transfer-back-button');
        this.allDataButton = page.getByTestId('transfer-all-data-button');
        this.selectedDataButton = page.getByTestId('transfer-selected-data-button');
        this.refreshButton = page.getByTestId('transfer-data-refresh-button');
        this.prevPageButton = page.getByTestId('transfer-prev-page-button');
        this.nextPageButton = page.getByTestId('transfer-next-page-button');
        this.cellExpandChip = page.getByTestId('transfer-cell-expand-chip');
    }

    async goBack(): Promise<void> {
        await this.backButton.click();
    }

    async transferAllData(): Promise<void> {
        await this.allDataButton.click();
    }

    async transferSelectedData(): Promise<void> {
        await this.selectedDataButton.click();
    }

    async refresh(): Promise<void> {
        await this.refreshButton.click();
    }

    async prevPage(): Promise<void> {
        await this.prevPageButton.click();
    }

    async nextPage(): Promise<void> {
        await this.nextPageButton.click();
    }

    async expandCell(index: number): Promise<void> {
        await this.cellExpandChip.nth(index).click();
    }

    async isPrevDisabled(): Promise<boolean> {
        return this.prevPageButton.isDisabled();
    }

    async isNextDisabled(): Promise<boolean> {
        return this.nextPageButton.isDisabled();
    }

    async isVisible(): Promise<boolean> {
        return this.allDataButton.isVisible();
    }
}

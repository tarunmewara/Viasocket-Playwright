import { Page, Locator } from '@playwright/test';

/**
 * Logs Filter Component
 * Handles: advanced filter modal — filter history, cancel, rerun buttons
 * Reference: AdvanceFilterModal.tsx
 */
export class LogsFilterComponent {
    readonly page: Page;

    // Filtered runs rerun buttons
    readonly rerunFilteredSuccessButton: Locator;
    readonly rerunFilteredFailedButton: Locator;

    // Total runs rerun buttons
    readonly rerunTotalSuccessButton: Locator;
    readonly rerunTotalFailedButton: Locator;

    // Actions
    readonly filterHistoryButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from AdvanceFilterModal.tsx
        this.rerunFilteredSuccessButton = page.getByTestId('logs-rerun-filtered-success-button');
        this.rerunFilteredFailedButton = page.getByTestId('logs-rerun-filtered-failed-button');
        this.rerunTotalSuccessButton = page.getByTestId('logs-rerun-total-success-button');
        this.rerunTotalFailedButton = page.getByTestId('logs-rerun-total-failed-button');
        this.filterHistoryButton = page.getByTestId('logs-filter-history-button');
        this.cancelButton = page.getByTestId('logs-filter-cancel-button');
    }

    async clickFilterHistory(): Promise<void> {
        await this.filterHistoryButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async rerunFilteredSuccess(): Promise<void> {
        await this.rerunFilteredSuccessButton.click();
    }

    async rerunFilteredFailed(): Promise<void> {
        await this.rerunFilteredFailedButton.click();
    }

    async rerunTotalSuccess(): Promise<void> {
        await this.rerunTotalSuccessButton.click();
    }

    async rerunTotalFailed(): Promise<void> {
        await this.rerunTotalFailedButton.click();
    }

    async isFilterHistoryVisible(): Promise<boolean> {
        return this.filterHistoryButton.isVisible();
    }
}

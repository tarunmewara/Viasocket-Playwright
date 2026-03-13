import { Page, Locator } from '@playwright/test';

/**
 * Transfer Review Component
 * Handles: data review before transfer (all data, selected data, pagination, refresh)
 */
export class TransferReviewComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // transfer-back-button, transfer-all-data-button
    // transfer-selected-data-button, transfer-data-refresh-button
    // transfer-prev-page-button, transfer-next-page-button
    // transfer-cell-expand-chip
}

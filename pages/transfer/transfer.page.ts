import { Page, Locator } from '@playwright/test';

/**
 * Transfer Page
 * Handles: data transfer page-level orchestration
 * Composes: TransferReviewComponent, TransferStatusComponent, StopTransferModal
 */
export class TransferPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods
    // transfer-option-start-button, transfer-option-cancel-button
}

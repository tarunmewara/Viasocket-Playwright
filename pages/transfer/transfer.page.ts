import { Page, Locator } from '@playwright/test';
import { TransferReviewComponent } from '../../components/transfer/transfer-review.component';
import { TransferStatusComponent } from '../../components/transfer/transfer-status.component';
import { StopTransferModal } from '../../modals/stop-transfer.modal';

/**
 * Transfer Page
 * Composes: TransferReviewComponent, TransferStatusComponent, StopTransferModal
 * Page-unique: ask modal, headings, data grid, no-data text, status text helpers
 */
export class TransferPage {
    readonly page: Page;

    // Composed components / modals
    readonly review: TransferReviewComponent;
    readonly status: TransferStatusComponent;
    readonly stopModal: StopTransferModal;

    // Page-unique locators (Transfer Ask Modal)
    readonly askModalTitle: Locator;
    readonly startTransferButton: Locator;
    readonly cancelTransferButton: Locator;

    // Page-unique locators (headings & misc)
    readonly reviewHeading: Locator;
    readonly statusHeading: Locator;
    readonly transferDataGrid: Locator;
    readonly noDataFoundText: Locator;

    constructor(page: Page) {
        this.page = page;

        // Compose from components/modals
        this.review = new TransferReviewComponent(page);
        this.status = new TransferStatusComponent(page);
        this.stopModal = new StopTransferModal(page);

        // Transfer Ask Modal — from transferOptionAskModal.tsx
        this.askModalTitle = page.getByRole('heading', { name: 'Do you want to transfer your old data?' });
        this.startTransferButton = page.getByTestId('transfer-option-start-button');
        this.cancelTransferButton = page.getByTestId('transfer-option-cancel-button');

        // Headings & misc
        this.reviewHeading = page.getByRole('heading', { name: 'Review your data before transfer' });
        this.statusHeading = page.getByRole('heading', { name: 'Last Transfer Status' });
        this.transferDataGrid = page.locator('.MuiDataGrid-root');
        this.noDataFoundText = page.getByText('No data found!');
    }

    // --- Transfer Ask Modal ---

    async clickStartTransfer(): Promise<void> {
        await this.startTransferButton.click();
    }

    async clickCancelTransfer(): Promise<void> {
        await this.cancelTransferButton.click();
    }

    // --- Data Review (delegated) ---

    async clickBack(): Promise<void> {
        await this.review.goBack();
    }

    async clickTransferAllData(): Promise<void> {
        await this.review.transferAllData();
    }

    async clickTransferSelectedData(): Promise<void> {
        await this.review.transferSelectedData();
    }

    async refreshData(): Promise<void> {
        await this.review.refresh();
    }

    async goToPrevPage(): Promise<void> {
        await this.review.prevPage();
    }

    async goToNextPage(): Promise<void> {
        await this.review.nextPage();
    }

    async expandCellData(index: number = 0): Promise<void> {
        await this.review.expandCell(index);
    }

    // --- Status (delegated) ---

    async clickStatusBack(): Promise<void> {
        await this.status.goBack();
    }

    async refreshStatus(): Promise<void> {
        await this.status.refresh();
    }

    async clickStopTransfer(): Promise<void> {
        await this.status.stopTransfer();
    }

    async clickTransferAgain(): Promise<void> {
        await this.status.transferAgain();
    }

    // --- Stop Transfer confirm (delegated) ---

    async confirmStopTransfer(): Promise<void> {
        await this.stopModal.confirm();
    }

    async cancelStopTransfer(): Promise<void> {
        await this.stopModal.cancel();
    }

    async stopAndConfirm(): Promise<void> {
        await this.clickStopTransfer();
        await this.stopModal.confirm();
    }

    // --- State checks ---

    async isAskModalVisible(): Promise<boolean> {
        return this.askModalTitle.isVisible();
    }

    async isReviewView(): Promise<boolean> {
        return this.reviewHeading.isVisible();
    }

    async isStatusView(): Promise<boolean> {
        return this.statusHeading.isVisible();
    }

    async hasNoData(): Promise<boolean> {
        return this.noDataFoundText.isVisible();
    }

    async getStatusText(): Promise<string | null> {
        const statusEl = this.page.getByText(/^Status:/);
        if (await statusEl.isVisible()) {
            return statusEl.textContent();
        }
        return null;
    }

    async getProcessedEntries(): Promise<string | null> {
        const entriesEl = this.page.getByText(/^Processed Entries:/);
        if (await entriesEl.isVisible()) {
            return entriesEl.textContent();
        }
        return null;
    }
}

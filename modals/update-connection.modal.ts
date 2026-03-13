import { Page, Locator } from '@playwright/test';

/**
 * Update Connection Modal
 * Handles: request connection update dialog — reason input, send request to owner
 * Reference: UpdateOrRequestConnectionUpdate.tsx
 */
export class UpdateConnectionModal {
    readonly page: Page;

    // Header
    readonly dialogTitle: Locator;
    readonly closeButton: Locator;

    // Form
    readonly reasonInput: Locator;

    // Actions
    readonly sendRequestButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from UpdateOrRequestConnectionUpdate.tsx
        this.closeButton = page.getByTestId('connection-update-dialog-close-button');
        this.reasonInput = page.getByTestId('connection-update-reason-input');
        this.sendRequestButton = page.getByTestId('connection-update-send-request-button');

        // Role-based
        this.dialogTitle = page.getByRole('heading', { name: 'Confirm Connection Update' });
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async fillReason(reason: string): Promise<void> {
        await this.reasonInput.locator('textarea').first().fill(reason);
    }

    async sendRequest(): Promise<void> {
        await this.sendRequestButton.click();
    }

    async submitUpdateRequest(reason: string): Promise<void> {
        await this.fillReason(reason);
        await this.sendRequest();
    }

    async isVisible(): Promise<boolean> {
        return this.dialogTitle.isVisible();
    }
}

import { Page, Locator } from '@playwright/test';

/**
 * Leave Workspace Modal
 * Handles: leave workspace confirmation dialog (Yes / No)
 * Reference: LeaveWorkspaceButton.tsx
 */
export class LeaveWorkspaceModal {
    readonly page: Page;

    // Dialog heading
    readonly dialogTitle: Locator;

    // Actions
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from LeaveWorkspaceButton.tsx
        this.confirmButton = page.getByTestId('leave-workspace-confirm-button');
        this.cancelButton = page.getByTestId('leave-workspace-cancel-button');

        // Role-based
        this.dialogTitle = page.getByRole('heading', { name: /leave this Workspace/i });
    }

    async confirm(): Promise<void> {
        await this.confirmButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async isVisible(): Promise<boolean> {
        return this.confirmButton.isVisible();
    }
}

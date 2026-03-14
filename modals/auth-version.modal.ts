import { Page, Locator } from '@playwright/test';

/**
 * Auth Version Modal (Developer Hub)
 * Handles: new auth type/version dialogs, version approve/reject
 * Reference: AuthVersionModal.tsx, ActionVersionModal.tsx
 */
export class AuthVersionModal {
    readonly page: Page;

    // New auth type
    readonly newAuthTypeAgreeButton: Locator;
    readonly newAuthTypeCancelButton: Locator;

    // New auth version
    readonly newAuthVersionAgreeButton: Locator;
    readonly newAuthVersionCancelButton: Locator;

    // Version approve/reject
    readonly versionApproveButton: Locator;
    readonly versionRejectButton: Locator;
    readonly rejectVersionCancelButton: Locator;
    readonly rejectVersionSubmitButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // New auth type — from AuthVersionModal.tsx
        this.newAuthTypeAgreeButton = page.getByTestId('new-auth-type-agree-button');
        this.newAuthTypeCancelButton = page.getByTestId('new-auth-type-cancel-button');

        // New auth version
        this.newAuthVersionAgreeButton = page.getByTestId('new-auth-version-agree-button');
        this.newAuthVersionCancelButton = page.getByTestId('new-auth-version-cancel-button');

        // Version approve/reject — from ActionVersionModal.tsx
        this.versionApproveButton = page.getByTestId('version-approve-button');
        this.versionRejectButton = page.getByTestId('version-reject-button');
        this.rejectVersionCancelButton = page.getByTestId('reject-version-cancel-button');
        this.rejectVersionSubmitButton = page.getByTestId('reject-version-submit-button');
    }

    async agreeNewAuthType(): Promise<void> {
        await this.newAuthTypeAgreeButton.click();
    }

    async cancelNewAuthType(): Promise<void> {
        await this.newAuthTypeCancelButton.click();
    }

    async agreeNewAuthVersion(): Promise<void> {
        await this.newAuthVersionAgreeButton.click();
    }

    async cancelNewAuthVersion(): Promise<void> {
        await this.newAuthVersionCancelButton.click();
    }

    async approveVersion(): Promise<void> {
        await this.versionApproveButton.click();
    }

    async rejectVersion(): Promise<void> {
        await this.versionRejectButton.click();
    }

    async submitRejection(): Promise<void> {
        await this.rejectVersionSubmitButton.click();
    }

    async cancelRejection(): Promise<void> {
        await this.rejectVersionCancelButton.click();
    }
}

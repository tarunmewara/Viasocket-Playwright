import { Page, Locator } from '@playwright/test';

/**
 * Auth Success Modal
 * Handles: auth success popup — close, done, edit title for connection
 * Reference: AuthenticationSuccessPopUp.tsx
 */
export class AuthSuccessModal {
    readonly page: Page;

    // Header
    readonly closeButton: Locator;

    // Edit title
    readonly editTitleInput: Locator;

    // Actions
    readonly doneButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from AuthenticationSuccessPopUp.tsx
        this.closeButton = page.getByTestId('auth-success-close-button');
        this.editTitleInput = page.getByTestId('auth-success-edit-title-input');
        this.doneButton = page.getByTestId('auth-success-done-button');
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async done(): Promise<void> {
        await this.doneButton.click();
    }

    async editTitle(title: string): Promise<void> {
        await this.editTitleInput.locator('input').fill(title);
    }

    async editTitleAndDone(title: string): Promise<void> {
        await this.editTitle(title);
        await this.done();
    }

    async isVisible(): Promise<boolean> {
        return this.doneButton.isVisible();
    }
}

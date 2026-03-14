import { Page, Locator } from '@playwright/test';

/**
 * Action Form Page (Developer Hub)
 * Handles: action CRUD, version management, scopes, errors drawer, AI generation
 * Reference: createActionInput.tsx, ActionTriggerPageHeader components
 */
export class ActionFormPage {
    readonly page: Page;

    // Action form
    readonly nameInput: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;
    readonly closeButton: Locator;
    readonly deleteButton: Locator;
    readonly generateAiButton: Locator;
    readonly sampleDataCheckbox: Locator;

    // Action header
    readonly headerEditButton: Locator;
    readonly headerRestoreButton: Locator;

    // Action overview
    readonly overviewDeleteVersionButton: Locator;

    // Action version
    readonly versionAgreeButton: Locator;
    readonly versionCancelButton: Locator;
    readonly versionDropdown: Locator;
    readonly warningDismissChip: Locator;

    // Action category & scopes
    readonly categoryAutocomplete: Locator;
    readonly scopesAutocomplete: Locator;

    // Action chat & errors
    readonly chatButton: Locator;
    readonly errorsDrawerCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Action form — from createActionInput.tsx
        this.nameInput = page.getByTestId('action-form-name-input');
        this.submitButton = page.getByTestId('action-form-submit-button');
        this.cancelButton = page.getByTestId('action-form-cancel-button');
        this.closeButton = page.getByTestId('action-form-close-button');
        this.deleteButton = page.getByTestId('action-form-delete-button');
        this.generateAiButton = page.getByTestId('action-form-generate-ai-button');
        this.sampleDataCheckbox = page.getByTestId('action-form-sample-data-checkbox');

        // Action header
        this.headerEditButton = page.getByTestId('action-header-edit-button');
        this.headerRestoreButton = page.getByTestId('action-header-restore-button');

        // Action overview
        this.overviewDeleteVersionButton = page.getByTestId('action-overview-delete-version-button');

        // Action version
        this.versionAgreeButton = page.getByTestId('action-version-agree-button');
        this.versionCancelButton = page.getByTestId('action-version-cancel-button');
        this.versionDropdown = page.getByTestId('action-version-dropdown');
        this.warningDismissChip = page.getByTestId('action-warning-dismiss-chip');

        // Action category & scopes
        this.categoryAutocomplete = page.getByTestId('action-category-autocomplete');
        this.scopesAutocomplete = page.getByTestId('action-scopes-autocomplete');

        // Action chat & errors
        this.chatButton = page.getByTestId('action-chat-button');
        this.errorsDrawerCloseButton = page.getByTestId('action-errors-drawer-close-button');
    }

    async fillName(name: string): Promise<void> {
        await this.nameInput.fill(name);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async delete(): Promise<void> {
        await this.deleteButton.click();
    }

    async generateWithAi(): Promise<void> {
        await this.generateAiButton.click();
    }

    async clickEdit(): Promise<void> {
        await this.headerEditButton.click();
    }

    async clickRestore(): Promise<void> {
        await this.headerRestoreButton.click();
    }

    async agreeVersion(): Promise<void> {
        await this.versionAgreeButton.click();
    }

    async cancelVersion(): Promise<void> {
        await this.versionCancelButton.click();
    }

    async dismissWarning(): Promise<void> {
        await this.warningDismissChip.click();
    }

    async closeErrorsDrawer(): Promise<void> {
        await this.errorsDrawerCloseButton.click();
    }
}

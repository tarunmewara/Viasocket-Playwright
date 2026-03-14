import { Page, Locator } from '@playwright/test';

/**
 * Misc Components
 * Handles: scattered UI elements — AI action configure, alert publish,
 * all triggers, assign expert, app selection, contributors, org run drawer,
 * pagination, unique key preview
 * Reference: various components
 */
export class MiscComponent {
    readonly page: Page;

    // AI action
    readonly aiActionConfigureContinueButton: Locator;

    // Alert publish
    readonly alertPublishCloseButton: Locator;

    // All triggers
    readonly allTriggersCreateButton: Locator;

    // Assign expert
    readonly assignExpertButton: Locator;
    readonly assignExpertCloseButton: Locator;
    readonly assignToExpertButton: Locator;

    // App selection
    readonly appSelectionUpdateButton: Locator;

    // Contributors
    readonly contributorsCloseButton: Locator;

    // Org run drawer
    readonly orgRunDrawerCloseButton: Locator;

    // Pagination
    readonly paginationCheckbox: Locator;

    // Unique key
    readonly uniqueKeyPreviewButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.aiActionConfigureContinueButton = page.getByTestId('ai-action-configure-continue-button');
        this.alertPublishCloseButton = page.getByTestId('alert-publish-close-button');
        this.allTriggersCreateButton = page.getByTestId('all-triggers-create-button');
        this.assignExpertButton = page.getByTestId('assign-expert-button');
        this.assignExpertCloseButton = page.getByTestId('assign-expert-close-button');
        this.assignToExpertButton = page.getByTestId('assign-to-expert-button');
        this.appSelectionUpdateButton = page.getByTestId('app-selection-update-button');
        this.contributorsCloseButton = page.getByTestId('contributors-close-button');
        this.orgRunDrawerCloseButton = page.getByTestId('org-run-drawer-close-button');
        this.paginationCheckbox = page.getByTestId('pagination-checkbox');
        this.uniqueKeyPreviewButton = page.getByTestId('unique-key-preview-button');
    }

    async clickAiActionContinue(): Promise<void> {
        await this.aiActionConfigureContinueButton.click();
    }

    async closeAlertPublish(): Promise<void> {
        await this.alertPublishCloseButton.click();
    }

    async createTrigger(): Promise<void> {
        await this.allTriggersCreateButton.click();
    }

    async assignExpert(): Promise<void> {
        await this.assignExpertButton.click();
    }

    async closeAssignExpert(): Promise<void> {
        await this.assignExpertCloseButton.click();
    }

    async closeContributors(): Promise<void> {
        await this.contributorsCloseButton.click();
    }

    async closeOrgRunDrawer(): Promise<void> {
        await this.orgRunDrawerCloseButton.click();
    }

    async previewUniqueKey(): Promise<void> {
        await this.uniqueKeyPreviewButton.click();
    }
}

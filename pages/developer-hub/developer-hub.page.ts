import { Page, Locator } from '@playwright/test';

/**
 * Developer Hub Page
 * Handles: developer hub actions — save, test, dry run, alerts, auth, code reset,
 * response/console tabs, input fields, support, create plug
 * Reference: various developerHub components
 */
export class DeveloperHubPage {
    readonly page: Page;

    // Alert dialog
    readonly alertCancelButton: Locator;
    readonly alertConfirmButton: Locator;

    // Auth
    readonly authAiButton: Locator;
    readonly authorizeButton: Locator;

    // Tabs
    readonly consoleTab: Locator;
    readonly responseTab: Locator;
    readonly responseConsoleTabs: Locator;
    readonly guiDashboardTabs: Locator;

    // Actions
    readonly createPlugButton: Locator;
    readonly saveButton: Locator;
    readonly saveInputFieldsButton: Locator;
    readonly resetCodeButton: Locator;
    readonly dryRunTestButton: Locator;
    readonly supportButton: Locator;

    // Custom action
    readonly customActionTabs: Locator;
    readonly customActionTabOverview: Locator;
    readonly customActionTabRequestParameter: Locator;
    readonly customActionSaveButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Alert dialog
        this.alertCancelButton = page.getByTestId('dh-alert-cancel-button');
        this.alertConfirmButton = page.getByTestId('dh-alert-confirm-button');

        // Auth
        this.authAiButton = page.getByTestId('dh-auth-ai-button');
        this.authorizeButton = page.getByTestId('dh-authorize-button');

        // Tabs
        this.consoleTab = page.getByTestId('dh-console-tab');
        this.responseTab = page.getByTestId('dh-response-tab');
        this.responseConsoleTabs = page.getByTestId('dh-response-console-tabs');
        this.guiDashboardTabs = page.getByTestId('gui-dashboard-tabs');

        // Actions
        this.createPlugButton = page.getByTestId('dh-create-plug-button');
        this.saveButton = page.getByTestId('dh-save-button');
        this.saveInputFieldsButton = page.getByTestId('dh-save-input-fields-button');
        this.resetCodeButton = page.getByTestId('dh-reset-code-button');
        this.dryRunTestButton = page.getByTestId('dh-dry-run-test-button');
        this.supportButton = page.getByTestId('dh-support-button');

        // Custom action tabs
        this.customActionTabs = page.getByTestId('custom-action-tabs');
        this.customActionTabOverview = page.getByTestId('custom-action-tab-overview');
        this.customActionTabRequestParameter = page.getByTestId('custom-action-tab-request-parameter');
        this.customActionSaveButton = page.getByTestId('custom-action-save-button');
    }

    async clickAlertCancel(): Promise<void> {
        await this.alertCancelButton.click();
    }

    async clickAlertConfirm(): Promise<void> {
        await this.alertConfirmButton.click();
    }

    async clickAuthorize(): Promise<void> {
        await this.authorizeButton.click();
    }

    async clickSave(): Promise<void> {
        await this.saveButton.click();
    }

    async clickSaveInputFields(): Promise<void> {
        await this.saveInputFieldsButton.click();
    }

    async clickResetCode(): Promise<void> {
        await this.resetCodeButton.click();
    }

    async clickDryRunTest(): Promise<void> {
        await this.dryRunTestButton.click();
    }

    async clickCreatePlug(): Promise<void> {
        await this.createPlugButton.click();
    }

    async selectConsoleTab(): Promise<void> {
        await this.consoleTab.click();
    }

    async selectResponseTab(): Promise<void> {
        await this.responseTab.click();
    }

    async selectCustomActionOverview(): Promise<void> {
        await this.customActionTabOverview.click();
    }

    async selectCustomActionRequestParameter(): Promise<void> {
        await this.customActionTabRequestParameter.click();
    }

    async clickCustomActionSave(): Promise<void> {
        await this.customActionSaveButton.click();
    }
}

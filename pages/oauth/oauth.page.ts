import { Page, Locator } from '@playwright/test';

/**
 * OAuth Page
 * Handles: OAuth listing page (search, DataGrid, Add OAuth Integration),
 * New Integration page (name, redirect URL, client secret modal),
 * Config page (name, redirect URI list with edit/delete/add, client ID, save)
 * Reference: oauth.tsx, oauthIntegration.tsx, oauthConfig.tsx
 */
export class OAuthPage {
    readonly page: Page;

    // --- Listing page (oauth.tsx) ---
    readonly oauthHeading: Locator;
    readonly addIntegrationButton: Locator;
    readonly oauthDataGrid: Locator;
    readonly actionsMenuTrigger: Locator;
    readonly actionsMenuItem: Locator;

    // --- New Integration page (oauthIntegration.tsx) ---
    readonly integrationNameInput: Locator;
    readonly redirectUrlInput: Locator;
    readonly newIntegrationButton: Locator;

    // --- Client Secret modal (oauthIntegration.tsx) ---
    readonly clientSecretDialogTitle: Locator;
    readonly integrationDoneButton: Locator;

    // --- Config page (oauthConfig.tsx) ---
    readonly configNameInput: Locator;
    readonly configClientIdInput: Locator;
    readonly configSaveButton: Locator;

    // --- Config: Redirect URI list (oauthConfig.tsx) ---
    readonly editUriButton: Locator;
    readonly deleteUriButton: Locator;
    readonly addUriButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Listing page — from oauth.tsx
        this.oauthHeading = page.getByRole('heading', { name: 'OAuth' });
        this.addIntegrationButton = page.getByTestId('oauth-add-integration-button');
        this.oauthDataGrid = page.locator('.MuiDataGrid-root');
        this.actionsMenuTrigger = page.getByTestId('actions-menu-trigger');
        this.actionsMenuItem = page.getByTestId('actions-menu-item');

        // New Integration page — from oauthIntegration.tsx
        this.integrationNameInput = page.getByPlaceholder('Enter Integration name');
        this.redirectUrlInput = page.getByPlaceholder('Enter redirect url');
        this.newIntegrationButton = page.getByTestId('oauth-new-integration-button');

        // Client Secret modal — from oauthIntegration.tsx
        this.clientSecretDialogTitle = page.getByRole('heading', { name: 'Client Secret' });
        this.integrationDoneButton = page.getByTestId('oauth-integration-done-button');

        // Config page — from oauthConfig.tsx
        this.configNameInput = page.locator('input[required]').first();
        this.configClientIdInput = page.locator('input[disabled]');
        this.configSaveButton = page.getByTestId('oauth-config-save-button');

        // Config: Redirect URI list — from oauthConfig.tsx
        this.editUriButton = page.getByTestId('oauth-config-edit-uri-button');
        this.deleteUriButton = page.getByTestId('oauth-config-delete-uri-button');
        this.addUriButton = page.getByTestId('oauth-config-add-uri-button');
    }

    // --- Listing page ---

    async clickAddIntegration(): Promise<void> {
        await this.addIntegrationButton.click();
    }

    async clickOAuthRow(title: string): Promise<void> {
        await this.oauthDataGrid.getByText(title).click();
    }

    async openRowContextMenu(index: number = 0): Promise<void> {
        await this.actionsMenuTrigger.nth(index).click();
    }

    async clickMenuOption(option: 'Edit' | 'Delete'): Promise<void> {
        await this.actionsMenuItem.filter({ hasText: option }).click();
    }

    async editOAuthByRow(index: number): Promise<void> {
        await this.openRowContextMenu(index);
        await this.clickMenuOption('Edit');
    }

    async deleteOAuthByRow(index: number): Promise<void> {
        await this.openRowContextMenu(index);
        await this.clickMenuOption('Delete');
    }

    // --- New Integration page ---

    async fillIntegrationName(name: string): Promise<void> {
        await this.integrationNameInput.fill(name);
    }

    async fillRedirectUrl(url: string): Promise<void> {
        await this.redirectUrlInput.fill(url);
    }

    async clickNewIntegration(): Promise<void> {
        await this.newIntegrationButton.click();
    }

    async createIntegration(name: string, redirectUrl: string): Promise<void> {
        await this.fillIntegrationName(name);
        await this.fillRedirectUrl(redirectUrl);
        await this.clickNewIntegration();
    }

    // --- Client Secret modal ---

    async clickDone(): Promise<void> {
        await this.integrationDoneButton.click();
    }

    async isClientSecretModalVisible(): Promise<boolean> {
        return this.clientSecretDialogTitle.isVisible();
    }

    // --- Config page ---

    async fillConfigName(name: string): Promise<void> {
        await this.configNameInput.fill(name);
    }

    async clickSaveChanges(): Promise<void> {
        await this.configSaveButton.click();
    }

    // --- Config: Redirect URI list ---

    async editUri(index: number, newUri: string): Promise<void> {
        await this.editUriButton.nth(index).click();
        const editField = this.page.locator('.MuiListItem-root').nth(index).locator('input');
        await editField.fill(newUri);
        await editField.press('Enter');
    }

    async deleteUri(index: number): Promise<void> {
        await this.deleteUriButton.nth(index).click();
    }

    async addUri(uri: string): Promise<void> {
        await this.addUriButton.click();
        const addField = this.page.locator('.MuiList-root input').last();
        await addField.fill(uri);
        await addField.press('Enter');
    }

    // --- State checks ---

    async isLoaded(): Promise<boolean> {
        return this.oauthHeading.isVisible();
    }

    async isConfigPage(): Promise<boolean> {
        return this.configSaveButton.isVisible();
    }

    async isNewIntegrationPage(): Promise<boolean> {
        return this.newIntegrationButton.isVisible();
    }
}

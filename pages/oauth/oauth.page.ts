import { Page, Locator } from '@playwright/test';

/**
 * OAuth Page
 * Handles: OAuth integrations listing, config, URI management
 */
export class OAuthPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // oauth-add-integration-button, oauth-new-integration-button
    // oauth-integration-done-button, oauth-config-save-button
    // oauth-config-edit-uri-button, oauth-config-delete-uri-button
    // oauth-config-add-uri-button
}

import { Page, Locator } from '@playwright/test';

/**
 * API Config Component (Developer Hub)
 * Handles: API whitelist configuration, header settings
 * Reference: API config components
 */
export class ApiConfigComponent {
    readonly page: Page;

    readonly saveWhitelistButton: Locator;
    readonly whitelistAutocomplete: Locator;
    readonly appendHeadersSkipWhitelistCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;

        this.saveWhitelistButton = page.getByTestId('api-config-save-whitelist-button');
        this.whitelistAutocomplete = page.getByTestId('api-config-whitelist-autocomplete');
        this.appendHeadersSkipWhitelistCheckbox = page.getByTestId('append-headers-skip-whitelist-checkbox');
    }

    async saveWhitelist(): Promise<void> {
        await this.saveWhitelistButton.click();
    }

    async toggleSkipWhitelist(): Promise<void> {
        await this.appendHeadersSkipWhitelistCheckbox.click();
    }
}

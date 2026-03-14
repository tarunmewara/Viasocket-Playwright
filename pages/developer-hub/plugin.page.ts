import { Page, Locator } from '@playwright/test';

/**
 * Plugin Page (Developer Hub)
 * Handles: plugin listing, details, preview, scope, workspace toggle
 * Reference: PluginDashboard.tsx, PluginDetailsSection.tsx
 */
export class PluginPage {
    readonly page: Page;

    // Plugin listing
    readonly pluginCard: Locator;
    readonly pluginNavItem: Locator;
    readonly pluginHeaderButton: Locator;
    readonly requestPluginButton: Locator;
    readonly servicePluginCard: Locator;

    // Plugin details
    readonly descriptionInput: Locator;
    readonly detailsSaveButton: Locator;
    readonly learnMoreLink: Locator;
    readonly supportButton: Locator;

    // Plugin preview
    readonly previewDescriptionToggle: Locator;
    readonly previewShowMoreButton: Locator;

    // Plugin config
    readonly scopeAutocomplete: Locator;
    readonly staticIpCheckbox: Locator;
    readonly workspaceToggle: Locator;
    readonly switchWorkspaceButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Plugin listing — from PluginDashboard.tsx
        this.pluginCard = page.getByTestId('plugin-card');
        this.pluginNavItem = page.getByTestId('plugin-nav-item');
        this.pluginHeaderButton = page.getByTestId('plugin-header-button');
        this.requestPluginButton = page.getByTestId('request-plugin-button');
        this.servicePluginCard = page.getByTestId('service-plugin-card');

        // Plugin details — from PluginDetailsSection.tsx
        this.descriptionInput = page.getByTestId('plugin-description-input');
        this.detailsSaveButton = page.getByTestId('plugin-details-save-button');
        this.learnMoreLink = page.getByTestId('plugin-learn-more-link');
        this.supportButton = page.getByTestId('plugin-support-button');

        // Plugin preview
        this.previewDescriptionToggle = page.getByTestId('plugin-preview-description-toggle');
        this.previewShowMoreButton = page.getByTestId('plugin-preview-show-more-button');

        // Plugin config
        this.scopeAutocomplete = page.getByTestId('plugin-scope-autocomplete');
        this.staticIpCheckbox = page.getByTestId('plugin-static-ip-checkbox');
        this.workspaceToggle = page.getByTestId('plugin-workspace-toggle');
        this.switchWorkspaceButton = page.getByTestId('plugin-switch-workspace-button');
    }

    async clickPluginCard(index: number = 0): Promise<void> {
        await this.pluginCard.nth(index).click();
    }

    async clickPluginNavItem(index: number = 0): Promise<void> {
        await this.pluginNavItem.nth(index).click();
    }

    async clickSaveDetails(): Promise<void> {
        await this.detailsSaveButton.click();
    }

    async clickRequestPlugin(): Promise<void> {
        await this.requestPluginButton.click();
    }

    async toggleStaticIp(): Promise<void> {
        await this.staticIpCheckbox.click();
    }

    async toggleWorkspace(): Promise<void> {
        await this.workspaceToggle.click();
    }
}

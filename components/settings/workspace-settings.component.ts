import { Page, Locator } from '@playwright/test';

/**
 * Workspace Settings Component
 * Handles: workspace name, timezone, industry, domain inputs, save/cancel
 * Reference: WorkspaceSetting.tsx
 */
export class WorkspaceSettingsComponent {
    readonly page: Page;

    // Form fields
    readonly nameInput: Locator;
    readonly timezoneInput: Locator;
    readonly industryInput: Locator;
    readonly domainInput: Locator;

    // Actions
    readonly saveButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from WorkspaceSetting.tsx
        this.nameInput = page.getByTestId('workspace-name-input');
        this.timezoneInput = page.getByTestId('workspace-timezone-input');
        this.industryInput = page.getByTestId('workspace-industry-input');
        this.domainInput = page.getByTestId('workspace-domain-input');
        this.saveButton = page.getByTestId('workspace-settings-save-button');
        this.cancelButton = page.getByTestId('workspace-settings-cancel-button');
    }

    async fillName(name: string): Promise<void> {
        await this.nameInput.locator('input').fill(name);
    }

    async fillTimezone(timezone: string): Promise<void> {
        await this.timezoneInput.locator('input').fill(timezone);
        await this.page.getByRole('option', { name: timezone }).first().click();
    }

    async fillIndustry(industry: string): Promise<void> {
        await this.industryInput.locator('input').fill(industry);
        await this.page.getByRole('option', { name: industry }).first().click();
    }

    async fillDomain(domain: string): Promise<void> {
        await this.domainInput.locator('input').fill(domain);
    }

    async save(): Promise<void> {
        await this.saveButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async isVisible(): Promise<boolean> {
        return this.saveButton.isVisible();
    }

    async isSaveDisabled(): Promise<boolean> {
        return this.saveButton.isDisabled();
    }
}

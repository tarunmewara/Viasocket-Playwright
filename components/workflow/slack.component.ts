import { Page, Locator } from '@playwright/test';

/**
 * Slack Component
 * Handles: Slack Send Message action configuration
 */
export class SlackComponent {
    readonly page: Page;

    // Auth connection
    readonly authConnectionChip: Locator;

    // Channel selection
    readonly selectChannelButton: Locator;

    // Message content input
    readonly messageContentInput: Locator;

    // Add variable button
    readonly addVariableButton: Locator;

    // Test and save buttons
    readonly dryRunTestButton: Locator;
    readonly saveButton: Locator;

    // Input variables close button
    readonly inputVariablesCloseBtn: Locator;

    // Test button in modal
    readonly testButtonInModal: Locator;

    constructor(page: Page) {
        this.page = page;

        this.authConnectionChip = page.getByTestId('auth-connection-chip');
        this.selectChannelButton = page.getByRole('button', { name: 'Select Slack channel(s)' });
        this.messageContentInput = page.getByTestId('custom-autosuggest-content').getByTestId('add-variable-button');
        this.addVariableButton = page.getByTestId('custom-autosuggest-content').getByTestId('add-variable-button');
        this.dryRunTestButton = page.getByTestId('dry-run-test-button');
        this.saveButton = page.getByTestId('save-button');
        this.inputVariablesCloseBtn = page.getByTestId('input-variables-close-btn');
        this.testButtonInModal = page.getByRole('button', { name: 'Test' });
    }

    async selectAuthConnection(connectionId: string): Promise<void> {
        await this.authConnectionChip.click();
        await this.page.getByTestId(`auth-connection-item-${connectionId}`).click();
    }

    async selectChannel(channelName: string): Promise<void> {
        await this.selectChannelButton.click();
        await this.page.getByText(channelName).click();
    }

    async closeChannelDropdown(): Promise<void> {
        await this.page.locator('div').filter({ hasText: new RegExp(`^${arguments[0]}$`) }).first().click();
    }

    async clickAddVariableButton(): Promise<void> {
        await this.addVariableButton.click();
    }

    async selectVariableByText(variableName: string): Promise<void> {
        await this.page.getByText(variableName).click();
    }

    async clickTest(): Promise<void> {
        await this.dryRunTestButton.click();
    }

    async clickTestButtonInModal(): Promise<void> {
        await this.testButtonInModal.click();
    }

    async save(): Promise<void> {
        await this.saveButton.click();
    }

    async closeInputVariablesModal(): Promise<void> {
        const isVisible = await this.inputVariablesCloseBtn.isVisible({ timeout: 2000 }).catch(() => false);
        if (isVisible) {
            await this.inputVariablesCloseBtn.click();
        }
    }
}

import { Page, Locator } from '@playwright/test';

/**
 * Workspace Memory Component
 * Handles: Workspace Memory action configuration
 */
export class WorkspaceMemoryComponent {
    readonly page: Page;

    // Auth connection
    readonly authConnectionChip: Locator;

    // Input fields
    readonly uniqueIdInput: Locator;
    readonly aiCodeInput: Locator;

    // Ask AI button
    readonly askAiButton: Locator;

    // Test and save buttons
    readonly dryRunTestButton: Locator;
    readonly saveButton: Locator;
    readonly testButtonInModal: Locator;

    // Input variables close button
    readonly inputVariablesCloseBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.authConnectionChip = page.getByTestId('auth-connection-chip');
        this.uniqueIdInput = page.getByTestId('mentions-input-uniqueIdOfJson');
        this.aiCodeInput = page.getByTestId('mentions-input-aicode');
        this.askAiButton = page.getByTestId('custom-autosuggest-ask-ai-btn');
        this.dryRunTestButton = page.getByTestId('dry-run-test-button');
        this.saveButton = page.getByTestId('save-button');
        this.testButtonInModal = page.getByRole('button', { name: 'Test' });
        this.inputVariablesCloseBtn = page.getByTestId('input-variables-close-btn');
    }

    async selectAuthConnection(connectionId: string): Promise<void> {
        await this.authConnectionChip.click();
        await this.page.getByTestId(`auth-connection-item-${connectionId}`).click();
    }

    async fillUniqueId(uniqueId: string): Promise<void> {
        await this.uniqueIdInput.click();
        await this.uniqueIdInput.fill(uniqueId);
    }

    async fillAiCode(code: string): Promise<void> {
        await this.aiCodeInput.click();
        await this.aiCodeInput.fill(code);
    }

    async clickAskAi(): Promise<void> {
        await this.askAiButton.click();
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

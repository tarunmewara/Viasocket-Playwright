import { Page, Locator } from '@playwright/test';

/**
 * AI Agent Component
 * Handles: Call AI Agent (Instant) action configuration
 */
export class AIAgentComponent {
    readonly page: Page;

    // Query input
    readonly queryInput: Locator;

    // Test and save buttons
    readonly dryRunTestButton: Locator;
    readonly saveButton: Locator;


    // Variable popover close button
    readonly variablePopoverCloseButton: Locator;

    // Input variables close button
    readonly inputVariablesCloseBtn: Locator;

    // Add variable button
    readonly addVariableButton: Locator;

    // Test button in modal
    readonly testButtonInModal: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid='mentions-input-query'
        this.queryInput = page.getByTestId('mentions-input-query');
        this.dryRunTestButton = page.getByTestId('dry-run-test-button');
        this.saveButton = page.getByTestId('save-button');
        this.variablePopoverCloseButton = page.getByTestId('variable-popover-close-button');
        this.inputVariablesCloseBtn = page.getByTestId('input-variables-close-btn');
        this.addVariableButton = page.getByTestId('add-variable-button');
        this.testButtonInModal = page.getByRole('button', { name: 'Test' });
    }

    async fillQuery(query: string): Promise<void> {
        await this.queryInput.click();
        await this.queryInput.fill(query);
    }

    async closeVariablePopover(): Promise<void> {
        await this.variablePopoverCloseButton.click();
    }

    async clickTest(): Promise<void> {
        await this.dryRunTestButton.click();
    }

    async save(): Promise<void> {
        await this.saveButton.click();
    }

    async testAndSave(): Promise<void> {
        await this.dryRunTestButton.click();
        await this.saveButton.click();
    }

    async closeInputVariablesModal(): Promise<void> {
        await this.inputVariablesCloseBtn.click();
    }

    async clickAddVariableButton(): Promise<void> {
        await this.addVariableButton.click();
    }

    async selectVariableByText(variableName: string): Promise<void> {
        await this.page.getByText(variableName).click();
    }

    async clickTestButtonInModal(): Promise<void> {
        await this.testButtonInModal.click();
    }
}

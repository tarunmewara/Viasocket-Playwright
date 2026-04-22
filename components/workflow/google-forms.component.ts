import { Page, Locator } from '@playwright/test';

/**
 * Google Forms Component
 * Handles: Google Forms trigger configuration (New Form Response)
 */
export class GoogleFormsComponent {
    readonly page: Page;

    // Auth connection
    readonly authConnectionChip: Locator;

    // Form selection
    readonly chooseFormButton: Locator;

    // Test and save buttons
    readonly triggerDryRunTestButton: Locator;
    readonly triggerSaveButton: Locator;

    // Variable popover close button
    readonly variablePopoverCloseButton: Locator;

    // Input variables modal
    readonly inputVariablesCloseBtn: Locator;
    readonly jsCode: Locator;
    readonly mentionsInput: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid='auth-connection-chip' (BasicAndAuth2.tsx)
        this.authConnectionChip = page.getByTestId('auth-connection-chip');

        // Form selection button
        this.chooseFormButton = page.getByRole('button', { name: 'Choose Form' });

        // data-testid='trigger-dry-run-test-button' (triggerDryRunButton.tsx)
        this.triggerDryRunTestButton = page.getByTestId('trigger-dry-run-test-button');

        // data-testid='trigger-save-button' (SaveButtonForTrigger.tsx)
        this.triggerSaveButton = page.getByTestId('trigger-save-button');

        // data-testid='variable-popover-close-button' (VariablePopoverMenu.tsx)
        this.variablePopoverCloseButton = page.getByTestId('variable-popover-close-button');

        // data-testid='input-variables-close-btn' (customVariablesComponent.tsx)
        this.inputVariablesCloseBtn = page.getByTestId('input-variables-close-btn');
        
        // JS Code option by label
        this.jsCode = page.getByTestId('add-step-slider').getByText('JS Code');
        
        // Mentions input
        this.mentionsInput = page.getByTestId('mentions-input');
    }

    async selectAuth(connectionName: string): Promise<void> {
        await this.authConnectionChip.click();
        await this.page.getByText(connectionName).click();
    }

    async selectAuthByIndex(index: number = 0): Promise<void> {
        await this.authConnectionChip.click();
        await this.page.getByRole('option').nth(index).click();
    }

    async selectForm(formName: string): Promise<void> {
        await this.chooseFormButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.chooseFormButton.click();
        await this.page.getByText('AUTOMATION TESTING').click();
    }

    async selectFormByIndex(index: number = 0): Promise<void> {
        await this.chooseFormButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.chooseFormButton.click();
        await this.page.getByRole('option').nth(index).click();
    }

    async testTrigger(): Promise<void> {
        await this.triggerDryRunTestButton.click();
        await this.page.waitForTimeout(3000);
    }

    async closeInputVariablesModal(): Promise<void> {
        const inputVarsClose = this.inputVariablesCloseBtn;
        if (await inputVarsClose.isVisible({ timeout: 4000 }).catch(() => false)) {
            await inputVarsClose.click();
        }
    }

    async selectJsCode(): Promise<void> {
        await this.jsCode.click();
    }
    async clickMentionsInput(): Promise<void> {
        await this.mentionsInput.click();
    }
    async saveTrigger(): Promise<void> {
        await this.triggerSaveButton.click();
    }

    async testAndSave(): Promise<void> {
        await this.testTrigger();
        await this.closeInputVariablesModal();
        await this.saveTrigger();
    }
}

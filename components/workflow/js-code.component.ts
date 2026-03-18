import { Page, Locator } from '@playwright/test';

/**
 * JS Code Component
 * Handles: JS Code step panel — description, input variables, code editor, save/test actions,
 *          add-step flow to open the panel
 * Reference: functionsActionsButton.tsx, StepSliderFooter.tsx, dryRunButton.tsx,
 *            InputValues.tsx, CodeEditor.tsx, JsCodePanel.tsx
 */
export class JSCodeComponent {
    readonly page: Page;

    // Actions menu (functionsActionsButton.tsx)
    readonly actionsMenuTrigger: Locator;
    readonly actionsMenuItem: Locator;

    // Step slider footer (StepSliderFooter.tsx)
    readonly doneButton: Locator;

    // Dry-run / TEST button (dryRunButton.tsx — data-testid='dry-run-step-test-button')
    readonly testButton: Locator;

    // Dry-run response (dryRunSlider.tsx)
    readonly expandResponse: Locator;

    // ── JS Code panel ──────────────────────────────────────────────────────────

    // Description textarea (placeholder 'Provide a high-level…')
    readonly descriptionTextarea: Locator;

    // Input Values accordion (data-testid='input-values-accordion-summary' / 'input-values-accordion')
    readonly inputValuesAccordionSummary: Locator;
    readonly inputValuesAccordion: Locator;
    readonly addVariableBtn: Locator;           // data-test-id='add-variable-btn'
    readonly variableNameInput: Locator;        // data-testid='variable-name-input'
    readonly addVariableConfirmBtn: Locator;    // data-test-id='add-variable-confirm-btn'
    readonly cancelVariableBtn: Locator;        // role='button' name='Cancel'

    // Code accordion (role='button' name='Code' / #code-editor)
    readonly codeAccordionBtn: Locator;
    readonly codeEditor: Locator;
    readonly codeEditorTextbox: Locator;        // first textbox inside #code-editor

    // Save (data-testid='save-button')
    readonly saveButton: Locator;

    // Canvas — step node labels after saving
    readonly jsCodeStepNode: Locator;           // getByText('JS_Code')
    readonly configureStepNode: Locator;        // getByText('Configure')

    // ── Add-step flow ──────────────────────────────────────────────────────────
    readonly addStepButton: Locator;            // data-testid='add-step-button'
    readonly jsCodeOption: Locator;             // role='option' name='JS Code'
    readonly closeOverlayButton: Locator;       // icon-only button that closes add-step overlay

    constructor(page: Page) {
        this.page = page;

        // Actions menu
        this.actionsMenuTrigger = page.getByTestId('actions-menu-trigger');
        this.actionsMenuItem = page.getByTestId('actions-menu-item');

        // Footer / dry-run
        this.doneButton = page.getByTestId('step-slider-done-button');
        this.testButton = page.getByTestId('dry-run-step-test-button');
        this.expandResponse = page.getByTestId('dry-run-expand-response');

        // Description
        this.descriptionTextarea = page.getByRole('textbox', { name: /provide a high-level/i });

        // Input Values accordion
        this.inputValuesAccordionSummary = page.getByTestId('input-values-accordion-summary');
        this.inputValuesAccordion = page.getByTestId('input-values-accordion');
        this.addVariableBtn = page.locator('[data-test-id="add-variable-btn"]');
        this.variableNameInput = page.getByTestId('variable-name-input');
        this.addVariableConfirmBtn = page.locator('[data-test-id="add-variable-confirm-btn"]');
        this.cancelVariableBtn = page.getByRole('button', { name: 'Cancel' });

        // Code accordion
        this.codeAccordionBtn = page.getByRole('button', { name: 'Code' });
        this.codeEditor = page.locator('#code-editor');
        this.codeEditorTextbox = page.locator('#code-editor').getByRole('textbox').first();

        // Save
        this.saveButton = page.getByTestId('save-button');

        // Canvas step nodes
        this.jsCodeStepNode = page.getByText('JS_Code');
        this.configureStepNode = page.getByText('Configure');

        // Add-step flow
        this.addStepButton = page.getByTestId('add-step-button');
        this.jsCodeOption = page.getByRole('option', { name: 'JS Code', exact: true });
        this.closeOverlayButton = page.getByRole('button').filter({ hasText: /^$/ }).first();
    }

    // ── Actions menu ──────────────────────────────────────────────────────────

    async openActionsMenu(): Promise<void> {
        await this.actionsMenuTrigger.click();
    }

    async selectAction(actionText: string): Promise<void> {
        await this.openActionsMenu();
        await this.actionsMenuItem.filter({ hasText: actionText }).click();
    }

    async clickDone(): Promise<void> {
        await this.doneButton.click();
    }

    async clickTest(): Promise<void> {
        await this.testButton.click();
    }

    async expandDryRunResponse(): Promise<void> {
        await this.expandResponse.click();
    }

    async isTestVisible(): Promise<boolean> {
        return this.testButton.isVisible();
    }

    async isDoneVisible(): Promise<boolean> {
        return this.doneButton.isVisible();
    }

    // ── Description ──────────────────────────────────────────────────────────

    async fillDescription(text: string): Promise<void> {
        await this.descriptionTextarea.click();
        await this.descriptionTextarea.fill(text);
    }

    // ── Input Values accordion ───────────────────────────────────────────────

    async toggleInputValues(): Promise<void> {
        await this.inputValuesAccordionSummary.click();
    }

    async clickAddVariable(): Promise<void> {
        await this.addVariableBtn.click();
    }

    async fillVariableName(name: string): Promise<void> {
        await this.variableNameInput.fill(name);
    }

    async confirmAddVariable(): Promise<void> {
        await this.addVariableConfirmBtn.click();
    }

    async cancelAddVariable(): Promise<void> {
        await this.cancelVariableBtn.click();
    }

    async addVariable(name: string): Promise<void> {
        await this.clickAddVariable();
        await this.fillVariableName(name);
        await this.confirmAddVariable();
    }

    variableValueAt(index: number = 0): Locator {
        return this.inputValuesAccordion.locator('textarea').nth(index);
    }

    async fillVariableValue(value: string, index: number = 0): Promise<void> {
        await this.variableValueAt(index).fill(value);
    }

    variableValueInputs(): Locator {
        return this.inputValuesAccordion.getByRole('textbox');
    }

    variableNameLabel(name: string): Locator {
        return this.inputValuesAccordion.getByText(name);
    }

    // ── Code accordion ───────────────────────────────────────────────────────

    async toggleCode(): Promise<void> {
        await this.codeAccordionBtn.click();
    }

    async fillCode(code: string): Promise<void> {
        const emptyTextbox = this.codeEditor.getByRole('textbox').filter({ hasText: /^$/ });
        await emptyTextbox.click();
        await emptyTextbox.fill(code);
    }

    async overwriteCode(code: string): Promise<void> {
        await this.codeEditorTextbox.waitFor({ state: 'visible' });
        await this.codeEditorTextbox.fill(code);
    }

    async typeCode(code: string): Promise<void> {
        const emptyTextbox = this.codeEditor.getByRole('textbox').filter({ hasText: /^$/ });
        await emptyTextbox.click();
        await this.page.keyboard.type(code);
    }

    async clearCode(): Promise<void> {
        await this.codeEditorTextbox.waitFor({ state: 'visible' });
        await this.codeEditorTextbox.click();
        await this.page.keyboard.press('Control+a');
        await this.page.keyboard.press('Delete');
    }

    // ── Save ─────────────────────────────────────────────────────────────────

    async save(): Promise<void> {
        await this.saveButton.click();
    }

    async reopenEditor(): Promise<void> {
        await this.configureStepNode.first().click();
        await this.waitForPanelReady();
    }

    // ── Panel readiness ──────────────────────────────────────────────────────

    async waitForPanelReady(): Promise<void> {
        await this.testButton.waitFor({ state: 'visible' });
    }

    // ── Add-step flow ─────────────────────────────────────────────────────────

    async clickAddStepButton(): Promise<void> {
        await this.addStepButton.click();
    }

    async selectJsCodeOption(): Promise<void> {
        await this.jsCodeOption.click();
    }

    async closeAddStepOverlay(): Promise<void> {
        await this.closeOverlayButton.click();
    }
}

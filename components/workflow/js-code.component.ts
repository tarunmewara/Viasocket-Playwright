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
    readonly cancelVariableBtn: Locator;        // data-testid='cancel-add-btn'

    // Code accordion (role='button' name='Code' / #code-editor)
    readonly codeAccordionBtn: Locator;
    readonly codeEditor: Locator;
    readonly codeEditorTextbox: Locator;        // first textbox inside #code-editor

    // Save (data-testid='save-button')
    readonly saveButton: Locator;

    // Variable popover close button (data-testid='variable-popover-close-button')
    readonly variablePopoverCloseButton: Locator;

    // Ask AI button inside the JS Code description section (data-testid='ask-ai-description-button' if available, else scoped role)
    readonly askAiDescriptionButton: Locator;

    // Canvas — step node labels after saving
    readonly jsCodeStepNode: Locator;           // getByText('JS_Code')
    readonly configureStepNode: Locator;        // getByText('Configure')

    // ── Ask AI (canvas button) ───────────────────────────────────────────────
    readonly askAiCanvasButton: Locator;        // data-testid='ask-ai-button'
    readonly chatbotChangesAppliedLink: Locator; // data-testid='chatbot-changes-applied-link'
    readonly inputVariablesCloseBtn: Locator;   // data-testid='input-variables-close-btn'
    readonly dryRunTestFlowButton: Locator;      // data-testid='dry-run-test-flow-button' (inside dry-run panel)
    readonly bodyInsertExpandButton: Locator;   // expand icon inside 'body' treeitem
    readonly bodyInsertButton: Locator;         // 'Insert' button inside 'body' treeitem
    readonly queryInsertExpandButton: Locator;  // expand icon inside 'query' treeitem
    readonly chatbotMessageInput: Locator;      // data-testid='chatbot-message-input'
    readonly chatbotSendButton: Locator;        // data-testid='chatbot-send-button'

    // ── Navigation / project setup (TC-001 raw) ────────────────────────────────
    readonly createFlowButton: Locator;         // data-testid='project-slider-create-flow-btn'
    readonly webhookTriggerOption: Locator;     // getByText('When a webhook is triggered')

    // ── Add-step flow ──────────────────────────────────────────────────────────
    readonly addStepButton: Locator;            // data-testid='add-step-button'
    readonly jsCodeOption: Locator;             // role='option' name='JS Code' exact
    readonly jsCodeOptionByLabel: Locator;      // getByLabel('JS CodeRun custom task, logic').getByText('JS Code')
    readonly closeOverlayButton: Locator;       // data-testid='slider-back-button'

    // ── Variable value inputs (inside input-values-accordion) ─────────────────
    readonly variableValueTextbox: Locator;     // first textbox inside input-values-accordion
    readonly variableValueTextarea: Locator;    // textarea inside input-values-accordion
    readonly muiBackdrop: Locator;              // MUI Backdrop — scoped to [role="presentation"]
    readonly addCancelText: Locator;            // getByText('AddCancel') — text stable for combined button label
    readonly duplicateVariableError: Locator;   // getByText('A variable with this name already exists.')

    // ── Code editor — empty textbox filter (TC-003 raw) ──────────────────────
    readonly codeEditorEmptyTextbox: Locator;   // #code-editor textbox with no content

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
        this.addVariableBtn = page.getByTestId('add-variable-btn');
        this.variableNameInput = page.getByTestId('variable-name-input');
        this.addVariableConfirmBtn = page.getByTestId('add-variable-confirm-btn');
        this.cancelVariableBtn = page.getByTestId('cancel-add-btn');

        // Code accordion — AccordionSummary has no testid; scope by #code-editor ID then role
        this.codeAccordionBtn = page.locator('#code-editor [role="button"]').first();
        this.codeEditor = page.locator('#code-editor');
        this.codeEditorTextbox = page.locator('#code-editor').getByRole('textbox').first();

        // Save
        this.saveButton = page.getByTestId('save-button');

        // Variable popover close button
        this.variablePopoverCloseButton = page.getByTestId('variable-popover-close-button');

        // Ask AI button in description area — scoped to the description box container
        this.askAiDescriptionButton = page.locator('[data-testid="ask-ai-button"]').nth(1);

        // Canvas step nodes — no testid available; scoped to canvas step text nodes
        this.jsCodeStepNode = page.locator('p').filter({ hasText: /^JS_Code$/ }).first();
        this.configureStepNode = page.locator('p').filter({ hasText: /^Configure$/ }).first();

        // Ask AI canvas + chatbot
        this.askAiCanvasButton = page.getByTestId('ask-ai-button');
        this.chatbotChangesAppliedLink = page.getByTestId('chatbot-changes-applied-link');
        this.inputVariablesCloseBtn = page.getByTestId('input-variables-close-btn');
        this.dryRunTestFlowButton = page.getByTestId('dry-run-test-flow-button');
        this.bodyInsertExpandButton = page.locator('[role="treeitem"]').filter({ hasText: /^body/ }).locator('button').first();
        this.bodyInsertButton = page.locator('[role="treeitem"]').filter({ hasText: /^body/ }).getByRole('button', { name: 'Insert' });
        this.queryInsertExpandButton = page.locator('[role="treeitem"]').filter({ hasText: /^query/ }).locator('button').first();
        this.chatbotMessageInput = page.getByTestId('chatbot-message-input');
        this.chatbotSendButton = page.getByTestId('chatbot-send-button');

        // Navigation / project setup
        this.createFlowButton = page.getByTestId('project-slider-create-flow-btn');
        this.webhookTriggerOption = page.getByText('When a webhook is triggered');

        // Add-step flow
        this.addStepButton = page.getByTestId('add-step-button');
        this.jsCodeOption = page.getByRole('option', { name: 'JS Code', exact: true });
        this.jsCodeOptionByLabel = page.getByLabel('JS CodeRun custom task, logic').getByText('JS Code');
        this.closeOverlayButton = page.getByTestId('slider-back-button');

        // Variable value inputs
        this.variableValueTextbox = page.getByTestId('input-values-accordion').getByRole('textbox');
        this.variableValueTextarea = page.getByTestId('input-values-accordion').locator('textarea');
        this.muiBackdrop = page.locator('[role="presentation"] .MuiBackdrop-root').first();
        this.addCancelText = page.getByText('AddCancel', { exact: true });
        this.duplicateVariableError = page.getByText('A variable with this name already exists.');

        // Code editor empty textbox
        this.codeEditorEmptyTextbox = page.locator('#code-editor').getByRole('textbox').filter({ hasText: /^$/ });
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
        await this.addVariableBtn.click({ force: true });
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
        const textbox = this.codeEditor.getByRole('textbox').first();
        await textbox.waitFor({ state: 'visible' });
        await textbox.click();
        await this.page.keyboard.press('Control+a');
        await this.page.keyboard.type(code);
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

    // ── Variable popover ──────────────────────────────────────────────────────

    async closeVariablePopover(): Promise<void> {
        await this.variablePopoverCloseButton.click();
    }

    // ── Ask AI (description area) ─────────────────────────────────────────────

    async clickAskAiDescriptionButton(): Promise<void> {
        await this.askAiDescriptionButton.click();
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

    async selectJsCodeOptionByLabel(): Promise<void> {
        await this.jsCodeOptionByLabel.click();
    }

    async closeAddStepOverlay(): Promise<void> {
        await this.closeOverlayButton.click();
    }

    // ── Navigation / project setup ────────────────────────────────────────────

    async clickCreateFlowButton(): Promise<void> {
        await this.createFlowButton.waitFor({ state: 'visible', timeout: 60000 });
        await this.createFlowButton.click();
    }

    async selectWebhookTriggerOption(): Promise<void> {
        await this.webhookTriggerOption.click();
    }

    // ── Variable value inputs ─────────────────────────────────────────────────

    async clickVariableValueTextbox(): Promise<void> {
        await this.variableValueTextbox.click();
    }

    async fillVariableValueTextarea(value: string): Promise<void> {
        await this.variableValueTextarea.fill(value);
    }

    async fillVariableValueTextbox(value: string): Promise<void> {
        await this.variableValueTextbox.fill(value);
    }

    async clickMuiBackdrop(): Promise<void> {
        await this.muiBackdrop.click();
    }

    async clickAddCancelText(): Promise<void> {
        await this.addCancelText.click();
    }

    // ── Code editor ───────────────────────────────────────────────────────────

    async clickCodeEditorEmptyTextbox(): Promise<void> {
        await this.codeEditorEmptyTextbox.click();
    }

    async fillCodeEditorEmptyTextbox(code: string): Promise<void> {
        await this.codeEditorEmptyTextbox.fill(code);
    }

    variableAutoSuggest(name: string): import('@playwright/test').Locator {
        return this.page.getByText(name);
    }

    // ── Ask AI canvas / chatbot ───────────────────────────────────────────────

    async clickAskAiCanvasButton(): Promise<void> {
        await this.askAiCanvasButton.click();
    }

    async pressEnterChatbot(): Promise<void> {
        await this.chatbotMessageInput.press('Enter');
    }

    async clickChatbotChangesApplied(): Promise<void> {
        await this.chatbotChangesAppliedLink.click();
    }

    async clickInputVariablesClose(): Promise<void> {
        await this.inputVariablesCloseBtn.click();
    }

    async clickDryRunTestFlowButton(): Promise<void> {
        await this.dryRunTestFlowButton.click();
    }

    async clickBodyInsertExpand(): Promise<void> {
        await this.bodyInsertExpandButton.click();
    }

    async clickBodyInsert(): Promise<void> {
        await this.bodyInsertButton.click();
    }

    async clickQueryInsertExpand(): Promise<void> {
        await this.queryInsertExpandButton.click();
    }
}

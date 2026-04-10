import { test, expect } from '../../../../../fixtures/base.fixture';

const EXISTING_FLOW_URL = '/projects/58104/proj58104/workflow/scritg0ygHTn/draft';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — navigates to existing flow, clicks Add Step, selects JS Code,
//          closes variable popover, waits for panel ready
// ─────────────────────────────────────────────────────────────────────────────
async function setupExistingFlowJsCodeEditor(page: any, workflow: any) {
    await page.goto(EXISTING_FLOW_URL);
    await page.waitForLoadState('load');
    await workflow.jscode.addStepButton.last().waitFor({ state: 'visible', timeout: 60000 });
    await workflow.jscode.addStepButton.last().click();
    await workflow.jscode.selectJsCodeOptionByLabel();
    await workflow.jscode.closeVariablePopover();
    await workflow.jscode.waitForPanelReady();
}

// ─────────────────────────────────────────────────────────────────────────────
// JS Code — Actual user flow test cases
// ─────────────────────────────────────────────────────────────────────────────
test.describe('JS Code — Actual User Flows', () => {

    // ── TC-JSC-ACT-001 ────────────────────────────────────────────────────────
    // Raw: goto /org → click org-row-58104 → click project-slider-create-flow-btn →
    //      click webhook trigger option → click JS Code option →
    //      click variable-popover-close-button → click Code accordion →
    //      click + fill code editor textbox → click test → click save
    test('TC-JSC-ACT-001: Basic return true test case in JS Code', async ({ page, workflow }) => {
        await page.goto('/projects/58104');
        await page.waitForLoadState('load');
        await workflow.jscode.clickCreateFlowButton();
        await workflow.jscode.selectWebhookTriggerOption();
        await workflow.jscode.selectJsCodeOption();
        await workflow.jscode.variablePopoverCloseButton.waitFor({ state: 'visible', timeout: 10000 });
        await workflow.jscode.closeVariablePopover();
        await page.getByRole('button', { name: 'Code' }).click();
        // await workflow.jscode.toggleCode();
         await workflow.jscode.codeEditorTextbox.click();
        await workflow.jscode.closeVariablePopover();
        await workflow.jscode.codeEditorTextbox.click();
        // await page.locator('#code-editor').getByRole('textbox').click();
        await workflow.jscode.codeEditorTextbox.fill('return true');
        await workflow.jscode.clickTest();
        await workflow.jscode.save();
    });

    // ── TC-JSC-ACT-002 ────────────────────────────────────────────────────────
    // Raw: goto EXISTING_FLOW_URL → click add-step-button → click JS Code (by label) →
    //      click variable-popover-close-button → fill description textarea →
    //      click Ask AI nth(1) → click Code accordion →
    //      click ask-ai-button (canvas) → click test → click save
    test('TC-JSC-ACT-002: Writing JS code by giving a prompt to AI', async ({ page, workflow }) => {
        await page.goto('/projects/58104');
        await page.waitForLoadState('load');
        await workflow.jscode.clickCreateFlowButton();
        await workflow.jscode.selectWebhookTriggerOption();
        await workflow.jscode.selectJsCodeOption();
        await workflow.jscode.closeVariablePopover();
        await workflow.jscode.fillDescription('i want you to return me a list of all the prime numbers from one to hundred , both includeed');
        await workflow.jscode.clickAskAiDescriptionButton();
        // await workflow.jscode.toggleCode();
        // await workflow.jscode.clickAskAiCanvasButton();
        await workflow.jscode.clickTest();
        await workflow.jscode.save();
    });

    // ── TC-JSC-ACT-003 ────────────────────────────────────────────────────────
    // Raw: goto EXISTING_FLOW_URL → click add-step-button getByText('Add Step') →
    //      click JS Code (by label) → click variable-popover-close-button →
    //      click input-values-accordion-summary → click add-variable-btn →
    //      click + fill variable-name-input 'variable_name' → click add-variable-confirm-btn →
    //      click textbox in accordion → fill textarea 'variable' →
    //      click variable-popover-close-button → click textbox → fill 'variable_value' →
    //      click add-variable-btn → click Code accordion →
    //      click + fill empty code textbox 'return varai' →
    //      click autocomplete suggestion 'variable_name (variable)' →
    //      click test → click save
    test('TC-JSC-ACT-003: Adding a variable with name and value and returning it in the code', async ({ page, workflow }) => {
       await page.goto('/projects/58104');
        await page.waitForLoadState('load');
        await workflow.jscode.clickCreateFlowButton();
        await workflow.jscode.selectWebhookTriggerOption();
        await workflow.jscode.selectJsCodeOption();
        await workflow.jscode.closeVariablePopover();
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await workflow.jscode.variableNameInput.click();
        await workflow.jscode.fillVariableName('variable_name');
        await workflow.jscode.confirmAddVariable();
        await workflow.jscode.clickVariableValueTextbox();
        await workflow.jscode.fillVariableValueTextarea('variable');
        await workflow.jscode.closeVariablePopover();
        await workflow.jscode.clickVariableValueTextbox();
        await workflow.jscode.fillVariableValueTextbox('variable_value');
        await workflow.jscode.clickAddVariable();
        await workflow.jscode.toggleCode();
        await workflow.jscode.clickCodeEditorEmptyTextbox();
        await workflow.jscode.fillCodeEditorEmptyTextbox('return varai');
        await workflow.jscode.variableAutoSuggest('variable_name (variable)').click();
        await workflow.jscode.clickTest();
        await workflow.jscode.save();
    });

    // ── TC-JSC-ACT-004 ────────────────────────────────────────────────────────
    // Raw: goto EXISTING_FLOW_URL → click getByText('Add StepChoose what should') →
    //      click JS Code (by label) → click variable-popover-close-button →
    //      click input-values-accordion-summary → click add-variable-btn →
    //      click + fill variable-name-input 'name' → click add-variable-confirm-btn →
    //      click textbox in accordion → fill textarea 'value' →
    //      click MuiBackdrop → click getByText('AddCancel') →
    //      click add-variable-confirm-btn → dblclick add-variable-confirm-btn →
    //      click cancel-add-btn →
    //      assert 'A variable with this name already exists.'
    test('TC-JSC-ACT-004: Not allowed to create a variable with the same name', async ({ page, workflow }) => {
        await page.goto(EXISTING_FLOW_URL);
        await page.waitForLoadState('load');
        await workflow.jscode.addStepButton.last().waitFor({ state: 'visible', timeout: 60000 });
        await page.getByText('Add StepChoose what should').click();
        await workflow.jscode.selectJsCodeOptionByLabel();
        await workflow.jscode.closeVariablePopover();
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await workflow.jscode.variableNameInput.click();
        await workflow.jscode.fillVariableName('name');
        await workflow.jscode.confirmAddVariable();
        await workflow.jscode.clickVariableValueTextbox();
        await workflow.jscode.fillVariableValueTextarea('value');
        await workflow.jscode.clickMuiBackdrop();
        await workflow.jscode.clickAddCancelText();
        await workflow.jscode.confirmAddVariable();
        await workflow.jscode.addVariableConfirmBtn.dblclick();
        await workflow.jscode.cancelAddVariable();

        await expect(workflow.jscode.duplicateVariableError).toBeVisible();
    });

    // ── TC-JSC-ACT-005 ────────────────────────────────────────────────────────
    // Raw: goto EXISTING_FLOW_URL → click add-step-button → click JS Code option →
    //      click expand button on 'query Insert' treeitem →
    //      click Ask AI text nth(1) (description Ask AI button) →
    //      click dry-run-step-test-button → click dry-run-test-flow-button →
    //      click input-variables-close-btn → click save-button
    test('TC-JSC-ACT-005: Map data from query and use Ask AI to generate and apply code', async ({ page, workflow }) => {
        test.setTimeout(180000);
        await page.goto(EXISTING_FLOW_URL);
        await page.waitForLoadState('load');
        await workflow.jscode.addStepButton.last().waitFor({ state: 'visible', timeout: 60000 });
        await workflow.jscode.clickAddStepButton();
        await workflow.jscode.selectJsCodeOption();
        await workflow.jscode.clickQueryInsertExpand();
        await workflow.jscode.clickAskAiDescriptionButton();
        await workflow.jscode.clickTest();
        await workflow.jscode.clickDryRunTestFlowButton();
        await workflow.jscode.clickInputVariablesClose();
        await workflow.jscode.save();
    });

});

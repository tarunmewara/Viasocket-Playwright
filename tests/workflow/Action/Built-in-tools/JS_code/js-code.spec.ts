import { test, expect } from '../../../../../fixtures/base.fixture';

const PROJECT_ID = '58104';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — opens a fresh JS Code editor for each test
// Flow: project → new flow → webhook trigger → close slider →
//        add-step → select JS Code → close overlay → wait for panel
// ─────────────────────────────────────────────────────────────────────────────
async function setupJsCodeEditor(dashboard: any, triggers: any, workflow: any) {
    await dashboard.navigateToProject(PROJECT_ID);
    await dashboard.clickCreateNewFlow();
    await triggers.selectWebhookTrigger();
    await triggers.slider.closeButton.waitFor({ state: 'visible' });
    await triggers.closeSlider();
    await workflow.jscode.clickAddStepButton();
    await workflow.jscode.selectJsCodeOption();
    await workflow.jscode.closeAddStepOverlay();
    await workflow.jscode.waitForPanelReady();
}

// ─────────────────────────────────────────────────────────────────────────────
// JS Code — focused small test cases
// ─────────────────────────────────────────────────────────────────────────────
test.describe('JS Code — Built-in Tool', () => {

    test.beforeEach(async ({ dashboard, triggers, workflow }) => {
        await setupJsCodeEditor(dashboard, triggers, workflow);
    });

    // ── TC-JSC-031 ────────────────────────────────────────────────────────────
    test('TC-JSC-031: JS Code panel shows description, accordions, TEST and SAVE', async ({ workflow }) => {
        await expect(workflow.jscode.descriptionTextarea).toBeVisible();
        await expect(workflow.jscode.inputValuesAccordionSummary).toBeVisible();
        await expect(workflow.jscode.codeAccordionBtn).toBeVisible();
        await expect(workflow.jscode.testButton).toBeVisible();
        await expect(workflow.jscode.saveButton).toBeVisible();
    });

    // ── TC-JSC-032 ────────────────────────────────────────────────────────────
    test('TC-JSC-032: Description textarea accepts typed input', async ({ workflow }) => {
        await workflow.jscode.fillDescription('Validate user input and return result');
        await expect(workflow.jscode.descriptionTextarea).toHaveValue('Validate user input and return result');
    });

    // ── TC-JSC-033 ────────────────────────────────────────────────────────────
    test('TC-JSC-033: Input Values accordion expands and shows Add Variable button', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await expect(workflow.jscode.addVariableBtn).toBeVisible();
    });

    // ── TC-JSC-034 ────────────────────────────────────────────────────────────
    test('TC-JSC-034: Add Variable form shows name field and Add / Cancel buttons', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await expect(workflow.jscode.variableNameInput).toBeVisible();
        await expect(workflow.jscode.addVariableConfirmBtn).toBeVisible();
        await expect(workflow.jscode.cancelVariableBtn).toBeVisible();
    });

    // ── TC-JSC-035 ────────────────────────────────────────────────────────────
    test('TC-JSC-035: Add button is disabled when variable name is empty', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await expect(workflow.jscode.variableNameInput).toBeVisible();
        await expect(workflow.jscode.addVariableConfirmBtn).toBeDisabled();
    });

    // ── TC-JSC-036 ────────────────────────────────────────────────────────────
    test('TC-JSC-036: Adding a variable creates a value textbox in the accordion', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('username');
        await expect(workflow.jscode.variableValueInputs()).toBeVisible();
    });

    // ── TC-JSC-037 ────────────────────────────────────────────────────────────
    test('TC-JSC-037: Cancelling variable add removes form and restores Add Variable button', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await expect(workflow.jscode.variableNameInput).toBeVisible();
        await workflow.jscode.cancelAddVariable();
        await expect(workflow.jscode.variableNameInput).not.toBeVisible();
        await expect(workflow.jscode.addVariableBtn).toBeVisible();
    });

    // ── TC-JSC-038 ────────────────────────────────────────────────────────────
    test('TC-JSC-038: Code accordion expands and reveals the code editor', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.codeEditorTextbox).toBeVisible();
    });

    // ── TC-JSC-039 ────────────────────────────────────────────────────────────
    test('TC-JSC-039: Code editor accepts JavaScript input', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('return true');
        await expect(workflow.jscode.codeEditor).toContainText('return true');
    });

    // ── TC-JSC-040 ────────────────────────────────────────────────────────────
    test('TC-JSC-040: Save button saves the JS Code step and closes the slider', async ({ workflow }) => {
        await workflow.jscode.save();
        await expect(workflow.jscode.testButton).not.toBeVisible();
        await expect(workflow.jscode.configureStepNode).toBeVisible();
    });

    // ── TC-JSC-041 ────────────────────────────────────────────────────────────
    test('TC-JSC-041: Add Variable button is NOT visible before accordion is expanded', async ({ workflow }) => {
        await expect(workflow.jscode.addVariableBtn).not.toBeVisible();
    });

    // ── TC-JSC-042 ────────────────────────────────────────────────────────────
    test('TC-JSC-042: Code editor is NOT visible before Code accordion is expanded', async ({ workflow }) => {
        await expect(workflow.jscode.codeEditorTextbox).not.toBeVisible();
    });

    // ── TC-JSC-043 ────────────────────────────────────────────────────────────
    test('TC-JSC-043: Confirm button becomes enabled after typing a variable name', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await expect(workflow.jscode.addVariableConfirmBtn).toBeDisabled();
        await workflow.jscode.fillVariableName('myVar');
        await expect(workflow.jscode.addVariableConfirmBtn).toBeEnabled();
    });

    // ── TC-JSC-044 ────────────────────────────────────────────────────────────
    test('TC-JSC-044: Variable name label is visible in the accordion after adding', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('userId');
        await expect(workflow.jscode.variableNameLabel('userId')).toBeVisible();
    });

    // ── TC-JSC-045 ────────────────────────────────────────────────────────────
    test('TC-JSC-045: Variable value textarea accepts and holds typed content', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('token');
        await workflow.jscode.fillVariableValue('abc-123');
        await expect(workflow.jscode.variableValueAt()).toHaveValue('abc-123');
    });

    // ── TC-JSC-046 ────────────────────────────────────────────────────────────
    test('TC-JSC-046: Two variables added sequentially — two value inputs appear', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('firstName');
        await workflow.jscode.addVariable('lastName');
        await expect(workflow.jscode.variableValueInputs()).toHaveCount(2);
    });

    // ── TC-JSC-047 ────────────────────────────────────────────────────────────
    test('TC-JSC-047: Cancel after typing a name discards form — no variable added', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await workflow.jscode.fillVariableName('tempVar');
        await workflow.jscode.cancelAddVariable();
        await expect(workflow.jscode.variableNameInput).not.toBeVisible();
        await expect(workflow.jscode.variableValueInputs()).toHaveCount(0);
        await expect(workflow.jscode.addVariableBtn).toBeVisible();
    });

    // ── TC-JSC-048 ────────────────────────────────────────────────────────────
    test('TC-JSC-048: SAVE button is enabled by default without writing any code', async ({ workflow }) => {
        await expect(workflow.jscode.saveButton).toBeEnabled();
    });

    // ── TC-JSC-049 ────────────────────────────────────────────────────────────
    test('TC-JSC-049: Code written in editor persists after collapsing and re-expanding', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('return 42');
        // Collapse then re-expand
        await workflow.jscode.toggleCode();
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.codeEditor).toContainText('return 42');
    });

    // ── TC-JSC-050 ────────────────────────────────────────────────────────────
    test('TC-JSC-050: Code accordion collapses on second click (toggle behavior)', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.codeEditorTextbox).toBeVisible();
        // Second click — accordion should collapse
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.codeEditorTextbox).not.toBeVisible();
    });

    // ── TC-JSC-051 ────────────────────────────────────────────────────────────
    test('TC-JSC-051: Input Values accordion collapses on second click (toggle behavior)', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await expect(workflow.jscode.addVariableBtn).toBeVisible();
        // Second click — accordion should collapse
        await workflow.jscode.toggleInputValues();
        await expect(workflow.jscode.addVariableBtn).not.toBeVisible();
    });

    // ── TC-JSC-052 ────────────────────────────────────────────────────────────
    test('TC-JSC-052: Variable name with underscores is accepted and added', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await workflow.jscode.fillVariableName('user_name_123');
        await expect(workflow.jscode.addVariableConfirmBtn).toBeEnabled();
        await workflow.jscode.confirmAddVariable();
        await expect(workflow.jscode.variableNameLabel('user_name_123')).toBeVisible();
    });

    // ── TC-JSC-053 ────────────────────────────────────────────────────────────
    test('TC-JSC-053: Variable value textarea accepts multi-line content', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('data');
        await workflow.jscode.fillVariableValue('line1\nline2');
        await expect(workflow.jscode.variableValueAt()).toHaveValue('line1\nline2');
    });

    // ── TC-JSC-054 ────────────────────────────────────────────────────────────
    test('TC-JSC-054: Input Values and Code accordions can both be open simultaneously', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.addVariableBtn).toBeVisible();
        await expect(workflow.jscode.codeEditorTextbox).toBeVisible();
    });

    // ── TC-JSC-055 ────────────────────────────────────────────────────────────
    test('TC-JSC-055: Code editor accepts multi-line JavaScript', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('const x = 1;\nconst y = 2;\nreturn x + y;');
        await expect(workflow.jscode.codeEditor).toContainText('const x = 1;');
        await expect(workflow.jscode.codeEditor).toContainText('return x + y;');
    });

    // ── TC-JSC-056 ────────────────────────────────────────────────────────────
    test('TC-JSC-056: Variable value textarea is empty immediately after adding a variable', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('newVar');
        await expect(workflow.jscode.variableValueAt()).toHaveValue('');
    });

    // ── TC-JSC-057 ────────────────────────────────────────────────────────────
    test('TC-JSC-057: TEST button is disabled by default until code is written', async ({ workflow }) => {
        await expect(workflow.jscode.testButton).toBeDisabled();
    });

    // ── TC-JSC-058 ────────────────────────────────────────────────────────────
    test('TC-JSC-058: Description textarea is empty on initial load', async ({ workflow }) => {
        await expect(workflow.jscode.descriptionTextarea).toBeVisible();
        await expect(workflow.jscode.descriptionTextarea).toHaveValue('');
    });

    // ── TC-JSC-059 ────────────────────────────────────────────────────────────
    test('TC-JSC-059: Three variables can be added — three value inputs appear', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        for (const name of ['alpha', 'beta', 'gamma']) {
            await workflow.jscode.addVariable(name);
        }
        await expect(workflow.jscode.variableValueInputs()).toHaveCount(3);
    });

    // ── TC-JSC-060 ────────────────────────────────────────────────────────────
    test('TC-JSC-060: Clicking a saved JS Code step node re-opens the editor', async ({ workflow }) => {
        await workflow.jscode.save();
        await expect(workflow.jscode.testButton).not.toBeVisible();
        // Click the step node on canvas to re-open the editor
        await workflow.jscode.configureStepNode.first().click();
        await expect(workflow.jscode.testButton).toBeVisible();
    });

    // ── TC-JSC-061 ────────────────────────────────────────────────────────────
    test('TC-JSC-061: TEST button becomes enabled after code is written', async ({ workflow }) => {
        await expect(workflow.jscode.testButton).toBeDisabled();
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('return true');
        await expect(workflow.jscode.testButton).toBeEnabled();
    });

    // ── TC-JSC-062 ────────────────────────────────────────────────────────────
    test('TC-JSC-062: Code editor content can be overwritten with new content', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('return 1');
        await workflow.jscode.overwriteCode('return 2');
        await expect(workflow.jscode.codeEditor).toContainText('return 2');
        await expect(workflow.jscode.codeEditor).not.toContainText('return 1');
    });

    // ── TC-JSC-063 ────────────────────────────────────────────────────────────
    test('TC-JSC-063: Two variable values are stored independently', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('name');
        await workflow.jscode.addVariable('email');
        await workflow.jscode.fillVariableValue('Alice', 0);
        await workflow.jscode.fillVariableValue('alice@test.com', 1);
        await expect(workflow.jscode.variableValueAt(0)).toHaveValue('Alice');
        await expect(workflow.jscode.variableValueAt(1)).toHaveValue('alice@test.com');
    });

    // ── TC-JSC-064 ────────────────────────────────────────────────────────────
    test('TC-JSC-064: Code typed via keyboard appears in the editor', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await workflow.jscode.typeCode('return "hello"');
        await expect(workflow.jscode.codeEditor).toContainText('return "hello"');
    });

    // ── TC-JSC-065 ────────────────────────────────────────────────────────────
    test('TC-JSC-065: Description textarea can be cleared and refilled', async ({ workflow }) => {
        await workflow.jscode.fillDescription('initial text');
        await expect(workflow.jscode.descriptionTextarea).toHaveValue('initial text');
        await workflow.jscode.fillDescription('');
        await expect(workflow.jscode.descriptionTextarea).toHaveValue('');
        await workflow.jscode.fillDescription('updated text');
        await expect(workflow.jscode.descriptionTextarea).toHaveValue('updated text');
    });

    // ── TC-JSC-066 ────────────────────────────────────────────────────────────
    test('TC-JSC-066: Input Values accordion summary contains "Input Values" label', async ({ workflow }) => {
        await expect(workflow.jscode.inputValuesAccordionSummary).toContainText('Input Values');
    });

    // ── TC-JSC-067 ────────────────────────────────────────────────────────────
    test('TC-JSC-067: Add Variable button remains visible after adding first variable', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('first');
        await expect(workflow.jscode.addVariableBtn).toBeVisible();
    });

    // ── TC-JSC-068 ────────────────────────────────────────────────────────────
    test('TC-JSC-068: Add Variable form resets to empty state after cancel', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await workflow.jscode.fillVariableName('abandoned');
        await workflow.jscode.cancelAddVariable();
        // Open form again — name field must be empty and confirm disabled
        await workflow.jscode.clickAddVariable();
        await expect(workflow.jscode.variableNameInput).toHaveValue('');
        await expect(workflow.jscode.addVariableConfirmBtn).toBeDisabled();
    });

    // ── TC-JSC-069 ────────────────────────────────────────────────────────────
    test('TC-JSC-069: Save with a variable and code written — step appears on canvas', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('input1');
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('return input.input1');
        await workflow.jscode.save();
        await expect(workflow.jscode.testButton).not.toBeVisible();
        // Step node always shows 'JS_Code' regardless of saved sub-state
        await expect(workflow.jscode.jsCodeStepNode).toBeVisible();
    });

    // ── TC-JSC-070 ────────────────────────────────────────────────────────────
    test('TC-JSC-070: Code accordion button label shows "Code"', async ({ workflow }) => {
        await expect(workflow.jscode.codeAccordionBtn).toContainText('Code');
    });

    // ── TC-JSC-071 ────────────────────────────────────────────────────────────
    test('TC-JSC-071: Expanding Input Values accordion does not expand Code accordion', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await expect(workflow.jscode.addVariableBtn).toBeVisible();
        await expect(workflow.jscode.codeEditorTextbox).not.toBeVisible();
    });

    // ── TC-JSC-072 ────────────────────────────────────────────────────────────
    test('TC-JSC-072: Expanding Code accordion does not expand Input Values accordion', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.codeEditorTextbox).toBeVisible();
        await expect(workflow.jscode.addVariableBtn).not.toBeVisible();
    });

    // ── TC-JSC-073 ────────────────────────────────────────────────────────────
    test('TC-JSC-073: Variable name label and filled value are both visible after add', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('price');
        await workflow.jscode.fillVariableValue('99.99');
        await expect(workflow.jscode.variableNameLabel('price')).toBeVisible();
        await expect(workflow.jscode.variableValueAt()).toHaveValue('99.99');
    });

    // ── TC-JSC-074 ────────────────────────────────────────────────────────────
    test('TC-JSC-074: Filling description does not expand Input Values accordion', async ({ workflow }) => {
        await workflow.jscode.fillDescription('some description');
        await expect(workflow.jscode.addVariableBtn).not.toBeVisible();
    });

    // ── TC-JSC-075 ────────────────────────────────────────────────────────────
    test('TC-JSC-075: Four variables can be added — four value inputs appear', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        for (const name of ['a', 'b', 'c', 'd']) {
            await workflow.jscode.addVariable(name);
        }
        await expect(workflow.jscode.variableValueInputs()).toHaveCount(4);
    });

    // ── TC-JSC-076 ────────────────────────────────────────────────────────────
    test('TC-JSC-076: Save button displays "Save" text', async ({ workflow }) => {
        await expect(workflow.jscode.saveButton).toContainText('Save');
    });

    // ── TC-JSC-077 ────────────────────────────────────────────────────────────
    test('TC-JSC-077: TEST button displays "Test" text', async ({ workflow }) => {
        await expect(workflow.jscode.testButton).toContainText('Test');
    });

    // ── TC-JSC-078 ────────────────────────────────────────────────────────────
    test('TC-JSC-078: Add Variable confirm button displays "Add" text', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await expect(workflow.jscode.addVariableConfirmBtn).toContainText('Add');
    });

    // ── TC-JSC-079 ────────────────────────────────────────────────────────────
    test('TC-JSC-079: Cancel button displays "Cancel" text', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await expect(workflow.jscode.cancelVariableBtn).toContainText('Cancel');
    });

    // ── TC-JSC-080 ────────────────────────────────────────────────────────────
    test('TC-JSC-080: Both accordions collapse independently after being expanded', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.toggleCode();
        // Collapse Input Values — Code stays open
        await workflow.jscode.toggleInputValues();
        await expect(workflow.jscode.addVariableBtn).not.toBeVisible();
        await expect(workflow.jscode.codeEditorTextbox).toBeVisible();
        // Collapse Code — both now closed
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.codeEditorTextbox).not.toBeVisible();
    });

    // ── TC-JSC-081 ────────────────────────────────────────────────────────────
    test('TC-JSC-081: Single-character variable name is accepted', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('x');
        await expect(workflow.jscode.variableNameLabel('x')).toBeVisible();
        await expect(workflow.jscode.variableValueInputs()).toHaveCount(1);
    });

    // ── TC-JSC-082 ────────────────────────────────────────────────────────────
    test('TC-JSC-082: Variable name containing digits is accepted', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('var123');
        await expect(workflow.jscode.variableNameLabel('var123')).toBeVisible();
    });

    // ── TC-JSC-083 ────────────────────────────────────────────────────────────
    test('TC-JSC-083: Long variable name is accepted and label visible', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('thisIsAVeryLongVariableNameForTesting');
        await expect(workflow.jscode.variableNameLabel('thisIsAVeryLongVariableNameForTesting')).toBeVisible();
    });

    // ── TC-JSC-084 ────────────────────────────────────────────────────────────
    test('TC-JSC-084: Variable value with JSON content is stored correctly', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('config');
        await workflow.jscode.fillVariableValue('{"key":"value","num":42}');
        await expect(workflow.jscode.variableValueAt()).toHaveValue('{"key":"value","num":42}');
    });

    // ── TC-JSC-085 ────────────────────────────────────────────────────────────
    test('TC-JSC-085: Variable value with special characters is stored correctly', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('special');
        await workflow.jscode.fillVariableValue('<div>&amp;"quotes"</div>');
        await expect(workflow.jscode.variableValueAt()).toHaveValue('<div>&amp;"quotes"</div>');
    });

    // ── TC-JSC-086 ────────────────────────────────────────────────────────────
    test('TC-JSC-086: Variable value can be cleared after filling', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('temp');
        await workflow.jscode.fillVariableValue('some data');
        await expect(workflow.jscode.variableValueAt()).toHaveValue('some data');
        await workflow.jscode.fillVariableValue('');
        await expect(workflow.jscode.variableValueAt()).toHaveValue('');
    });

    // ── TC-JSC-087 ────────────────────────────────────────────────────────────
    test('TC-JSC-087: Description with special characters is stored correctly', async ({ workflow }) => {
        await workflow.jscode.fillDescription('Handle <input> & "edge" cases');
        await expect(workflow.jscode.descriptionTextarea).toHaveValue('Handle <input> & "edge" cases');
    });

    // ── TC-JSC-088 ────────────────────────────────────────────────────────────
    test('TC-JSC-088: Description persists after expanding and collapsing Input Values', async ({ workflow }) => {
        await workflow.jscode.fillDescription('persist check');
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.toggleInputValues();
        await expect(workflow.jscode.descriptionTextarea).toHaveValue('persist check');
    });

    // ── TC-JSC-089 ────────────────────────────────────────────────────────────
    test('TC-JSC-089: Description persists after expanding and collapsing Code accordion', async ({ workflow }) => {
        await workflow.jscode.fillDescription('still here');
        await workflow.jscode.toggleCode();
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.descriptionTextarea).toHaveValue('still here');
    });

    // ── TC-JSC-090 ────────────────────────────────────────────────────────────
    test('TC-JSC-090: Code editor textbox is empty on initial expand', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.codeEditorTextbox).toBeVisible();
        await expect(workflow.jscode.codeEditor).not.toContainText('return');
    });

    // ── TC-JSC-091 ────────────────────────────────────────────────────────────
    test('TC-JSC-091: Code with only a comment is accepted in the editor', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('// this is a comment');
        await expect(workflow.jscode.codeEditor).toContainText('// this is a comment');
    });

    // ── TC-JSC-092 ────────────────────────────────────────────────────────────
    test('TC-JSC-092: Code can be cleared after writing — editor no longer contains old text', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('return 99');
        await expect(workflow.jscode.codeEditor).toContainText('return 99');
        await workflow.jscode.clearCode();
        await expect(workflow.jscode.codeEditor).not.toContainText('return 99');
    });

    // ── TC-JSC-093 ────────────────────────────────────────────────────────────
    test('TC-JSC-093: TEST button stays disabled after adding only variables (no code)', async ({ workflow }) => {
        await expect(workflow.jscode.testButton).toBeDisabled();
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('onlyVar');
        await workflow.jscode.fillVariableValue('someValue');
        await expect(workflow.jscode.testButton).toBeDisabled();
    });

    // ── TC-JSC-094 ────────────────────────────────────────────────────────────
    test('TC-JSC-094: Save with only description filled — slider closes, step on canvas', async ({ workflow }) => {
        await workflow.jscode.fillDescription('Description only save');
        await workflow.jscode.save();
        await expect(workflow.jscode.testButton).not.toBeVisible();
        await expect(workflow.jscode.jsCodeStepNode).toBeVisible();
    });

    // ── TC-JSC-095 ────────────────────────────────────────────────────────────
    test('TC-JSC-095: Save with only variables added — slider closes, step on canvas', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('saveVar');
        await workflow.jscode.fillVariableValue('saveVal');
        await workflow.jscode.save();
        await expect(workflow.jscode.testButton).not.toBeVisible();
        await expect(workflow.jscode.jsCodeStepNode).toBeVisible();
    });

    // ── TC-JSC-096 ────────────────────────────────────────────────────────────
    test('TC-JSC-096: Save and re-open — TEST and Save buttons are both visible', async ({ workflow }) => {
        await workflow.jscode.save();
        await expect(workflow.jscode.testButton).not.toBeVisible();
        await workflow.jscode.reopenEditor();
        await expect(workflow.jscode.testButton).toBeVisible();
        await expect(workflow.jscode.saveButton).toBeVisible();
    });

    // ── TC-JSC-097 ────────────────────────────────────────────────────────────
    test('TC-JSC-097: Cancel add variable does not collapse the Input Values accordion', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await workflow.jscode.cancelAddVariable();
        // Accordion should still be expanded — Add Variable button visible
        await expect(workflow.jscode.addVariableBtn).toBeVisible();
    });

    // ── TC-JSC-098 ────────────────────────────────────────────────────────────
    test('TC-JSC-098: Adding a variable after a previous cancel works correctly', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await workflow.jscode.fillVariableName('cancelled');
        await workflow.jscode.cancelAddVariable();
        // Now add a variable successfully
        await workflow.jscode.addVariable('success');
        await expect(workflow.jscode.variableNameLabel('success')).toBeVisible();
        await expect(workflow.jscode.variableValueInputs()).toHaveCount(1);
    });

    // ── TC-JSC-099 ────────────────────────────────────────────────────────────
    test('TC-JSC-099: Variable name input is empty when Add Variable form opens', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.clickAddVariable();
        await expect(workflow.jscode.variableNameInput).toHaveValue('');
    });

    // ── TC-JSC-100 ────────────────────────────────────────────────────────────
    test('TC-JSC-100: After adding a variable the add form closes — name input hidden', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('done');
        await expect(workflow.jscode.variableNameInput).not.toBeVisible();
        await expect(workflow.jscode.addVariableBtn).toBeVisible();
    });

    // ── TC-JSC-101 ────────────────────────────────────────────────────────────
    test('TC-JSC-101: Five variables can be added — five value inputs appear', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        for (const name of ['v1', 'v2', 'v3', 'v4', 'v5']) {
            await workflow.jscode.addVariable(name);
        }
        await expect(workflow.jscode.variableValueInputs()).toHaveCount(5);
    });

    // ── TC-JSC-102 ────────────────────────────────────────────────────────────
    test('TC-JSC-102: Code accordion button remains visible when Input Values is expanded', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await expect(workflow.jscode.codeAccordionBtn).toBeVisible();
    });

    // ── TC-JSC-103 ────────────────────────────────────────────────────────────
    test('TC-JSC-103: Input Values summary remains visible when Code accordion is expanded', async ({ workflow }) => {
        await workflow.jscode.toggleCode();
        await expect(workflow.jscode.inputValuesAccordionSummary).toBeVisible();
    });

    // ── TC-JSC-104 ────────────────────────────────────────────────────────────
    test('TC-JSC-104: Multiple toggle cycles on Input Values accordion (3x open/close)', async ({ workflow }) => {
        for (let i = 0; i < 3; i++) {
            await workflow.jscode.toggleInputValues();
            await expect(workflow.jscode.addVariableBtn).toBeVisible();
            await workflow.jscode.toggleInputValues();
            await expect(workflow.jscode.addVariableBtn).not.toBeVisible();
        }
    });

    // ── TC-JSC-105 ────────────────────────────────────────────────────────────
    test('TC-JSC-105: Multiple toggle cycles on Code accordion (3x open/close)', async ({ workflow }) => {
        for (let i = 0; i < 3; i++) {
            await workflow.jscode.toggleCode();
            await expect(workflow.jscode.codeEditorTextbox).toBeVisible();
            await workflow.jscode.toggleCode();
            await expect(workflow.jscode.codeEditorTextbox).not.toBeVisible();
        }
    });

    // ── TC-JSC-106 ────────────────────────────────────────────────────────────
    test('TC-JSC-106: Variable value textarea is enabled after adding a variable', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('active');
        await expect(workflow.jscode.variableValueAt()).toBeEnabled();
    });

    // ── TC-JSC-107 ────────────────────────────────────────────────────────────
    test('TC-JSC-107: Description textarea is enabled on initial load', async ({ workflow }) => {
        await expect(workflow.jscode.descriptionTextarea).toBeEnabled();
    });

    // ── TC-JSC-108 ────────────────────────────────────────────────────────────
    test('TC-JSC-108: Save button works after multiple accordion interactions', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('interacted');
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('return 1');
        await workflow.jscode.toggleCode();
        await workflow.jscode.save();
        await expect(workflow.jscode.testButton).not.toBeVisible();
        await expect(workflow.jscode.jsCodeStepNode).toBeVisible();
    });

    // ── TC-JSC-109 ────────────────────────────────────────────────────────────
    test('TC-JSC-109: All main panel elements present after adding variables and writing code', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('check');
        await workflow.jscode.fillVariableValue('val');
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('return input.check');
        // All main elements still visible
        await expect(workflow.jscode.descriptionTextarea).toBeVisible();
        await expect(workflow.jscode.inputValuesAccordionSummary).toBeVisible();
        await expect(workflow.jscode.codeAccordionBtn).toBeVisible();
        await expect(workflow.jscode.testButton).toBeVisible();
        await expect(workflow.jscode.saveButton).toBeVisible();
    });

    // ── TC-JSC-110 ────────────────────────────────────────────────────────────
    test('TC-JSC-110: Code and variable content visible simultaneously in their sections', async ({ workflow }) => {
        await workflow.jscode.toggleInputValues();
        await workflow.jscode.addVariable('msg');
        await workflow.jscode.fillVariableValue('hello world');
        await workflow.jscode.toggleCode();
        await workflow.jscode.fillCode('return input.msg');
        // Both sections show their content
        await expect(workflow.jscode.variableValueAt()).toHaveValue('hello world');
        await expect(workflow.jscode.variableNameLabel('msg')).toBeVisible();
        await expect(workflow.jscode.codeEditor).toContainText('return input.msg');
    });

});

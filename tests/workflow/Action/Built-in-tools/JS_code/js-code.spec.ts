import { test, expect } from '../../../../../fixtures/base.fixture';

const PROJECT_ID = '58104';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — opens a fresh JS Code editor for each test
// Flow: project → new flow → webhook trigger → close slider →
//        add-step → select JS Code → close overlay → wait for panel
// ─────────────────────────────────────────────────────────────────────────────
async function setupJsCodeEditor(page: any, dashboard: any, triggers: any) {
    await dashboard.navigateToProject(PROJECT_ID);
    await dashboard.clickCreateNewFlow();
    await triggers.selectWebhookTrigger();
    await triggers.slider.clickClose();
    await page.getByTestId('add-step-button').click();
    await page.getByRole('option', { name: 'JS Code', exact: true }).click();
    // Close the add-step overlay (icon-only button rendered after step selection)
    await page.getByRole('button').filter({ hasText: /^$/ }).first().click();
    await page.getByTestId('dry-run-step-test-button').waitFor({ state: 'visible' });
}

// ─────────────────────────────────────────────────────────────────────────────
// JS Code — focused small test cases
// ─────────────────────────────────────────────────────────────────────────────
test.describe('JS Code — Built-in Tool', () => {

    test.beforeEach(async ({ page, dashboard, triggers }) => {
        await setupJsCodeEditor(page, dashboard, triggers);
    });

    // ── TC-JSC-031 ────────────────────────────────────────────────────────────
    test('TC-JSC-031: JS Code panel shows description, accordions, TEST and SAVE', async ({ page }) => {
        await expect(page.getByRole('textbox', { name: /provide a high-level/i })).toBeVisible();
        await expect(page.getByTestId('input-values-accordion-summary')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Code' })).toBeVisible();
        await expect(page.getByTestId('dry-run-step-test-button')).toBeVisible();
        await expect(page.getByTestId('save-button')).toBeVisible();
    });

    // ── TC-JSC-032 ────────────────────────────────────────────────────────────
    test('TC-JSC-032: Description textarea accepts typed input', async ({ page }) => {
        const textarea = page.getByRole('textbox', { name: /provide a high-level/i });
        await textarea.click();
        await textarea.fill('Validate user input and return result');
        await expect(textarea).toHaveValue('Validate user input and return result');
    });

    // ── TC-JSC-033 ────────────────────────────────────────────────────────────
    test('TC-JSC-033: Input Values accordion expands and shows Add Variable button', async ({ page }) => {
        await page.getByTestId('input-values-accordion-summary').click();
        await expect(page.locator('[data-test-id="add-variable-btn"]')).toBeVisible();
    });

    // ── TC-JSC-034 ────────────────────────────────────────────────────────────
    test('TC-JSC-034: Add Variable form shows name field and Add / Cancel buttons', async ({ page }) => {
        await page.getByTestId('input-values-accordion-summary').click();
        await page.locator('[data-test-id="add-variable-btn"]').click();

        await expect(page.getByTestId('variable-name-input')).toBeVisible();
        await expect(page.locator('[data-test-id="add-variable-confirm-btn"]')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    // ── TC-JSC-035 ────────────────────────────────────────────────────────────
    test('TC-JSC-035: Add button is disabled when variable name is empty', async ({ page }) => {
        await page.getByTestId('input-values-accordion-summary').click();
        await page.locator('[data-test-id="add-variable-btn"]').click();

        await expect(page.getByTestId('variable-name-input')).toBeVisible();
        // Name field is empty by default — confirm button must be disabled
        await expect(page.locator('[data-test-id="add-variable-confirm-btn"]')).toBeDisabled();
    });

    // ── TC-JSC-036 ────────────────────────────────────────────────────────────
    test('TC-JSC-036: Adding a variable creates a value textbox in the accordion', async ({ page }) => {
        await page.getByTestId('input-values-accordion-summary').click();
        await page.locator('[data-test-id="add-variable-btn"]').click();
        await page.getByTestId('variable-name-input').fill('username');
        await page.locator('[data-test-id="add-variable-confirm-btn"]').click();

        // Variable row with a value textbox should appear inside the accordion
        await expect(page.getByTestId('input-values-accordion').getByRole('textbox')).toBeVisible();
    });

    // ── TC-JSC-037 ────────────────────────────────────────────────────────────
    test('TC-JSC-037: Cancelling variable add removes form and restores Add Variable button', async ({ page }) => {
        await page.getByTestId('input-values-accordion-summary').click();
        await page.locator('[data-test-id="add-variable-btn"]').click();

        await expect(page.getByTestId('variable-name-input')).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();

        await expect(page.getByTestId('variable-name-input')).not.toBeVisible();
        await expect(page.locator('[data-test-id="add-variable-btn"]')).toBeVisible();
    });

    // ── TC-JSC-038 ────────────────────────────────────────────────────────────
    test('TC-JSC-038: Code accordion expands and reveals the code editor', async ({ page }) => {
        await page.getByRole('button', { name: 'Code' }).click();
        await expect(
            page.locator('#code-editor').getByRole('textbox').filter({ hasText: /^$/ })
        ).toBeVisible();
    });

    // ── TC-JSC-039 ────────────────────────────────────────────────────────────
    test('TC-JSC-039: Code editor accepts JavaScript input', async ({ page }) => {
        await page.getByRole('button', { name: 'Code' }).click();
        const editor = page.locator('#code-editor').getByRole('textbox').filter({ hasText: /^$/ });
        await editor.click();
        await editor.fill('return true');
        await expect(page.locator('#code-editor')).toContainText('return true');
    });

    // ── TC-JSC-040 ────────────────────────────────────────────────────────────
    test('TC-JSC-040: Save button saves the JS Code step and closes the slider', async ({ page }) => {
        await page.getByTestId('save-button').click();
        // Slider closes after save — TEST button should no longer be visible
        await expect(page.getByTestId('dry-run-step-test-button')).not.toBeVisible();
        // JS Code step node appears on the canvas confirming the step was saved
        await expect(page.getByText('Configure')).toBeVisible();
    });

});

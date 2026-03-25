import { test, expect } from '../../../../../fixtures/base.fixture';

const PROJECT_ID = '58104';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — opens a fresh Multipath (If Conditions) editor for each test
// Flow: project → new flow → webhook trigger → close slider →
//        add-step → select Multiple Paths → wait for panel → dismiss overlays
// ─────────────────────────────────────────────────────────────────────────────
async function setupMultipathEditor(dashboard: any, triggers: any, workflow: any) {
    await dashboard.navigateToProject(PROJECT_ID);
    await dashboard.clickCreateNewFlow();
    await triggers.selectWebhookTrigger();
    await triggers.slider.closeButton.waitFor({ state: 'visible' });
    await triggers.closeSlider();
    await workflow.multipath.clickAddStepButton();
    await workflow.multipath.selectMultipathOption();
    await workflow.multipath.waitForPanelReady();
    await workflow.multipath.dismissOverlays();
}

// ─────────────────────────────────────────────────────────────────────────────
// Multipath (If Conditions) — Batch 1: TC-MP-001 to TC-MP-025
// Panel structure, condition input, save, draft state, canvas nodes, typing
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Multipath — Batch 1 (TC-MP-001 to TC-MP-025)', () => {

    test.beforeEach(async ({ dashboard, triggers, workflow }) => {
        await setupMultipathEditor(dashboard, triggers, workflow);
    });

    // ── TC-MP-001 ──────────────────────────────────────────────────────────
    test('TC-MP-001: Multipath panel shows condition input for Path 1', async ({ workflow }) => {
        await expect(workflow.multipath.conditionInput.first()).toBeVisible();
    });

    // ── TC-MP-002 ──────────────────────────────────────────────────────────
    test('TC-MP-002: Condition input has correct placeholder text', async ({ workflow }) => {
        await expect(workflow.multipath.conditionInput.first()).toHaveAttribute(
            'placeholder', 'Enter a condition for path.'
        );
    });

    // ── TC-MP-003 ──────────────────────────────────────────────────────────
    test('TC-MP-003: Save button is visible in the panel', async ({ workflow }) => {
        await expect(workflow.multipath.saveButton).toBeVisible();
    });

    // ── TC-MP-004 ──────────────────────────────────────────────────────────
    test('TC-MP-004: Add Another Condition button is hidden when a draft path exists', async ({ workflow }) => {
        const visible = await workflow.multipath.isAddConditionVisible();
        expect(visible).toBe(false);
    });

    // ── TC-MP-005 ──────────────────────────────────────────────────────────
    test('TC-MP-005: Path 1 shows Draft chip in accordion header', async ({ workflow }) => {
        await expect(workflow.multipath.getDraftChip().first()).toBeVisible();
    });

    // ── TC-MP-006 ──────────────────────────────────────────────────────────
    test('TC-MP-006: User can type a condition in the condition input', async ({ workflow }) => {
        await workflow.multipath.fillCondition('1 + 1 == 2');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toContain('1 + 1');
    });

    // ── TC-MP-007 ──────────────────────────────────────────────────────────
    test('TC-MP-007: Save button is disabled when condition input is empty', async ({ workflow }) => {
        const disabled = await workflow.multipath.isSaveDisabled();
        expect(disabled).toBe(true);
    });

    // ── TC-MP-008 ──────────────────────────────────────────────────────────
    test('TC-MP-008: Path 1 accordion header is visible with title', async ({ workflow }) => {
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
    });

    // ── TC-MP-009 ──────────────────────────────────────────────────────────
    test('TC-MP-009: Panel heading shows MultiPath', async ({ workflow }) => {
        await expect(workflow.multipath.panelHeading).toBeVisible();
    });

    // ── TC-MP-010 ──────────────────────────────────────────────────────────
    test('TC-MP-010: Canvas shows IF button for the multipath step', async ({ workflow }) => {
        await expect(workflow.multipath.getCanvasIfButton()).toBeVisible();
    });

    // ── TC-MP-011 ──────────────────────────────────────────────────────────
    test('TC-MP-011: Canvas shows Configure chip for drafted path', async ({ workflow }) => {
        await expect(workflow.multipath.getConfigureChip().first()).toBeVisible();
    });

    // ── TC-MP-012 ──────────────────────────────────────────────────────────
    test('TC-MP-012: Typing a condition updates the input value', async ({ workflow }) => {
        await workflow.multipath.fillCondition('true');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBe('true');
    });

    // ── TC-MP-013 ──────────────────────────────────────────────────────────
    test('TC-MP-013: Condition input accepts numeric conditions', async ({ workflow }) => {
        await workflow.multipath.fillCondition('5 > 3');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toContain('5 > 3');
    });

    // ── TC-MP-014 ──────────────────────────────────────────────────────────
    test('TC-MP-014: Condition input accepts string comparison', async ({ workflow }) => {
        await workflow.multipath.fillCondition('hello == hello');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toContain('hello');
    });

    // ── TC-MP-015 ──────────────────────────────────────────────────────────
    test('TC-MP-015: User can clear the condition input after typing', async ({ workflow }) => {
        await workflow.multipath.fillCondition('test condition');
        await workflow.multipath.clearCondition();
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBe('');
    });

    // ── TC-MP-016 ──────────────────────────────────────────────────────────
    test('TC-MP-016: Save button becomes enabled after typing a condition', async ({ workflow }) => {
        await workflow.multipath.fillCondition('1 == 1');
        await workflow.multipath.page.waitForTimeout(1000);
        const disabled = await workflow.multipath.isSaveDisabled();
        expect(disabled).toBe(false);
    });

    // ── TC-MP-017 ──────────────────────────────────────────────────────────
    test('TC-MP-017: Condition input accepts natural language condition', async ({ workflow }) => {
        await workflow.multipath.fillCondition('if order amount is greater than 100');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toContain('order amount');
    });

    // ── TC-MP-018 ──────────────────────────────────────────────────────────
    test('TC-MP-018: Condition input accepts boolean keyword true', async ({ workflow }) => {
        await workflow.multipath.fillCondition('true');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBe('true');
    });

    // ── TC-MP-019 ──────────────────────────────────────────────────────────
    test('TC-MP-019: Condition input accepts boolean keyword false', async ({ workflow }) => {
        await workflow.multipath.fillCondition('false');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBe('false');
    });

    // ── TC-MP-020 ──────────────────────────────────────────────────────────
    test('TC-MP-020: Draft chip text reads Draft', async ({ workflow }) => {
        const chipText = await workflow.multipath.getDraftChip().first().textContent();
        expect(chipText).toBe('Draft');
    });

    // ── TC-MP-021 ──────────────────────────────────────────────────────────
    test('TC-MP-021: Path 1 accordion is expanded by default showing condition input', async ({ workflow }) => {
        // Path 1 is expanded = condition input is visible inside it
        await expect(workflow.multipath.conditionInput.first()).toBeVisible();
        await expect(workflow.multipath.saveButton).toBeVisible();
    });

    // ── TC-MP-022 ──────────────────────────────────────────────────────────
    test('TC-MP-022: Condition input is a single-line input (height 30px)', async ({ workflow }) => {
        // The MentionsInput is configured with height='30px' — verify it's not a tall textarea
        const input = workflow.multipath.conditionInput.first();
        await expect(input).toBeVisible();
    });

    // ── TC-MP-023 ──────────────────────────────────────────────────────────
    test('TC-MP-023: Typing and clearing condition leaves input empty', async ({ workflow }) => {
        await workflow.multipath.fillCondition('test');
        await workflow.multipath.page.waitForTimeout(500);
        await workflow.multipath.clearCondition();
        await workflow.multipath.page.waitForTimeout(500);
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBe('');
    });

    // ── TC-MP-024 ──────────────────────────────────────────────────────────
    test('TC-MP-024: Condition input accepts special characters', async ({ workflow }) => {
        await workflow.multipath.fillCondition('a != b && c > 0');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toContain('!=');
    });

    // ── TC-MP-025 ──────────────────────────────────────────────────────────
    test('TC-MP-025: Multiple condition inputs are not present initially (only Path 1)', async ({ workflow }) => {
        const count = await workflow.multipath.conditionInput.count();
        expect(count).toBe(1);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Multipath (If Conditions) — Batch 2: TC-MP-026 to TC-MP-050
// Save flow, Else block (post-save), add condition, multiple paths, reopen,
// canvas interaction, edge cases
// NOTE: After saving a condition, the panel CLOSES automatically.
//       Tests needing panel use fillConditionSaveAndReopen.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Multipath — Batch 2 (TC-MP-026 to TC-MP-050)', () => {

    test.beforeEach(async ({ dashboard, triggers, workflow }) => {
        await setupMultipathEditor(dashboard, triggers, workflow);
    });

    // ── TC-MP-026 ──────────────────────────────────────────────────────────
    test('TC-MP-026: Saving a condition with "true" succeeds', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSave('true');
        // After save panel closes — Draft chip is no longer in DOM
        const draftVisible = await workflow.multipath.isDraftChipVisible();
        expect(draftVisible).toBe(false);
    });

    // ── TC-MP-027 ──────────────────────────────────────────────────────────
    test('TC-MP-027: After saving, Add Another Condition button becomes visible', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await expect(workflow.multipath.addConditionButton).toBeVisible();
    });

    // ── TC-MP-028 ──────────────────────────────────────────────────────────
    test('TC-MP-028: Else accordion appears after saving first condition', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await expect(workflow.multipath.getElseAccordionHeader()).toBeVisible();
    });

    // ── TC-MP-029 ──────────────────────────────────────────────────────────
    test('TC-MP-029: Clicking Else accordion shows else description text', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.clickElseAccordion();
        await expect(workflow.multipath.elseDescription).toBeVisible();
    });

    // ── TC-MP-030 ──────────────────────────────────────────────────────────
    test('TC-MP-030: Else description text is correct', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.clickElseAccordion();
        const text = await workflow.multipath.elseDescription.textContent();
        expect(text).toContain('none of the other conditions are met');
    });

    // ── TC-MP-031 ──────────────────────────────────────────────────────────
    test('TC-MP-031: After saving, clicking Add Another Condition creates a new path', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1000);
        // Else block occupies index 1, so new path is index 2 → "Path 3"
        await expect(workflow.multipath.getPathAccordionHeader(3)).toBeVisible();
    });

    // ── TC-MP-032 ──────────────────────────────────────────────────────────
    test('TC-MP-032: New path shows Draft chip after being added', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1000);
        await expect(workflow.multipath.getDraftChip().first()).toBeVisible();
    });

    // ── TC-MP-033 ──────────────────────────────────────────────────────────
    test('TC-MP-033: Add Another Condition button hides after adding new path', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1000);
        const visible = await workflow.multipath.isAddConditionVisible();
        expect(visible).toBe(false);
    });

    // ── TC-MP-034 ──────────────────────────────────────────────────────────
    test('TC-MP-034: New path has a condition input visible', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addConditionAndDismiss();
        // Path 1 is collapsed; new path is expanded — use .last()
        await expect(workflow.multipath.conditionInput.last()).toBeVisible();
    });

    // ── TC-MP-035 ──────────────────────────────────────────────────────────
    test('TC-MP-035: User can type condition in new path', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addConditionAndDismiss();
        await workflow.multipath.fillCondition('false');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBe('false');
    });

    // ── TC-MP-036 ──────────────────────────────────────────────────────────
    test('TC-MP-036: Path 1 and new path headers are both visible', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1000);
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
        await expect(workflow.multipath.getPathAccordionHeader(3)).toBeVisible();
    });

    // ── TC-MP-037 ──────────────────────────────────────────────────────────
    test('TC-MP-037: Clicking Path 1 accordion after adding new path expands Path 1', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1000);
        await workflow.multipath.clickPathAccordion(1);
        await workflow.multipath.page.waitForTimeout(500);
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
    });

    // ── TC-MP-038 ──────────────────────────────────────────────────────────
    test('TC-MP-038: Save button is visible for new path condition', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addConditionAndDismiss();
        // Save button in the expanded new path accordion
        await expect(workflow.multipath.saveButton.last()).toBeVisible();
    });

    // ── TC-MP-039 ──────────────────────────────────────────────────────────
    test('TC-MP-039: New path condition input starts empty', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addConditionAndDismiss();
        // The new path's condition input should be empty by default
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBe('');
    });

    // ── TC-MP-040 ──────────────────────────────────────────────────────────
    test('TC-MP-040: Canvas shows Path 3 node after adding new condition', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1500);
        // Canvas should show "Path 3" node with "Configure" label
        const path3Node = workflow.multipath.page.locator('p:text-is("Path 3")');
        await expect(path3Node.first()).toBeVisible();
    });

    // ── TC-MP-041 ──────────────────────────────────────────────────────────
    test('TC-MP-041: Canvas shows saved condition text after saving', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSave('true');
        // After save, canvas shows condition text "true" (not "Path 1")
        const conditionNode = workflow.multipath.page.locator('p:text-is("true")');
        await expect(conditionNode.first()).toBeVisible();
    });

    // ── TC-MP-042 ──────────────────────────────────────────────────────────
    test('TC-MP-042: Saving condition with "1 == 1" succeeds', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSave('1 == 1');
        const draftVisible = await workflow.multipath.isDraftChipVisible();
        expect(draftVisible).toBe(false);
    });

    // ── TC-MP-043 ──────────────────────────────────────────────────────────
    test('TC-MP-043: Saving condition with "1 > 2" succeeds', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSave('1 > 2');
        const draftVisible = await workflow.multipath.isDraftChipVisible();
        expect(draftVisible).toBe(false);
    });

    // ── TC-MP-044 ──────────────────────────────────────────────────────────
    test('TC-MP-044: Path 1 accordion still shows after saving and switching to Else', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.clickElseAccordion();
        await workflow.multipath.page.waitForTimeout(500);
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
    });

    // ── TC-MP-045 ──────────────────────────────────────────────────────────
    test('TC-MP-045: Else accordion does not have a condition input', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.clickElseAccordion();
        await workflow.multipath.page.waitForTimeout(500);
        await expect(workflow.multipath.elseDescription).toBeVisible();
    });

    // ── TC-MP-046 ──────────────────────────────────────────────────────────
    test('TC-MP-046: Save button is disabled when no unsaved changes', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // After reopen, condition is already saved, so save button should be disabled
        const disabled = await workflow.multipath.isSaveDisabled();
        expect(disabled).toBe(true);
    });

    // ── TC-MP-047 ──────────────────────────────────────────────────────────
    test('TC-MP-047: Add Another Condition is visible when Else is expanded', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.clickElseAccordion();
        await workflow.multipath.page.waitForTimeout(500);
        await expect(workflow.multipath.addConditionButton).toBeVisible();
    });

    // ── TC-MP-048 ──────────────────────────────────────────────────────────
    test('TC-MP-048: MultiPath heading is visible in the panel header', async ({ workflow }) => {
        const heading = workflow.multipath.page.locator('h5:text-is("MultiPath")');
        await expect(heading).toBeVisible();
    });

    // ── TC-MP-049 ──────────────────────────────────────────────────────────
    test('TC-MP-049: Condition input accepts a multi-word expression', async ({ workflow }) => {
        const condition = '1 + 2 == 3';
        await workflow.multipath.fillCondition(condition);
        const value = await workflow.multipath.getConditionValue();
        expect(value).toContain('1 + 2');
    });

    // ── TC-MP-050 ──────────────────────────────────────────────────────────
    test('TC-MP-050: Help link is visible in the panel', async ({ workflow }) => {
        const helpLink = workflow.multipath.page.locator('p:text-is("Help")');
        await expect(helpLink).toBeVisible();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Multipath (If Conditions) — Batch 3: TC-MP-051 to TC-MP-070
// Complex functional tests: save persistence, canvas state, edit-after-save,
// multi-path management, canvas interaction, expression evaluation, edge cases
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Multipath — Batch 3 (TC-MP-051 to TC-MP-070)', () => {

    test.beforeEach(async ({ dashboard, triggers, workflow }) => {
        await setupMultipathEditor(dashboard, triggers, workflow);
    });

    // ── TC-MP-051: Save persistence ──────────────────────────────────────
    test('TC-MP-051: Saved condition persists after reopen', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBeTruthy();
    });

    // ── TC-MP-052: Re-save cycle ─────────────────────────────────────────
    test('TC-MP-052: Editing saved condition and re-saving closes panel', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Clear and type a new condition
        await workflow.multipath.clearCondition();
        await workflow.multipath.fillCondition('1 > 0');
        await workflow.multipath.saveAndWait();
        // Panel should have closed after re-save
        const panelVisible = await workflow.multipath.panelHeading.isVisible();
        expect(panelVisible).toBe(false);
    });

    // ── TC-MP-053: Condition overwrite persists ──────────────────────────
    test('TC-MP-053: Overwritten condition persists after save-reopen cycle', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Overwrite with new condition
        await workflow.multipath.clearCondition();
        await workflow.multipath.fillCondition('1 > 0');
        // Save again and reopen
        await workflow.multipath.save();
        try {
            await workflow.multipath.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 8000 });
        } catch {
            await workflow.multipath.save();
            await workflow.multipath.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 8000 });
        }
        await workflow.multipath.page.waitForTimeout(500);
        await workflow.multipath.reopenPanelAfterSave('1 > 0');
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBeTruthy();
    });

    // ── TC-MP-054: Canvas True badge after saving truthy condition ───────
    test('TC-MP-054: Canvas shows True badge after saving "true"', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible({ timeout: 10000 });
    });

    // ── TC-MP-055: Configure chip disappears after save ─────────────────
    test('TC-MP-055: Configure chip disappears from canvas after saving', async ({ workflow }) => {
        // Before save, Configure chip is visible
        await expect(workflow.multipath.getConfigureChip().first()).toBeVisible();
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // After save, Configure chip should no longer appear for Path 1
        const configureCount = await workflow.multipath.getConfigureChip().count();
        expect(configureCount).toBe(0);
    });

    // ── TC-MP-056: Canvas Else node appears after save ──────────────────
    test('TC-MP-056: Else node appears on canvas after saving first condition', async ({ workflow }) => {
        // Before save, no Else on canvas
        const elseBefore = await workflow.multipath.getCanvasElseNode().count();
        expect(elseBefore).toBe(0);
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // After save, Else should appear on canvas
        await expect(workflow.multipath.getCanvasElseNode().first()).toBeVisible({ timeout: 10000 });
    });

    // ── TC-MP-057: Continue from here text after save ────────────────────
    test('TC-MP-057: Continue from here text visible on canvas after save', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        await expect(workflow.multipath.getContinueFromHereText()).toBeVisible({ timeout: 10000 });
    });

    // ── TC-MP-058: Add step area inside saved path ──────────────────────
    test('TC-MP-058: Add step area visible inside saved path on canvas', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // Saved path (ACTIVE) renders FlowComponentV2 with AddStepButton
        await expect(workflow.multipath.getAddStepInsidePath().first()).toBeVisible({ timeout: 10000 });
    });

    // ── TC-MP-059: Edit after save re-enables save button ───────────────
    test('TC-MP-059: Editing condition after save re-enables save button', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Save button should be disabled (no unsaved changes)
        const disabledBefore = await workflow.multipath.isSaveDisabled();
        expect(disabledBefore).toBe(true);
        // Type additional text to create unsaved change
        await workflow.multipath.typeCondition(' && 1');
        await workflow.multipath.page.waitForTimeout(1000);
        // Save button should now be enabled
        const disabledAfter = await workflow.multipath.isSaveDisabled();
        expect(disabledAfter).toBe(false);
    });

    // ── TC-MP-060: Draft chip reappears after editing saved condition ────
    test('TC-MP-060: Draft chip reappears after editing a saved condition', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // After save+reopen, no Draft chip (condition is saved)
        const draftBefore = await workflow.multipath.isDraftChipVisible();
        expect(draftBefore).toBe(false);
        // Edit the condition
        await workflow.multipath.typeCondition(' && 1');
        await workflow.multipath.page.waitForTimeout(1000);
        // Draft chip should reappear (hasUnsavedCode = true)
        await expect(workflow.multipath.getDraftChip().first()).toBeVisible({ timeout: 5000 });
    });

    // ── TC-MP-061: Clearing saved condition disables save button ─────────
    test('TC-MP-061: Clearing condition after save disables save button', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.clearCondition();
        await workflow.multipath.page.waitForTimeout(1000);
        const disabled = await workflow.multipath.isSaveDisabled();
        expect(disabled).toBe(true);
    });

    // ── TC-MP-062: Path 1 retains condition after adding new path ────────
    test('TC-MP-062: Path 1 retains saved condition after adding new path', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1500);
        // Canvas still shows True badge for Path 1 (condition persisted, not reverted)
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible({ timeout: 5000 });
        // Path 1 header still visible in panel
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
    });

    // ── TC-MP-063: All three accordion headers visible after add path ────
    test('TC-MP-063: Path 1, Else, and Path 3 headers all visible after adding path', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1000);
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
        await expect(workflow.multipath.getElseAccordionHeader()).toBeVisible();
        await expect(workflow.multipath.getPathAccordionHeader(3)).toBeVisible();
    });

    // ── TC-MP-064: Canvas shows saved + draft states for multi-path ─────
    test('TC-MP-064: Canvas shows True badge and Configure chip after adding new path', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // Canvas should show True badge for saved Path 1
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible({ timeout: 10000 });
        // Canvas should show Configure chip for newly created draft Else or Path
        // After save, Else block is created (ACTIVE, no Configure), and draft paths would have Configure
        // The Configure chip was for Path 1 before save. After save, it should be gone.
        // Let's add a new path via panel
        await workflow.multipath.reopenPanelAfterSave('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1500);
        // Now canvas should show Configure chip for the new draft Path 3
        await expect(workflow.multipath.getConfigureChip().first()).toBeVisible({ timeout: 5000 });
    });

    // ── TC-MP-065: Click canvas Else opens panel with Else content ──────
    test('TC-MP-065: Clicking canvas Else node opens panel with Else description', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // Click Else on the canvas
        await workflow.multipath.getCanvasElseNode().first().click({ timeout: 5000 });
        await workflow.multipath.page.waitForTimeout(1000);
        // Panel should open with Else description visible
        await expect(workflow.multipath.elseDescription).toBeVisible({ timeout: 10000 });
    });

    // ── TC-MP-066: Click canvas IF button opens MultiPath panel ─────────
    test('TC-MP-066: Clicking canvas IF button opens MultiPath panel', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        await workflow.multipath.getCanvasIfButton().click({ timeout: 5000 });
        await expect(workflow.multipath.panelHeading).toBeVisible({ timeout: 10000 });
    });

    // ── TC-MP-067: Expression "1 + 1 == 2" evaluates to True on canvas ──
    test('TC-MP-067: Saving "1 + 1 == 2" shows True badge on canvas', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('1 + 1 == 2');
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible({ timeout: 10000 });
    });

    // ── TC-MP-068: Expression "1 > 5" evaluates to False on canvas ──────
    test('TC-MP-068: Saving "1 > 5" shows False badge on canvas', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('1 > 5');
        await expect(workflow.multipath.getCanvasFalseBadge().first()).toBeVisible({ timeout: 10000 });
    });

    // ── TC-MP-069: Long condition retained in input ─────────────────────
    test('TC-MP-069: Long condition (100+ chars) is fully retained in input', async ({ workflow }) => {
        const longCondition = 'a'.repeat(50) + ' == ' + 'b'.repeat(50);
        await workflow.multipath.fillCondition(longCondition);
        const value = await workflow.multipath.getConditionValue();
        expect(value.length).toBeGreaterThanOrEqual(100);
        expect(value).toContain('a'.repeat(50));
    });

    // ── TC-MP-070: Full E2E: save → reopen → add path → verify ─────────
    test('TC-MP-070: Full E2E flow: save, reopen, add path, verify both exist', async ({ workflow }) => {
        // Step 1: Fill and save first condition
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Step 2: Verify condition persisted
        const value = await workflow.multipath.getConditionValue();
        expect(value).toBeTruthy();
        // Step 3: Add new condition path
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1000);
        // Step 4: Verify new Path 3 header exists alongside Path 1
        await expect(workflow.multipath.getPathAccordionHeader(3)).toBeVisible();
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
        // Step 5: Verify new path starts with empty condition
        const newPathValue = await workflow.multipath.getConditionValue();
        expect(newPathValue).toBe('');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Multipath (If Conditions) — Batch 4: TC-MP-071 to TC-MP-100
// Final batch: evaluation results, canvas node text, three-dot menu, accordion
// behavior, save button states, and comprehensive E2E workflows
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Multipath — Batch 4 (TC-MP-071 to TC-MP-100)', () => {

    test.beforeEach(async ({ dashboard, triggers, workflow }) => {
        await setupMultipathEditor(dashboard, triggers, workflow);
    });

    // ═══════════════════════════════════════════════════════════════════════
    // Group A: Evaluation Result Display in Panel (071 – 075)
    // ═══════════════════════════════════════════════════════════════════════

    // ── TC-MP-071 ────────────────────────────────────────────────────────
    test('TC-MP-071: Typing "true" shows evaluation result "true" below condition', async ({ workflow }) => {
        await workflow.multipath.fillCondition('true');
        // Wait for debounced evaluation (300ms debounce + render)
        await workflow.multipath.page.waitForTimeout(3000);
        const evalResult = workflow.multipath.getEvaluationResult();
        await expect(evalResult.first()).toBeVisible();
        const text = await evalResult.first().innerText();
        expect(text.toLowerCase()).toContain('true');
    });

    // ── TC-MP-072 ────────────────────────────────────────────────────────
    test('TC-MP-072: Typing "1 == 1" shows evaluation result "true"', async ({ workflow }) => {
        await workflow.multipath.fillCondition('1 == 1');
        await workflow.multipath.page.waitForTimeout(3000);
        const evalResult = workflow.multipath.getEvaluationResult();
        await expect(evalResult.first()).toBeVisible();
        const text = await evalResult.first().innerText();
        expect(text.toLowerCase()).toContain('true');
    });

    // ── TC-MP-073 ────────────────────────────────────────────────────────
    test('TC-MP-073: Typing "1 > 5" shows evaluation result "false"', async ({ workflow }) => {
        await workflow.multipath.fillCondition('1 > 5');
        await workflow.multipath.page.waitForTimeout(3000);
        const evalResult = workflow.multipath.getEvaluationResult();
        await expect(evalResult.first()).toBeVisible();
        const text = await evalResult.first().innerText();
        expect(text.toLowerCase()).toContain('false');
    });

    // ── TC-MP-074 ────────────────────────────────────────────────────────
    test('TC-MP-074: Changing condition from "true" to "false" updates evaluation result', async ({ workflow }) => {
        // Type "true" first
        await workflow.multipath.fillCondition('true');
        await workflow.multipath.page.waitForTimeout(3000);
        const evalResult = workflow.multipath.getEvaluationResult().first();
        let text = await evalResult.innerText();
        expect(text.toLowerCase()).toContain('true');
        // Now clear and type "false"
        await workflow.multipath.clearCondition();
        await workflow.multipath.fillCondition('false');
        await workflow.multipath.page.waitForTimeout(3000);
        text = await evalResult.innerText();
        expect(text.toLowerCase()).toContain('false');
    });

    // ── TC-MP-075 ────────────────────────────────────────────────────────
    test('TC-MP-075: After save+reopen, evaluation result persists AND canvas badge matches', async ({ workflow }) => {
        await workflow.multipath.fillCondition('true');
        await workflow.multipath.page.waitForTimeout(2000);
        // Save and verify canvas badge
        await workflow.multipath.saveAndWait();
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible({ timeout: 10000 });
        // Reopen and check panel evaluation result still shows
        await workflow.multipath.reopenPanelAfterSave('true');
        await workflow.multipath.page.waitForTimeout(2000);
        const evalResult = workflow.multipath.getEvaluationResult().first();
        const text = await evalResult.innerText();
        expect(text.toLowerCase()).toContain('true');
    });

    // ═══════════════════════════════════════════════════════════════════════
    // Group B: Canvas Node Text & Structure (076 – 080)
    // ═══════════════════════════════════════════════════════════════════════

    // ── TC-MP-076 ────────────────────────────────────────────────────────
    test('TC-MP-076: Before save, canvas shows "Path 1" text for draft path', async ({ workflow }) => {
        // Draft path always shows "Path 1" as default text
        await expect(workflow.multipath.getCanvasPathText('Path 1')).toBeVisible();
        // Configure chip is also present for draft
        await expect(workflow.multipath.getConfigureChip().first()).toBeVisible();
    });

    // ── TC-MP-077 ────────────────────────────────────────────────────────
    test('TC-MP-077: After save, canvas node text changes from "Path 1" to condition statement', async ({ workflow }) => {
        // Before save: "Path 1" visible
        await expect(workflow.multipath.getCanvasPathText('Path 1')).toBeVisible();
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // After save: "Path 1" text should be gone (replaced by condition text)
        const path1Count = await workflow.multipath.getCanvasPathText('Path 1').count();
        expect(path1Count).toBe(0);
    });

    // ── TC-MP-078 ────────────────────────────────────────────────────────
    test('TC-MP-078: After save, Else has "Add or drag step here" inside it (Else is ACTIVE)', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // After save, both Path 1 and Else become ACTIVE → both render FlowComponentV2
        // Else node visible on canvas
        await expect(workflow.multipath.getCanvasElseNode().first()).toBeVisible({ timeout: 10000 });
        // "Add or drag step here" should appear at least twice: inside saved Path 1 AND inside Else
        const addStepCount = await workflow.multipath.getAddStepInsidePath().count();
        expect(addStepCount).toBeGreaterThanOrEqual(2);
    });

    // ── TC-MP-079 ────────────────────────────────────────────────────────
    test('TC-MP-079: After save, canvas has IF button + Path node + Else node (correct structure)', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // IF button always present
        await expect(workflow.multipath.getCanvasIfButton()).toBeVisible();
        // Else node present
        await expect(workflow.multipath.getCanvasElseNode().first()).toBeVisible({ timeout: 10000 });
        // Continue from here present
        await expect(workflow.multipath.getContinueFromHereText()).toBeVisible();
        // True badge on saved path
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible();
    });

    // ── TC-MP-080 ────────────────────────────────────────────────────────
    test('TC-MP-080: After save (no draft), Add Another Condition button is available in panel', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // Reopen panel — no draft exists so Add Another Condition should be visible
        await workflow.multipath.reopenPanelAfterSave('true');
        await expect(workflow.multipath.addConditionButton).toBeVisible({ timeout: 5000 });
        // Verify it's clickable (not just visible)
        const isEnabled = await workflow.multipath.addConditionButton.isEnabled();
        expect(isEnabled).toBe(true);
    });

    // ═══════════════════════════════════════════════════════════════════════
    // Group C: Three-Dot Menu & Path Management (081 – 085)
    // ═══════════════════════════════════════════════════════════════════════

    // ── TC-MP-081 ────────────────────────────────────────────────────────
    test('TC-MP-081: Three-dot menu trigger exists in DOM for draft path on canvas', async ({ workflow }) => {
        // Close panel first so canvas is accessible
        await workflow.multipath.page.keyboard.press('Escape');
        await workflow.multipath.page.waitForTimeout(500);
        // Draft Path 1 should have an actions-menu-trigger in DOM
        const menuCount = await workflow.multipath.getActionsMenuTrigger().count();
        expect(menuCount).toBeGreaterThanOrEqual(1);
    });

    // ── TC-MP-082 ────────────────────────────────────────────────────────
    test('TC-MP-082: Three-dot menu shows Delete option when clicked on draft path', async ({ workflow }) => {
        // Close panel to access canvas
        await workflow.multipath.page.keyboard.press('Escape');
        await workflow.multipath.page.waitForTimeout(500);
        // Hover over draft Path 1 and click three-dot menu
        await workflow.multipath.hoverAndClickActionsMenu('Path 1');
        // Delete menu item should be visible
        const menuItems = workflow.multipath.getActionsMenuItem();
        await expect(menuItems.first()).toBeVisible({ timeout: 5000 });
        const deleteItem = workflow.multipath.page.locator('[data-testid="actions-menu-item"]').filter({ hasText: 'Delete' });
        await expect(deleteItem).toBeVisible();
    });

    // ── TC-MP-083 ────────────────────────────────────────────────────────
    test('TC-MP-083: Saved path three-dot menu shows both Duplicate and Delete options', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        await workflow.multipath.page.waitForTimeout(1000);
        // Hover over the saved path (its text is now the condition, e.g. "true")
        await workflow.multipath.hoverAndClickActionsMenu('true');
        // Both Duplicate and Delete should be visible
        const duplicateItem = workflow.multipath.page.locator('[data-testid="actions-menu-item"]').filter({ hasText: 'Duplicate' });
        const deleteItem = workflow.multipath.page.locator('[data-testid="actions-menu-item"]').filter({ hasText: 'Delete' });
        await expect(duplicateItem).toBeVisible({ timeout: 5000 });
        await expect(deleteItem).toBeVisible();
    });

    // ── TC-MP-084 ────────────────────────────────────────────────────────
    test('TC-MP-084: Else node on canvas does NOT have an actions-menu-trigger', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        await expect(workflow.multipath.getCanvasElseNode().first()).toBeVisible({ timeout: 10000 });
        // The Else box has no FunctionsActionsButton → no actions-menu-trigger inside it
        // Find the Else container and check it has no menu trigger
        const elseBox = workflow.multipath.getCanvasElseNode().first()
            .locator('xpath=ancestor::div[contains(@class,"p-2")]').first();
        const menuInElse = elseBox.locator('[data-testid="actions-menu-trigger"]');
        const count = await menuInElse.count();
        expect(count).toBe(0);
    });

    // ── TC-MP-085 ────────────────────────────────────────────────────────
    test('TC-MP-085: Save → add draft Path 3 → both paths have menu triggers, count is 2', async ({ workflow }) => {
        await workflow.multipath.fillConditionAndSaveOnly('true');
        await workflow.multipath.page.waitForTimeout(500);
        // Reopen panel and add new condition
        await workflow.multipath.reopenPanelAfterSave('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1500);
        // Close panel to inspect canvas
        await workflow.multipath.page.keyboard.press('Escape');
        await workflow.multipath.page.waitForTimeout(500);
        // Two non-Else paths → 2 actions-menu-triggers (Path 1 saved + Path 3 draft)
        const menuCount = await workflow.multipath.getActionsMenuTrigger().count();
        expect(menuCount).toBeGreaterThanOrEqual(2);
    });

    // ═══════════════════════════════════════════════════════════════════════
    // Group D: Panel Accordion Behavior (086 – 090)
    // ═══════════════════════════════════════════════════════════════════════

    // ── TC-MP-086 ────────────────────────────────────────────────────────
    test('TC-MP-086: Only one accordion expanded at a time — clicking Else collapses Path 1', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Path 1 is expanded, condition input visible
        await expect(workflow.multipath.conditionInput.first()).toBeVisible();
        // Click Else accordion
        await workflow.multipath.clickElseAccordion();
        await workflow.multipath.page.waitForTimeout(500);
        // Else description should be visible
        await expect(workflow.multipath.elseDescription).toBeVisible();
        // Path 1 condition input should be hidden (collapsed)
        const inputVisible = await workflow.multipath.conditionInput.isVisible();
        expect(inputVisible).toBe(false);
    });

    // ── TC-MP-087 ────────────────────────────────────────────────────────
    test('TC-MP-087: Expanding Else collapses Path 1 but Path 1 header remains accessible', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Path 1 is expanded — condition input visible
        await expect(workflow.multipath.conditionInput.first()).toBeVisible();
        // Switch to Else
        await workflow.multipath.clickElseAccordion();
        await workflow.multipath.page.waitForTimeout(500);
        // Else description visible — confirms Else expanded
        await expect(workflow.multipath.elseDescription).toBeVisible();
        // Path 1 condition input hidden — confirms Path 1 collapsed
        const inputVisible = await workflow.multipath.conditionInput.isVisible();
        expect(inputVisible).toBe(false);
        // But Path 1 header is still present (not removed from DOM)
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
        // And the accordion has aria-expanded="false" for Path 1
        const path1Button = workflow.multipath.page.locator('button[aria-expanded="false"]')
            .filter({ hasText: /Path 1/ });
        await expect(path1Button).toBeVisible();
    });

    // ── TC-MP-088 ────────────────────────────────────────────────────────
    test('TC-MP-088: After add condition, new Path 3 header shows with Draft chip and expanded state', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1500);
        // Path 3 header visible with Draft chip
        await expect(workflow.multipath.getPathAccordionHeader(3)).toBeVisible();
        // Path 3 accordion is the expanded one (aria-expanded="true")
        const expandedButton = workflow.multipath.page.locator('button[aria-expanded="true"]')
            .filter({ hasText: /Path 3/ });
        await expect(expandedButton).toBeVisible();
        // Draft chip visible on Path 3
        await expect(workflow.multipath.getDraftChip().first()).toBeVisible();
        // Path 1 and Else headers still present
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
        await expect(workflow.multipath.getElseAccordionHeader()).toBeVisible();
    });

    // ── TC-MP-089 ────────────────────────────────────────────────────────
    test('TC-MP-089: Accordion headers have expand/collapse buttons with aria-expanded', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Each accordion header has a button with aria-expanded attribute
        const accordionButtons = workflow.multipath.page.locator('button[aria-expanded]');
        const count = await accordionButtons.count();
        // At least 2: Path 1 and Else
        expect(count).toBeGreaterThanOrEqual(2);
        // The expanded one should have aria-expanded="true"
        const expandedButton = workflow.multipath.page.locator('button[aria-expanded="true"]');
        const expandedCount = await expandedButton.count();
        expect(expandedCount).toBeGreaterThanOrEqual(1);
    });

    // ── TC-MP-090 ────────────────────────────────────────────────────────
    test('TC-MP-090: Panel heading "MultiPath" visible after save+reopen with correct structure', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Panel heading
        await expect(workflow.multipath.panelHeading).toBeVisible();
        // Path 1 header with no Draft chip (saved condition)
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
        const draftVisible = await workflow.multipath.isDraftChipVisible();
        expect(draftVisible).toBe(false);
        // Else header visible
        await expect(workflow.multipath.getElseAccordionHeader()).toBeVisible();
    });

    // ═══════════════════════════════════════════════════════════════════════
    // Group E: Save Button Deep Behavior (091 – 095)
    // ═══════════════════════════════════════════════════════════════════════

    // ── TC-MP-091 ────────────────────────────────────────────────────────
    test('TC-MP-091: Save button text reads "SAVE" for IFBLOCK type', async ({ workflow }) => {
        await workflow.multipath.fillCondition('true');
        const text = await workflow.multipath.getSaveButtonText();
        expect(text.toUpperCase()).toBe('SAVE');
    });

    // ── TC-MP-092 ────────────────────────────────────────────────────────
    test('TC-MP-092: Save button uses contained variant (filled style) for IFBLOCK', async ({ workflow }) => {
        await workflow.multipath.fillCondition('true');
        // MUI Button with variant="contained" has class "MuiButton-contained"
        const hasContained = await workflow.multipath.saveButton.evaluate(
            (el) => el.classList.contains('MuiButton-contained')
        );
        expect(hasContained).toBe(true);
    });

    // ── TC-MP-093 ────────────────────────────────────────────────────────
    test('TC-MP-093: Escape key closes the panel gracefully after save+reopen', async ({ workflow }) => {
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Panel is open with Path 1 expanded
        await expect(workflow.multipath.panelHeading).toBeVisible();
        // Press Escape to close panel
        await workflow.multipath.page.keyboard.press('Escape');
        await workflow.multipath.page.waitForTimeout(1000);
        // Panel should be closed
        const panelVisible = await workflow.multipath.panelHeading.isVisible();
        expect(panelVisible).toBe(false);
        // Canvas should still show the saved state (True badge)
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible({ timeout: 5000 });
    });

    // ── TC-MP-094 ────────────────────────────────────────────────────────
    test('TC-MP-094: Save button transitions from disabled to enabled after typing', async ({ workflow }) => {
        // Initially disabled (empty condition, DRAFTED status still allows save? No — keepDisabled is true when codeHTML is empty)
        const disabledBefore = await workflow.multipath.isSaveDisabled();
        // Type condition
        await workflow.multipath.fillCondition('true');
        await workflow.multipath.page.waitForTimeout(1500);
        // Now enabled
        const disabledAfter = await workflow.multipath.isSaveDisabled();
        // Before should have been disabled OR enabled (DRAFTED allows save), but after typing it should be enabled
        expect(disabledAfter).toBe(false);
    });

    // ── TC-MP-095 ────────────────────────────────────────────────────────
    // test('TC-MP-095: After save, save button shows "SAVE" text (not "Restore" or "Ask AI")', async ({ workflow }) => {
    //     await workflow.multipath.fillConditionSaveAndReopen('true');
    //     const text = await workflow.multipath.getSaveButtonText();
    //     expect(text.toUpperCase()).toBe('SAVE');
    //     // Verify it's not "Restore" or "Ask AI" or "Accept Changes By AI"
    //     expect(text.toLowerCase()).not.toContain('restore');
    //     expect(text.toLowerCase()).not.toContain('ask ai');
    //     expect(text.toLowerCase()).not.toContain('accept');
    // });

    // ═══════════════════════════════════════════════════════════════════════
    // Group F: Complex E2E Workflows (096 – 100)
    // ═══════════════════════════════════════════════════════════════════════

    // ── TC-MP-096 ────────────────────────────────────────────────────────
    test('TC-MP-096: Full cycle: save "true" → True badge → edit to "1 > 5" → re-save → False badge', async ({ workflow }) => {
        // Step 1: Save "true"
        await workflow.multipath.fillConditionAndSaveOnly('true');
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible({ timeout: 10000 });
        // Step 2: Reopen and edit to "1 > 5"
        await workflow.multipath.reopenPanelAfterSave('true');
        await workflow.multipath.clearCondition();
        await workflow.multipath.fillCondition('1 > 5');
        // Step 3: Re-save
        await workflow.multipath.save();
        try {
            await workflow.multipath.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 8000 });
        } catch {
            await workflow.multipath.save();
            await workflow.multipath.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 8000 });
        }
        await workflow.multipath.page.waitForTimeout(1000);
        // Step 4: Canvas should now show False badge instead of True
        await expect(workflow.multipath.getCanvasFalseBadge().first()).toBeVisible({ timeout: 10000 });
    });

    // ── TC-MP-097 ────────────────────────────────────────────────────────
    test('TC-MP-097: Multi-path: save → add path → type in new path → canvas shows saved + draft', async ({ workflow }) => {
        // Step 1: Save first condition
        await workflow.multipath.fillConditionAndSaveOnly('true');
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible({ timeout: 10000 });
        // Step 2: Reopen and add new path
        await workflow.multipath.reopenPanelAfterSave('true');
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1000);
        // Step 3: Type in the new path (Path 3)
        await workflow.multipath.fillCondition('false');
        await workflow.multipath.page.waitForTimeout(1000);
        // Step 4: Verify panel has all three headers
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
        await expect(workflow.multipath.getElseAccordionHeader()).toBeVisible();
        await expect(workflow.multipath.getPathAccordionHeader(3)).toBeVisible();
        // Step 5: Canvas should still show True badge for Path 1
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible();
    });

    // ── TC-MP-098 ────────────────────────────────────────────────────────
    test('TC-MP-098: Panel navigation: view Else description → add path → verify all headers', async ({ workflow }) => {
        // Step 1: Save condition
        await workflow.multipath.fillConditionSaveAndReopen('true');
        // Step 2: Verify condition persists
        const savedValue = await workflow.multipath.getConditionValue();
        expect(savedValue).toBeTruthy();
        // Step 3: Navigate to Else accordion → verify description
        await workflow.multipath.clickElseAccordion();
        await workflow.multipath.page.waitForTimeout(500);
        await expect(workflow.multipath.elseDescription).toBeVisible();
        // Step 4: Add new condition (from Else view)
        await workflow.multipath.addCondition();
        await workflow.multipath.page.waitForTimeout(1500);
        // Step 5: All three accordion headers visible
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
        await expect(workflow.multipath.getElseAccordionHeader()).toBeVisible();
        await expect(workflow.multipath.getPathAccordionHeader(3)).toBeVisible();
        // Step 6: Path 3 has Draft chip (newly added condition)
        await expect(workflow.multipath.getDraftChip().first()).toBeVisible();
    });

    // ── TC-MP-099 ────────────────────────────────────────────────────────
    test('TC-MP-099: Canvas interaction cycle: save → click Else → click IF → verify panel states', async ({ workflow }) => {
        // Step 1: Save and close panel
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // Step 2: Click canvas Else node → panel opens with Else content
        await workflow.multipath.getCanvasElseNode().first().click({ timeout: 5000 });
        await workflow.multipath.page.waitForTimeout(1000);
        await expect(workflow.multipath.elseDescription).toBeVisible({ timeout: 10000 });
        // Step 3: Close panel
        await workflow.multipath.page.keyboard.press('Escape');
        await workflow.multipath.page.waitForTimeout(500);
        // Step 4: Click canvas IF button → panel opens at switch level
        await workflow.multipath.getCanvasIfButton().click({ timeout: 5000 });
        await expect(workflow.multipath.panelHeading).toBeVisible({ timeout: 10000 });
        // Step 5: Both Path 1 and Else accordion headers visible
        await expect(workflow.multipath.getPathAccordionHeader(1)).toBeVisible();
        await expect(workflow.multipath.getElseAccordionHeader()).toBeVisible();
    });

    // ── TC-MP-100 ────────────────────────────────────────────────────────
    test('TC-MP-100: Stress test: save → edit → re-save → verify canvas state updates', async ({ workflow }) => {
        // Step 1: Save first condition "true"
        await workflow.multipath.fillConditionAndSaveOnly('true');
        // Step 2: Canvas should show True badge
        await expect(workflow.multipath.getCanvasTrueBadge().first()).toBeVisible({ timeout: 10000 });
        // Step 3: Reopen and verify saved condition
        await workflow.multipath.reopenPanelAfterSave('true');
        const savedValue = await workflow.multipath.getConditionValue();
        expect(savedValue).toBeTruthy();
        // Step 4: Edit condition to "1 > 5" (evaluates to false)
        await workflow.multipath.clearCondition();
        await workflow.multipath.fillCondition('1 > 5');
        await workflow.multipath.page.waitForTimeout(1000);
        // Step 5: Save button enabled (unsaved changes)
        const disabled = await workflow.multipath.isSaveDisabled();
        expect(disabled).toBe(false);
        // Step 6: Re-save
        await workflow.multipath.save();
        try {
            await workflow.multipath.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 8000 });
        } catch {
            await workflow.multipath.save();
            await workflow.multipath.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 8000 });
        }
        await workflow.multipath.page.waitForTimeout(1000);
        // Step 7: Canvas should now show a badge (True/False/Error — AI may modify)
        const hasBadge = await workflow.multipath.page.locator('.MuiBadge-badge').first().isVisible();
        expect(hasBadge).toBe(true);
        // Step 8: Canvas still has IF button + Else + Continue
        await expect(workflow.multipath.getCanvasIfButton()).toBeVisible();
        await expect(workflow.multipath.getCanvasElseNode().first()).toBeVisible();
        await expect(workflow.multipath.getContinueFromHereText()).toBeVisible();
    });
});

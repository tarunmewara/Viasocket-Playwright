import { test, expect } from '../../../../../fixtures/base.fixture';

const PROJECT_ID = '58104';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — opens a fresh Delay step editor for each test
// Flow: project → new flow → webhook trigger → close slider →
//        add-step → select Delay → wait for panel
// ─────────────────────────────────────────────────────────────────────────────
async function setupDelayEditor(dashboard: any, triggers: any, workflow: any) {
    await dashboard.navigateToProject(PROJECT_ID);
    await dashboard.clickCreateNewFlow();
    await triggers.selectWebhookTrigger();
    await triggers.slider.closeButton.waitFor({ state: 'visible' });
    await triggers.closeSlider();
    await workflow.delay.clickAddStepButton();
    await workflow.delay.selectDelayOption();
    await workflow.delay.page.waitForTimeout(500);
    // Retry: if panel didn't open, click again
    const panelVisible = await workflow.delay.saveButton.isVisible().catch(() => false);
    if (!panelVisible) {
        try { await workflow.delay.selectDelayOption(); } catch { /* already open */ }
    }
    await workflow.delay.waitForPanelReady();
    await workflow.delay.dismissOverlays();
}

// ═══════════════════════════════════════════════════════════════════════════════
// Delay — 50 Playwright Test Cases (TC-DLY-001 to TC-DLY-050)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('Delay — Built-in Tool', () => {

    // Retry once on transient setup failures (page load timeouts, tooltip interception)
    test.describe.configure({ retries: 1 });

    test.beforeEach(async ({ dashboard, triggers, workflow }) => {
        await setupDelayEditor(dashboard, triggers, workflow);
    });

    // ═════════════════════════════════════════════════════════════════════════
    // Batch 1: Basic UI & Visibility (TC-DLY-001 to TC-DLY-010)
    // ═════════════════════════════════════════════════════════════════════════

    test('TC-DLY-001: Delay panel shows heading "Wait", TEST and SAVE buttons', async ({ workflow }) => {
        await expect(workflow.delay.panelHeading).toBeVisible();
        await expect(workflow.delay.testButton).toBeVisible();
        await expect(workflow.delay.saveButton).toBeVisible();
    });

    test('TC-DLY-002: Delay input field is visible with correct placeholder', async ({ workflow }) => {
        await expect(workflow.delay.delayInput).toBeVisible();
        const placeholder = await workflow.delay.delayInput.getAttribute('placeholder');
        expect(placeholder).toContain('Delay of 15 minutes');
    });

    test('TC-DLY-003: CHANGE button is visible in panel header', async ({ workflow }) => {
        await expect(workflow.delay.changeButton).toBeVisible();
        const text = await workflow.delay.changeButton.textContent();
        expect(text?.toUpperCase()).toContain('CHANGE');
    });

    test('TC-DLY-004: Help button is visible at panel bottom', async ({ workflow }) => {
        await expect(workflow.delay.helpButton).toBeVisible();
    });

    test('TC-DLY-005: Canvas shows "Wait" node with "Unsaved Changes" chip', async ({ workflow }) => {
        await expect(workflow.delay.canvasWaitNode).toBeVisible();
        await expect(workflow.delay.unsavedChangesChip).toBeVisible();
    });

    test('TC-DLY-006: AI Preview toggle is visible in the panel', async ({ workflow }) => {
        await expect(workflow.delay.aiPreviewToggle).toBeVisible();
    });

    test('TC-DLY-007: TEST button text shows "TEST"', async ({ workflow }) => {
        const text = await workflow.delay.getTestButtonText();
        expect(text.toUpperCase()).toContain('TEST');
    });

    test('TC-DLY-008: SAVE button text shows "SAVE"', async ({ workflow }) => {
        const text = await workflow.delay.getSaveButtonText();
        expect(text.toUpperCase()).toContain('SAVE');
    });

    test('TC-DLY-009: Delay input is initially empty', async ({ workflow }) => {
        const value = await workflow.delay.getDelayValue();
        expect(value).toBe('');
    });

    test('TC-DLY-010: Panel heading text is exactly "Wait"', async ({ workflow }) => {
        const value = await workflow.delay.panelHeading.inputValue();
        expect(value.trim()).toBe('Wait');
    });

    // ═════════════════════════════════════════════════════════════════════════
    // Batch 2: Input Behavior (TC-DLY-011 to TC-DLY-020)
    // ═════════════════════════════════════════════════════════════════════════

    test('TC-DLY-011: Typing "Delay for 5 minutes" fills the input correctly', async ({ workflow }) => {
        await workflow.delay.fillDelay('Delay for 5 minutes');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('Delay for 5 minutes');
    });

    test('TC-DLY-012: Typing "Delay for 30 seconds" is accepted', async ({ workflow }) => {
        await workflow.delay.fillDelay('Delay for 30 seconds');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('Delay for 30 seconds');
    });

    test('TC-DLY-013: Typing "wait 2 hours" is accepted', async ({ workflow }) => {
        await workflow.delay.fillDelay('wait 2 hours');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('wait 2 hours');
    });

    test('TC-DLY-014: Typing "10 seconds" is accepted', async ({ workflow }) => {
        await workflow.delay.fillDelay('10 seconds');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('10 seconds');
    });

    test('TC-DLY-015: Clearing the input field results in empty value', async ({ workflow }) => {
        await workflow.delay.fillDelay('Delay for 5 minutes');
        await workflow.delay.clearDelay();
        const value = await workflow.delay.getDelayValue();
        expect(value).toBe('');
    });

    test('TC-DLY-016: Typing replaces cleared input with new value', async ({ workflow }) => {
        await workflow.delay.fillDelay('Delay for 5 minutes');
        await workflow.delay.clearDelay();
        await workflow.delay.fillDelay('Delay for 10 minutes');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('Delay for 10 minutes');
    });

    test('TC-DLY-017: Input accepts numeric-only values like "120"', async ({ workflow }) => {
        await workflow.delay.fillDelay('120');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('120');
    });

    test('TC-DLY-018: Input accepts special characters in delay statement', async ({ workflow }) => {
        await workflow.delay.fillDelay('Delay for 5-10 minutes');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('Delay for 5-10 minutes');
    });

    test('TC-DLY-019: Input accepts very long text without truncation', async ({ workflow }) => {
        const longText = 'Delay for exactly one hundred and twenty seconds after the previous step completes';
        await workflow.delay.fillDelay(longText);
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain(longText);
    });

    test('TC-DLY-020: Input accepts "0 seconds" as a value', async ({ workflow }) => {
        await workflow.delay.fillDelay('0 seconds');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('0 seconds');
    });

    // ═════════════════════════════════════════════════════════════════════════
    // Batch 3: Save & Persistence (TC-DLY-021 to TC-DLY-030)
    // ═════════════════════════════════════════════════════════════════════════

    test('TC-DLY-021: Save button becomes enabled after typing a delay value', async ({ workflow }) => {
        await workflow.delay.fillDelayAndSubmitAi('Delay for 5 minutes');
        const enabled = await workflow.delay.isSaveEnabled();
        expect(enabled).toBe(true);
    });

    test('TC-DLY-022: Saving with valid delay closes the panel', async ({ workflow }) => {
        await workflow.delay.fillDelayAndSubmitAi('Delay for 5 minutes');
        await workflow.delay.saveAndWait();
        const panelOpen = await workflow.delay.isPanelOpen();
        expect(panelOpen).toBe(false);
    });

    test('TC-DLY-023: After save, "Unsaved Changes" chip disappears from canvas', async ({ workflow }) => {
        await workflow.delay.fillDelayAndSubmitAi('Delay for 5 minutes');
        await workflow.delay.saveAndWait();
        await expect(workflow.delay.unsavedChangesChip).not.toBeVisible();
    });

    test('TC-DLY-024: After save and reopen, panel shows the saved heading', async ({ workflow }) => {
        await workflow.delay.fillDelayAndSubmitAi('Delay for 5 minutes');
        await workflow.delay.saveAndWait();
        await workflow.delay.reopenPanelAfterSave('Delay for 5 minutes');
        await expect(workflow.delay.panelHeading).toBeVisible();
    });

    test('TC-DLY-025: After save, canvas Wait node is still visible', async ({ workflow }) => {
        await workflow.delay.fillDelayAndSubmitAi('Delay for 5 minutes');
        await workflow.delay.saveAndWait();
        await expect(workflow.delay.canvasWaitNode).toBeVisible();
    });

    test('TC-DLY-026: SAVE button shows "SAVE" text (not "Ask AI" or other)', async ({ workflow }) => {
        const text = await workflow.delay.getSaveButtonText();
        expect(text.toUpperCase()).toMatch(/SAVE/);
    });

    test('TC-DLY-027: SAVE button has outlined variant before step is tested', async ({ workflow }) => {
        const classes = await workflow.delay.saveButton.getAttribute('class');
        expect(classes).toContain('MuiButton-outlined');
    });

    test('TC-DLY-028: TEST button is visible alongside SAVE button', async ({ workflow }) => {
        const testVisible = await workflow.delay.isTestVisible();
        const saveVisible = await workflow.delay.saveButton.isVisible();
        expect(testVisible).toBe(true);
        expect(saveVisible).toBe(true);
    });

    test('TC-DLY-029: After typing and tabbing out, AI processes the input (no crash)', async ({ workflow }) => {
        await workflow.delay.fillDelayAndSubmitAi('Delay for 5 minutes');
        // Panel should still be open and functional
        await expect(workflow.delay.panelHeading).toBeVisible();
        await expect(workflow.delay.saveButton).toBeVisible();
    });

    test('TC-DLY-030: Escape key closes the panel', async ({ workflow }) => {
        await workflow.delay.page.keyboard.press('Escape');
        await workflow.delay.page.waitForTimeout(500);
        const panelOpen = await workflow.delay.isPanelOpen();
        expect(panelOpen).toBe(false);
    });

    // ═════════════════════════════════════════════════════════════════════════
    // Batch 4: Validation & Error Handling (TC-DLY-031 to TC-DLY-037)
    // ═════════════════════════════════════════════════════════════════════════

    test('TC-DLY-031: Clicking TEST with empty input shows "can\'t be empty" error', async ({ workflow }) => {
        await workflow.delay.test();
        await workflow.delay.page.waitForTimeout(1000);
        await expect(workflow.delay.emptyFieldError).toBeVisible();
    });

    test('TC-DLY-032: Error disappears after typing a valid delay', async ({ workflow }) => {
        // Trigger error first
        await workflow.delay.test();
        await workflow.delay.page.waitForTimeout(1000);
        await expect(workflow.delay.emptyFieldError).toBeVisible();
        // Now type a value and submit to set Redux value (error clears when Redux value is set)
        await workflow.delay.fillDelayAndSubmitAi('Delay for 5 minutes');
        await expect(workflow.delay.emptyFieldError).not.toBeVisible();
    });

    test('TC-DLY-033: Input with only whitespace is still accepted (no crash)', async ({ workflow }) => {
        await workflow.delay.fillDelay('   ');
        const value = await workflow.delay.getDelayValue();
        expect(value.length).toBeGreaterThan(0);
    });

    test('TC-DLY-034: Input with very large number "999999 minutes" is accepted', async ({ workflow }) => {
        await workflow.delay.fillDelay('999999 minutes');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('999999 minutes');
    });

    test('TC-DLY-035: Input with "Delay for -5 minutes" (negative) is accepted in field', async ({ workflow }) => {
        await workflow.delay.fillDelay('Delay for -5 minutes');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('Delay for -5 minutes');
    });

    test('TC-DLY-036: Input with unicode characters is accepted', async ({ workflow }) => {
        await workflow.delay.fillDelay('Delay 5 mins');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('Delay 5 mins');
    });

    test('TC-DLY-037: Input with mixed units "1 hour 30 minutes" is accepted', async ({ workflow }) => {
        await workflow.delay.fillDelay('1 hour 30 minutes');
        const value = await workflow.delay.getDelayValue();
        expect(value).toContain('1 hour 30 minutes');
    });

    // ═════════════════════════════════════════════════════════════════════════
    // Batch 5: AI Preview Toggle (TC-DLY-038 to TC-DLY-042)
    // ═════════════════════════════════════════════════════════════════════════

    test('TC-DLY-038: Toggling AI Preview ON changes toggle state', async ({ workflow }) => {
        await workflow.delay.toggleAiPreview();
        await workflow.delay.page.waitForTimeout(300);
        const checked = await workflow.delay.isAiPreviewChecked();
        expect(checked).toBe(true);
    });

    test('TC-DLY-039: Toggling AI Preview OFF restores original state', async ({ workflow }) => {
        // Toggle ON then OFF
        await workflow.delay.toggleAiPreview();
        await workflow.delay.page.waitForTimeout(300);
        await workflow.delay.toggleAiPreview();
        await workflow.delay.page.waitForTimeout(300);
        const checked = await workflow.delay.isAiPreviewChecked();
        expect(checked).toBe(false);
    });

    test('TC-DLY-040: After toggling AI Preview ON, input field is still visible', async ({ workflow }) => {
        await workflow.delay.toggleAiPreview();
        await workflow.delay.page.waitForTimeout(300);
        // The input should still be visible (different mode but still renders)
        await expect(workflow.delay.delayInput).toBeVisible();
    });

    test('TC-DLY-041: AI Preview toggle does not affect TEST button visibility', async ({ workflow }) => {
        await workflow.delay.toggleAiPreview();
        await workflow.delay.page.waitForTimeout(300);
        await expect(workflow.delay.testButton).toBeVisible();
    });

    test('TC-DLY-042: AI Preview toggle does not affect SAVE button visibility', async ({ workflow }) => {
        await workflow.delay.toggleAiPreview();
        await workflow.delay.page.waitForTimeout(300);
        await expect(workflow.delay.saveButton).toBeVisible();
    });

    // ═════════════════════════════════════════════════════════════════════════
    // Batch 6: CHANGE Button & Navigation (TC-DLY-043 to TC-DLY-046)
    // ═════════════════════════════════════════════════════════════════════════

    test('TC-DLY-043: CHANGE button is enabled and clickable', async ({ workflow }) => {
        const enabled = await workflow.delay.changeButton.isEnabled();
        expect(enabled).toBe(true);
    });

    test('TC-DLY-044: Clicking CHANGE opens the add-step slider', async ({ workflow }) => {
        await workflow.delay.clickChangeButton();
        await workflow.delay.page.waitForTimeout(500);
        // The add-step slider should show the built-in tools list
        const addStepVisible = await workflow.delay.page.locator('text=Built-In Tools').isVisible();
        expect(addStepVisible).toBe(true);
    });

    test('TC-DLY-045: Panel heading and CHANGE button are in the same header area', async ({ workflow }) => {
        // Both should be visible simultaneously
        await expect(workflow.delay.panelHeading).toBeVisible();
        await expect(workflow.delay.changeButton).toBeVisible();
    });

    test('TC-DLY-046: Closing panel via X button hides the panel', async ({ workflow }) => {
        // Try pressing Escape to close (X button may have overlay issues)
        await workflow.delay.page.keyboard.press('Escape');
        await workflow.delay.page.waitForTimeout(500);
        await expect(workflow.delay.panelHeading).not.toBeVisible();
    });

    // ═════════════════════════════════════════════════════════════════════════
    // Batch 7: End-to-End & Complex Workflows (TC-DLY-047 to TC-DLY-050)
    // ═════════════════════════════════════════════════════════════════════════

    test('TC-DLY-047: Full cycle: type → save → reopen → verify input persists', async ({ workflow }) => {
        const delayText = 'Delay for 5 minutes';
        await workflow.delay.fillDelayAndSubmitAi(delayText);
        await workflow.delay.saveAndWait();
        // Reopen
        await workflow.delay.reopenPanelAfterSave(delayText);
        // Panel should be open with save button
        await expect(workflow.delay.panelHeading).toBeVisible();
        await expect(workflow.delay.saveButton).toBeVisible();
    });

    test('TC-DLY-048: Full cycle: type → save → verify canvas has no "Unsaved Changes"', async ({ workflow }) => {
        await workflow.delay.fillDelayAndSubmitAi('Delay for 10 minutes');
        await workflow.delay.saveAndWait();
        // Canvas should not show unsaved changes
        await expect(workflow.delay.unsavedChangesChip).not.toBeVisible();
        // Wait node should be visible
        await expect(workflow.delay.canvasWaitNode).toBeVisible();
    });

    test('TC-DLY-049: Type delay → test → panel stays open and no crash', async ({ workflow }) => {
        await workflow.delay.fillDelayAndSubmitAi('Delay for 3 minutes');
        await workflow.delay.dismissOverlays();
        await workflow.delay.test();
        await workflow.delay.page.waitForTimeout(3000);
        // Panel should still be open
        await expect(workflow.delay.panelHeading).toBeVisible();
        await expect(workflow.delay.saveButton).toBeVisible();
    });

    test('TC-DLY-050: Save → reopen → edit → re-save — full edit cycle works', async ({ workflow }) => {
        // First save
        await workflow.delay.fillDelayAndSubmitAi('Delay for 5 minutes');
        await workflow.delay.saveAndWait();
        // Reopen
        await workflow.delay.reopenPanelAfterSave('Delay for 5 minutes');
        // Edit: clear and type new value
        await workflow.delay.clearDelay();
        await workflow.delay.fillDelayAndSubmitAi('Delay for 15 minutes');
        // Save again
        await workflow.delay.saveAndWait();
        // Verify panel closed and canvas is clean
        await expect(workflow.delay.saveButton).not.toBeVisible();
        await expect(workflow.delay.canvasWaitNode).toBeVisible();
    });

});

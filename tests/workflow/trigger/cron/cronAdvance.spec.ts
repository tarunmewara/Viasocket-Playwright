import { test, expect } from '../../../../fixtures/base.fixture';

test.describe('Cron Trigger — Get Data & Advance Config', () => {

    test.beforeEach(async ({ dashboard }) => {
        await dashboard.navigateToProject('58104');
        await dashboard.clickCreateNewFlow();
    });

    // Helper: add a cron trigger, save it, then click the cron canvas node to open the slider.
    async function setupSavedCron({ triggers, workflow }: any) {
        await triggers.selectCronTrigger();
        await triggers.cron.fillStatement('Every day at 9am');
        await triggers.cron.cronInput.press('Tab');
        await triggers.cron.save();

        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();
    }

    // ------------------------------------------------------------------ //
    // Test 1: Get Data button is visible in the cron slider               //
    // ------------------------------------------------------------------ //
    test('get data button is visible in cron slider', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await expect(triggers.cron.getDataButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 2: Clicking Get Data opens the selecttriggerforcron slider     //
    // ------------------------------------------------------------------ //
    test('clicking get data opens selecttriggerforcron slider', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await triggers.cron.getDataButton.click();

        // AddStepSlider renders with trigger-search-input
        await expect(triggers.triggerSearchInput).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 3: Builtin tool options are visible in the Get Data slider     //
    // ------------------------------------------------------------------ //
    test('builtin tools are visible in get data slider', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await triggers.cron.getDataButton.click();
        await expect(triggers.triggerSearchInput).toBeVisible();

        // At least one builtin tool option should be visible
        await expect(triggers.builtinToolOption.first()).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 4: Clicking first builtin tool opens the cron pre-process config
    // ------------------------------------------------------------------ //
    test('clicking first builtin tool opens cron pre-process config', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await triggers.cron.getDataButton.click();
        await expect(triggers.builtinToolOption.first()).toBeVisible();

        // Click the first builtin tool (e.g. function / API step)
        await triggers.builtinToolOption.first().click();

        // Pre-process config opens — the selecttriggerforcron search is no longer shown
        await expect(triggers.triggerSearchInput).not.toBeVisible();

        // A save button for the pre-process step should appear
        await expect(triggers.cron.saveButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 5: Saving pre-process step opens hit flow individually slider  //
    // ------------------------------------------------------------------ //
    test('saving pre-process step opens hit flow individually slider', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await triggers.cron.getDataButton.click();
        await expect(triggers.builtinToolOption.first()).toBeVisible();
        await triggers.builtinToolOption.first().click();

        // Wait for save button and save the pre-process step
        await expect(triggers.cron.saveButton).toBeVisible();
        await expect(triggers.cron.saveButton).toBeEnabled();
        await triggers.cron.saveButton.click();

        // After save, advance config automatically navigates to hit flow individually
        await expect(triggers.cron.cronAdvanceConfigSlider).toBeVisible();
        await expect(triggers.cron.hitFlowIndividuallyAccordion).toBeVisible();
        await expect(triggers.cron.hitFlowIndividuallySwitch).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 6: Toggle Run flow one by one switch enables loop              //
    // ------------------------------------------------------------------ //
    test('toggle run flow one by one switch enables loop', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await triggers.cron.getDataButton.click();
        await expect(triggers.builtinToolOption.first()).toBeVisible();
        await triggers.builtinToolOption.first().click();

        await expect(triggers.cron.saveButton).toBeEnabled();
        await triggers.cron.saveButton.click();

        // Hit flow individually slider is open
        await expect(triggers.cron.hitFlowIndividuallySwitch).toBeVisible();

        // Switch should start as OFF (unchecked)
        const switchInput = triggers.cron.hitFlowIndividuallySwitch.locator('input');
        await expect(switchInput).not.toBeChecked();

        // Toggle ON
        await triggers.cron.hitFlowIndividuallySwitch.click();

        // Switch should now be checked
        await expect(switchInput).toBeChecked();
    });

    // ------------------------------------------------------------------ //
    // Test 7: Preprocess step node visible in cron slider after saving     //
    // ------------------------------------------------------------------ //
    test('preprocess step node visible in cron slider after saving', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await triggers.cron.getDataButton.click();
        await expect(triggers.builtinToolOption.first()).toBeVisible();
        await triggers.builtinToolOption.first().click();

        await expect(triggers.cron.saveButton).toBeEnabled();
        await triggers.cron.saveButton.click();

        // Advance config slider opens — close it entirely
        await expect(triggers.cron.cronAdvanceConfigSlider).toBeVisible();
        await triggers.slider.clickClose();

        // Re-open cron slider from the canvas node
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // cron-preprocess-step node must now be visible inside the cron slider
        await expect(triggers.cron.cronPreprocessStep).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 8: Loop step node visible in cron slider after enabling loop    //
    // ------------------------------------------------------------------ //
    test('loop step node visible in cron slider after enabling loop switch', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await triggers.cron.getDataButton.click();
        await expect(triggers.builtinToolOption.first()).toBeVisible();
        await triggers.builtinToolOption.first().click();

        await expect(triggers.cron.saveButton).toBeEnabled();
        await triggers.cron.saveButton.click();

        // Enable loop in advance config
        await expect(triggers.cron.hitFlowIndividuallySwitch).toBeVisible();
        await triggers.cron.hitFlowIndividuallySwitch.click();

        // Close advance config slider
        await triggers.slider.clickClose();

        // Re-open cron slider from the canvas node
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // cron-loop-step node must now be visible inside the cron slider
        await expect(triggers.cron.cronLoopStep).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 9: Closing advance config slider works                         //
    // ------------------------------------------------------------------ //
    test('advance config slider can be closed', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await triggers.cron.getDataButton.click();
        await expect(triggers.builtinToolOption.first()).toBeVisible();
        await triggers.builtinToolOption.first().click();

        await expect(triggers.cron.saveButton).toBeEnabled();
        await triggers.cron.saveButton.click();

        // Advance config slider is open
        await expect(triggers.cron.cronAdvanceConfigSlider).toBeVisible();

        // Close it
        await triggers.slider.clickClose();

        // Advance config slider should be dismissed
        await expect(triggers.cron.cronAdvanceConfigSlider).not.toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 10: Pre-condition switch visible in advance config slider       //
    // ------------------------------------------------------------------ //
    test('pre-condition switch visible in advance config slider', async ({ triggers, workflow }) => {
        await setupSavedCron({ triggers, workflow });

        await triggers.cron.getDataButton.click();
        await expect(triggers.builtinToolOption.first()).toBeVisible();
        await triggers.builtinToolOption.first().click();

        await expect(triggers.cron.saveButton).toBeEnabled();
        await triggers.cron.saveButton.click();

        // Advance config slider is open — pre-condition switch must be present
        await expect(triggers.cron.cronAdvanceConfigSlider).toBeVisible();
        await expect(triggers.cron.preConditionSwitch).toBeVisible();
    });

});

import { test, expect } from '../../fixtures/base.fixture';

test.describe('Workflow Trigger Tests', () => {

    // Navigate directly to the project dashboard — no org-selection flow needed
    test.beforeEach(async ({ dashboard }) => {
        await dashboard.navigateToProject('58104');
        await dashboard.clickCreateNewFlow();
    });

    // ------------------------------------------------------------------ //
    // Test 1: Add webhook trigger                                         //
    // ------------------------------------------------------------------ //
    test('Add trigger - set webhook', async ({ workflow, triggers }) => {
        // Trigger selection slider is auto-opened for a new flow
        await triggers.selectWebhookTrigger();

        // After selecting webhook the slider navigates to webhook config —
        // the trigger option list should no longer be visible
        await expect(triggers.triggerOption.first()).not.toBeVisible();

        // Go Live button must be visible after trigger is set
        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

   
    // ------------------------------------------------------------------ //
    // Test 3: Add cron trigger with a random time interval               //
    // ------------------------------------------------------------------ //
    test('Add trigger - set cron with random time interval', async ({ workflow, triggers }) => {
        // Generate a random minute value to produce a unique natural-language schedule
        const randomMinutes = Math.floor(Math.random() * 55) + 5; // 5–59
        const cronStatement = `Every ${randomMinutes} minutes`;

        // Select cron from the trigger selection list
        await triggers.selectCronTrigger();

        // Cron config slider opens — fill in the natural-language time interval
        await triggers.cron.cronInput.fill(cronStatement);

        // Save the cron trigger
        await triggers.cron.save();

        // Go Live button must be visible after cron trigger is saved
        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 4: Add email to flow as trigger                               //
    // ------------------------------------------------------------------ //
    test('Add trigger - set email to flow', async ({ workflow, triggers }) => {
        // Select email from the trigger selection list
        // (email is only available / not disabled on a brand-new flow with no trigger type set)
        await triggers.selectEmailTrigger();

        // After selecting email the slider navigates to email config —
        // the trigger option list should no longer be visible
        await expect(triggers.triggerOption.first()).not.toBeVisible();

        // Go Live button must be visible after email trigger is set
        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

});

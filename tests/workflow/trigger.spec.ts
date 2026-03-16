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
        // Pool of natural-language cron statements (includes edge cases and unanswerable inputs)
        const cronStatements = [
            'Run every 7 minutes between 9 AM and 5 PM on weekdays',
            'Run at 10:15 AM on the 1st and 15th of every month',
            'Run every 30 minutes between 6 PM and 11 PM daily',
            'Run every 10 minutes during January and February',
            'Run at 12:05 AM every day except Sunday',
            'Run every 15 minutes between 2 PM and 4 PM on the 1st day of every month',
            'Run every hour at the 17th minute',
            'Run every day at 11:59 PM',
        ];
        const cronStatement = cronStatements[Math.floor(Math.random() * cronStatements.length)];

        // Select cron from the trigger selection list
        await triggers.selectCronTrigger();

        // Cron config slider opens — fill in the natural-language time interval
        await triggers.cron.cronInput.fill(cronStatement);

        // Press Tab to dismiss autocomplete suggestions before saving
        await triggers.cron.cronInput.press('Tab');

        await triggers.cron.save();

        // Go Live button must be visible after cron trigger is saved
        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

    // ---------------------------- -------------------------------------- //
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

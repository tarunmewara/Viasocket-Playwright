import { test, expect } from '../../../../fixtures/base.fixture';

test.describe('Email to Flow Trigger', () => {
    test.describe.configure({ retries: 1 });

    test.beforeEach(async ({ dashboard }) => {
        await dashboard.navigateToProject('58104');
        await dashboard.clickCreateNewFlow();
    });

    // Helper: select email — trigger is auto-created on new flows
    async function setupEmailTrigger({ triggers, workflow }: any) {
        const triggerApi = triggers.page.waitForResponse(
            (resp: any) => resp.url().includes('/trigger') && resp.request().method() === 'POST',
            { timeout: 30000 }
        );
        await triggers.selectEmailTrigger();
        await triggerApi;
        await expect(workflow.inflowEmailNode).toBeVisible({ timeout: 15000 });
    }

    // Helper: create email + re-open slider from canvas
    async function openEmailSlider({ triggers, workflow }: any) {
        await setupEmailTrigger({ triggers, workflow });
        await workflow.inflowEmailNode.click();
        await expect(triggers.emailPayloadTab).toBeVisible({ timeout: 10000 });
    }

    // Helper: set webhook first, then change to email so that
    // email-set-trigger-button becomes visible (triggerType='webhook' !== 'email').
    async function setupEmailViaChange({ triggers, workflow }: any) {
        const webhookApi = triggers.page.waitForResponse(
            (resp: any) => resp.url().includes('/trigger') && resp.request().method() === 'POST',
            { timeout: 30000 }
        );
        await triggers.selectWebhookTrigger();
        await webhookApi;
        await expect(workflow.inflowWebhookNode).toBeVisible({ timeout: 15000 });

        // Open webhook slider from canvas
        await workflow.inflowWebhookNode.click();

        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Now triggerType='webhook', selecting email shows email-set-trigger-button
        await triggers.selectEmailTrigger();

        // Click email node on canvas to open its slider
        await expect(workflow.inflowEmailNode).toBeVisible({ timeout: 15000 });
        await workflow.inflowEmailNode.click();
    }

    // Helper: setupEmailViaChange + click the set button
    async function setupEmail({ triggers, workflow }: any) {
        await setupEmailViaChange({ triggers, workflow });
        await expect(triggers.emailSetTriggerButton).toBeVisible();
        await triggers.emailSetTriggerButton.click();
    }

    // ------------------------------------------------------------------ //
    // Test 1: Selecting email trigger opens slider with payload tab       //
    // ------------------------------------------------------------------ //
    test('selecting email trigger opens slider with payload tab', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        // Payload tab should be visible
        await expect(triggers.emailPayloadTab).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 2: Email slider can be closed with the close button            //
    // ------------------------------------------------------------------ //
    test('email slider can be closed with close button', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        await triggers.slider.clickClose();

        await expect(triggers.emailPayloadTab).not.toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 3: Email slider can be closed with the back button             //
    // ------------------------------------------------------------------ //
    test('email slider can be closed with back button', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        await triggers.slider.clickBack();

        await expect(triggers.emailPayloadTab).not.toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 4: Set email trigger button visible when changing from webhook //
    // ------------------------------------------------------------------ //
    test('set email trigger button visible when changing from webhook', async ({ triggers, workflow }) => {
        await setupEmailViaChange({ triggers, workflow });

        // email-set-trigger-button only appears when triggerType !== 'email'
        await expect(triggers.emailSetTriggerButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 5: Set email trigger button click confirms the trigger         //
    // ------------------------------------------------------------------ //
    test('set email trigger button click confirms email trigger', async ({ triggers, workflow }) => {
        await setupEmailViaChange({ triggers, workflow });

        await expect(triggers.emailSetTriggerButton).toBeVisible();
        await triggers.emailSetTriggerButton.click();

        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 6: Email trigger node visible on canvas after setting          //
    // ------------------------------------------------------------------ //
    test('email trigger node appears on canvas after setting', async ({ triggers, workflow }) => {
        await setupEmail({ triggers, workflow });

        await expect(workflow.inflowEmailNode).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 7: Change email → cron via Change button                       //
    // ------------------------------------------------------------------ //
    test('change email trigger to cron via change button', async ({ triggers, workflow }) => {
        await setupEmail({ triggers, workflow });

        // Open email slider from canvas
        await expect(workflow.inflowEmailNode).toBeVisible();
        await workflow.inflowEmailNode.click();

        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Select cron
        await triggers.selectCronTrigger();

        // Cron slider opens with statement input
        await expect(triggers.cron.cronInput).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 8: Change email → webhook via Change button                    //
    // ------------------------------------------------------------------ //
    test('change email trigger to webhook via change button', async ({ triggers, workflow }) => {
        await setupEmail({ triggers, workflow });

        // Open email slider from canvas
        await expect(workflow.inflowEmailNode).toBeVisible();
        await workflow.inflowEmailNode.click();

        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Select webhook then confirm
        await triggers.selectWebhookTrigger();
        await expect(workflow.setWebhookButton).toBeVisible();
        await workflow.setWebhookButton.click();

        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 9: Change button visible in email slider header                //
    // ------------------------------------------------------------------ //
    test('change button visible in email slider header', async ({ triggers, workflow }) => {
        await setupEmail({ triggers, workflow });

        // Open email slider from canvas
        await expect(workflow.inflowEmailNode).toBeVisible();
        await workflow.inflowEmailNode.click();

        // Change button from WhenStepNameComponent
        await expect(workflow.cronChangeButton).toBeVisible();
    });

});

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
        await expect(triggers.email.payloadTab).toBeVisible({ timeout: 10000 });
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

    // Helper: select email on new flow (auto-creates) — email node on canvas is confirmed
    async function setupEmail({ triggers, workflow }: any) {
        await setupEmailTrigger({ triggers, workflow });
    }

    // ------------------------------------------------------------------ //
    // Test 1: Selecting email trigger opens slider with payload tab       //
    // ------------------------------------------------------------------ //
    test('selecting email trigger opens slider with payload tab', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        // Payload tab should be visible
        await expect(triggers.email.payloadTab).toBeVisible();
    });


    // ------------------------------------------------------------------ //
    // Test 3: Email slider can be closed with the cross icon              //
    // ------------------------------------------------------------------ //
    test('email slider can be closed with cross icon', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        await triggers.slider.clickClose();

        await expect(triggers.email.payloadTab).not.toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 4: Email trigger button disabled when changing webhook → email //
    // ------------------------------------------------------------------ //
    test('email trigger button disabled when changing webhook to email', async ({ triggers, workflow }) => {
        // Set webhook first
        const webhookApi = triggers.page.waitForResponse(
            (resp: any) => resp.url().includes('/trigger') && resp.request().method() === 'POST',
            { timeout: 30000 }
        );
        await triggers.selectWebhookTrigger();
        await webhookApi;
        await expect(workflow.inflowWebhookNode).toBeVisible({ timeout: 15000 });

        // Open webhook slider from canvas and click Change
        await workflow.inflowWebhookNode.click();
        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Email option should be visible but disabled
        const emailOption = triggers.triggerOption.filter({ hasText: /email/i });
        await expect(emailOption).toBeVisible();
        await expect(emailOption).toHaveClass(/opacity-50/);
    });

    // ------------------------------------------------------------------ //
    // Test 5: Email trigger button disabled when changing cron → email    //
    // ------------------------------------------------------------------ //
    test('email trigger button disabled when changing cron to email', async ({ triggers, workflow }) => {
        // Set cron first
        await triggers.selectCronTrigger();
        await triggers.cron.fillStatement('Every day at noon');
        await triggers.cron.cronInput.press('Tab');
        await triggers.cron.save();

        await expect(workflow.publish.goLiveButton).toBeVisible({ timeout: 20000 });

        // Open cron slider from canvas and click Change
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();
        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Email option should be visible but disabled
        const emailOption = triggers.triggerOption.filter({ hasText: /email/i });
        await expect(emailOption).toBeVisible();
        await expect(emailOption).toHaveClass(/opacity-50/);
    });

    // ------------------------------------------------------------------ //
    // Test 6: Go-live button visible after email trigger auto-creation    //
    // ------------------------------------------------------------------ //
    test('go-live button visible after email trigger auto-creation', async ({ triggers, workflow }) => {
        await setupEmailTrigger({ triggers, workflow });

        await expect(workflow.publish.goLiveButton).toBeVisible({ timeout: 15000 });
    });

    // ------------------------------------------------------------------ //
    // Test 6: Email trigger node visible on canvas after setting          //
    // ------------------------------------------------------------------ //
    test('email trigger node appears on canvas after setting', async ({ triggers, workflow }) => {
        await setupEmail({ triggers, workflow });

        await expect(workflow.inflowEmailNode).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 7: Change button visible in email slider header                //
    // ------------------------------------------------------------------ //
    test('change button visible in email slider header', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        // Change button must be visible in the slider header
        await expect(triggers.email.changeButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 8: Change email → cron via Change button                       //
    // ------------------------------------------------------------------ //
    test('change email trigger to cron via change button', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        await expect(triggers.email.changeButton).toBeVisible();
        await triggers.email.changeButton.click();

        // Select cron
        await triggers.selectCronTrigger();

        // Cron slider opens with statement input
        await expect(triggers.cron.cronInput).toBeVisible();

        // Set cron
        await triggers.cron.fillStatement('Every day at noon');
        await triggers.cron.cronInput.press('Tab');
        await triggers.cron.save();

        await expect(workflow.publish.goLiveButton).toBeVisible({ timeout: 20000 });
    });

    // ------------------------------------------------------------------ //
    // Test 9: Change email → webhook via Change button                    //
    // ------------------------------------------------------------------ //
    test('change email trigger to webhook via change button', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        await expect(triggers.email.changeButton).toBeVisible();
        await triggers.email.changeButton.click();

        // Select webhook then confirm
        await triggers.selectWebhookTrigger();
        await expect(workflow.setWebhookButton).toBeVisible();
        await workflow.setWebhookButton.click();

        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 10: Help button click opens help page                          //
    // ------------------------------------------------------------------ //
    test('help button click opens help page', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        // Listen for new tab/popup opened by window.open
        const [popup] = await Promise.all([
            triggers.page.waitForEvent('popup'),
            triggers.email.helpButton.click(),
        ]);

        await popup.waitForLoadState();
        expect(popup.url()).toContain('http');
    });

    // ------------------------------------------------------------------ //
    // Test 11: Copy button is visible and works in slider                 //
    // ------------------------------------------------------------------ //
    test('copy button works in email slider', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        await expect(triggers.email.copyButton).toBeVisible();
        await triggers.email.copyButton.click();
    });

    // ------------------------------------------------------------------ //
    // Test 12: Note should be visible in email slider                     //
    // ------------------------------------------------------------------ //
    test('note is visible in email slider', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        await expect(triggers.email.noteCard).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 13: Loader visible when no data in payload                     //
    // ------------------------------------------------------------------ //
    test('loader visible when no payload data', async ({ triggers, workflow }) => {
        await openEmailSlider({ triggers, workflow });

        await expect(triggers.email.dataLoader).toBeVisible();
    });
});

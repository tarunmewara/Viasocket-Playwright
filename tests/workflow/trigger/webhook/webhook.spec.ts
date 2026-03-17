import { test, expect } from '../../../../fixtures/base.fixture';

test.describe('Webhook Trigger', () => {
    // Retry once — under parallel load the trigger creation API can transiently fail
    test.describe.configure({ retries: 1 });

    test.beforeEach(async ({ dashboard }) => {
        await dashboard.navigateToProject('58104');
        await dashboard.clickCreateNewFlow();
    });

    // Helper: select webhook — trigger is auto-created on new flows
    // (addOwnTrigger dispatches createOrUpdateTriggerThunk when !triggerType)
    async function setupWebhook({ triggers, workflow }: any) {
        // Listen for the POST /trigger API before clicking so we know when it completes
        const triggerApi = triggers.page.waitForResponse(
            (resp: any) => resp.url().includes('/trigger') && resp.request().method() === 'POST',
            { timeout: 30000 }
        );
        await triggers.selectWebhookTrigger();
        await triggerApi;
        // API completed — canvas node should render quickly
        await expect(workflow.inflowWebhookNode).toBeVisible({ timeout: 15000 });
    }

    // Helper: create webhook + re-open slider from canvas
    async function openWebhookSlider({ triggers, workflow }: any) {
        await setupWebhook({ triggers, workflow });
        await workflow.inflowWebhookNode.click();
        await expect(triggers.webhookTabs).toBeVisible({ timeout: 10000 });
    }

    // ------------------------------------------------------------------ //
    // Test 1: Selecting webhook auto-creates trigger on new flow          //
    // ------------------------------------------------------------------ //
    test('selecting webhook trigger auto-creates trigger on new flow', async ({ triggers, workflow }) => {
        // Listen for the POST /trigger API
        const triggerApi = triggers.page.waitForResponse(
            (resp: any) => resp.url().includes('/trigger') && resp.request().method() === 'POST',
            { timeout: 30000 }
        );
        await triggers.selectWebhookTrigger();
        await triggerApi;

        // On new flows, webhook is auto-created (no "Set webhook" button)
        await expect(workflow.inflowWebhookNode).toBeVisible({ timeout: 15000 });
    });

    // ------------------------------------------------------------------ //
    // Test 2: Webhook tabs container visible in the slider                //
    // ------------------------------------------------------------------ //
    test('webhook tabs container visible in slider', async ({ triggers, workflow }) => {
        await openWebhookSlider({ triggers, workflow });

        await expect(triggers.webhookTabs).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 3: Payload tab visible in the webhook slider                   //
    // ------------------------------------------------------------------ //
    test('webhook payload tab visible in slider', async ({ triggers, workflow }) => {
        await openWebhookSlider({ triggers, workflow });

        await expect(triggers.webhookPayloadTab).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 4: Send Sample Data tab visible in the webhook slider          //
    // ------------------------------------------------------------------ //
    test('webhook send sample data tab visible in slider', async ({ triggers, workflow }) => {
        await openWebhookSlider({ triggers, workflow });

        await expect(triggers.webhookSendSampleTab).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 5: Clicking Send Sample Data tab switches the active view      //
    // ------------------------------------------------------------------ //
    test('clicking send sample data tab switches view', async ({ triggers, workflow }) => {
        await openWebhookSlider({ triggers, workflow });

        await triggers.webhookSendSampleTab.click();

        // The tab is now selected (aria-selected="true")
        await expect(triggers.webhookSendSampleTab).toHaveAttribute('aria-selected', 'true');
    });

    // ------------------------------------------------------------------ //
    // Test 6: Get Data button visible in the webhook slider               //
    // ------------------------------------------------------------------ //
    test('webhook get data button visible in slider', async ({ triggers, workflow }) => {
        await openWebhookSlider({ triggers, workflow });

        await expect(triggers.webhookGetDataButton).toBeVisible({ timeout: 20000 });
    });

    // ------------------------------------------------------------------ //
    // Test 7: Webhook slider can be closed with the close button          //
    // ------------------------------------------------------------------ //
    test('webhook slider can be closed with close button', async ({ triggers, workflow }) => {
        await openWebhookSlider({ triggers, workflow });

        await triggers.slider.clickClose();

        // Tabs should be gone after closing
        await expect(triggers.webhookTabs).not.toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 8: Webhook auto-creation shows go-live button                  //
    // ------------------------------------------------------------------ //
    test('webhook auto-creation shows go-live button', async ({ triggers, workflow }) => {
        // Listen for the POST /trigger API
        const triggerApi = triggers.page.waitForResponse(
            (resp: any) => resp.url().includes('/trigger') && resp.request().method() === 'POST',
            { timeout: 30000 }
        );
        await triggers.selectWebhookTrigger();
        await triggerApi;

        // Trigger auto-creates on new flows — go-live becomes available
        await expect(workflow.publish.goLiveButton).toBeVisible({ timeout: 15000 });
    });

    // ------------------------------------------------------------------ //
    // Test 9: Webhook trigger node appears on the canvas after setting    //
    // ------------------------------------------------------------------ //
    test('webhook trigger node appears on canvas after setting', async ({ triggers, workflow }) => {
        await setupWebhook({ triggers, workflow });

        await expect(workflow.inflowWebhookNode).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 10: Webhook node on canvas opens slider when clicked           //
    // ------------------------------------------------------------------ //
    test('webhook node on canvas opens slider when clicked', async ({ triggers, workflow }) => {
        await setupWebhook({ triggers, workflow });

        // Click the webhook node on canvas to open the slider
        await workflow.inflowWebhookNode.click();

        // Slider opens — tabs become visible
        await expect(triggers.webhookTabs).toBeVisible({ timeout: 10000 });
    });

    // ------------------------------------------------------------------ //
    // Test 11: Change webhook → cron via Change button                    //
    // ------------------------------------------------------------------ //
    test('change webhook trigger to cron via change button', async ({ triggers, workflow }) => {
        await setupWebhook({ triggers, workflow });

        // Open webhook slider from canvas
        await expect(workflow.inflowWebhookNode).toBeVisible();
        await workflow.inflowWebhookNode.click();

        // Click Change in slider header
        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Select cron from trigger list
        await triggers.selectCronTrigger();

        // Cron slider should open with the statement input
        await expect(triggers.cron.cronInput).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 12: Change webhook → email via Change button                   //
    // ------------------------------------------------------------------ //
    test('change webhook trigger to email via change button', async ({ triggers, workflow }) => {
        await setupWebhook({ triggers, workflow });

        // Open webhook slider from canvas
        await expect(workflow.inflowWebhookNode).toBeVisible();
        await workflow.inflowWebhookNode.click();

        // Click Change in slider header
        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Email option should be visible but disabled when changing from webhook
        // (isEmailDisabled = true when triggerType !== 'email')
        const emailOption = triggers.triggerOption.filter({ hasText: /email/i });
        await expect(emailOption).toBeVisible();
        await expect(emailOption).toHaveClass(/opacity-50/);
    });

});

import { test, expect } from '@playwright/test';

import { WebhookComponent } from '../../components/workflow/webhook.component';



// 🔹 Dynamic payload generator — incident payload, all fields randomized per run

function generatePayload() {

  const randomId = Date.now();

  const severities = ['critical', 'high', 'medium', 'low'];

  const statuses = ['open', 'investigating', 'resolved'];

  const regions = ['ap-south-1', 'us-east-1', 'us-west-2', 'eu-west-1'];

  const owners = ['DevOps Team', 'Backend Team', 'SRE Team', 'Platform Team'];

  const services = ['Payment Gateway', 'Auth Service', 'Notification Service', 'Order Service'];

  const errors = [
    'Payment API returning 500',
    'Database connection timeout',
    'JWT validation failed',
    'Queue consumer stopped processing',
  ];

  return {

    incidentId: `INC${randomId}`,

    serviceName: services[Math.floor(Math.random() * services.length)],

    errorMessage: errors[Math.floor(Math.random() * errors.length)],

    severity: severities[Math.floor(Math.random() * severities.length)],

    status: statuses[Math.floor(Math.random() * statuses.length)],

    owner: owners[Math.floor(Math.random() * owners.length)],

    region: regions[Math.floor(Math.random() * regions.length)],

  };

}



// Module-level storage for the flow page URL — set by TC-WF4-001, used by later tests

let storedFlowPageUrl = '';



test.describe('Incident Alert Webhook Flow', () => {

  // Tests must run sequentially (serial mode) so each test builds on the previous

  test.describe.configure({ mode: 'serial' });

  // 10-second cooldown between each test to let the UI settle

  test.afterEach(async ({ page }) => {

    await page.waitForTimeout(10000);

  });



  test('TC-WF4-001: Create workflow, set webhook trigger and store URL', async ({ page }) => {

    const webhook = new WebhookComponent(page);



    // ── Step 1: Navigate to org page and select the 'suraj choudhary' workspace ────

    await page.goto('/org');

    await page.getByText('suraj choudhary').click();

    // Wait for the project page to fully load after workspace selection

    await page.waitForURL(/\/projects\//, { timeout: 15000 });



    // ── Step 2: Create new workflow ─────────────────────────────────────────

    await page.getByTestId('project-slider-create-flow-btn').click();



    // ── Step 3: Select Webhook Trigger ──────────────────────────────────────

    // data-testid='trigger-option' (AddStepSearchView.tsx), filtered by text

    await webhook.selectWebhookTrigger();



    // ── Step 4: Capture webhook URL from the open panel before clicking SET WEBHOOK

    // The URL is visible in the panel input immediately after selecting the trigger

    const webhookUrl = await webhook.captureAndStoreWebhookUrl();

    // Assert: captured URL is valid before proceeding

    expect(webhookUrl, 'Webhook URL must be captured before setting').toBeTruthy();

    expect(webhookUrl, 'Webhook URL must contain /func/ path').toContain('/func/');



    // ── Step 4b: Click SET WEBHOOK to confirm and close the panel ───────────

    // data-testid='webhook-set-button' — only present before trigger is saved

    await webhook.setWebhook();



    // ── Step 5: Wait for canvas to load, then store flow page URL ────────────

    // Wait for Add Step button to be visible — confirms canvas is fully loaded

    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });

    storedFlowPageUrl = page.url().split('?')[0];

    // Assert: flow URL is valid and contains expected path segments

    expect(storedFlowPageUrl, 'Flow page URL must be captured').toBeTruthy();

    expect(storedFlowPageUrl, 'Flow URL must contain /workflow/').toContain('/workflow/');

    console.log('✅ Captured and stored Webhook URL:', webhookUrl);

    console.log('✅ Flow page URL stored:', storedFlowPageUrl);

  });



  test('TC-WF4-002: Send dynamic incident payload to the stored webhook URL', async ({ request }) => {

    // ── Step 1: Read the URL stored by TC-WF4-001 ────────────────────────────

    const webhookUrl = WebhookComponent.capturedWebhookUrl;

    console.log('📌 Using stored Webhook URL:', webhookUrl);

    expect(webhookUrl, 'Webhook URL must be set by TC-WF4-001 before this test runs').toBeTruthy();

    expect(webhookUrl).toContain('/func/');



    // ── Step 2: Generate dynamic incident payload ─────────────────────────────

    const payload = generatePayload();

    console.log('📦 Incident Payload:', payload);



    // ── Step 3: POST payload to the stored webhook URL ────────────────────────

    const response = await request.post(webhookUrl, {

      headers: { 'Content-Type': 'application/json' },

      data: payload,

    });

    const responseBody = await response.text();

    console.log('📬 Webhook Response Status:', response.status());

    console.log('📬 Webhook Response Body:', responseBody);

    // ── Step 4: Assert webhook accepted the payload ───────────────────────────

    expect(response.status(), 'Webhook must return HTTP 200').toBe(200);

    // Assert: response body must not indicate an error

    expect(responseBody, 'Webhook response must not contain error').not.toContain('"error"');

  });



  test('TC-WF4-003: Add JS Code step, use Ask AI with incident prompt, test and save', async ({ page }) => {

    // ── Step 1: Navigate to the SAME flow created in TC-WF4-001 ─────────────

    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF4-001 before this test runs').toBeTruthy();

    await page.goto(storedFlowPageUrl);

    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });



    // ── Step 2: Click Add Step on the canvas ─────────────────────────────────

    // data-testid='add-step-button' (AddStepButton.tsx)

    await page.getByTestId('add-step-button').click();



    // ── Step 3: Select JS Code from the Add Step slider ──────────────────────

    // data-testid='builtin-tool-option' (AddStepSearchView.tsx), filtered by visible text

    await page.getByTestId('builtin-tool-option').filter({ hasText: /JS Code/i }).first().click();



    // ── Step 4: Dismiss the variable popover that opens automatically ─────────

    await page.getByTestId('flow-canvas').click({ position: { x: 10, y: 10 }, force: true });



    // ── Step 5: Fill the description textarea with the AI prompt ──────────────

    // placeholder='Provide a high-level description of the task.' (DescriptionComponent.tsx)

    // data-testid='mentions-input' (customAutoSuggestV2.tsx)

    await page.getByTestId('step-config-content').getByTestId('mentions-input').click();

    await page.getByTestId('flow-canvas').click({ position: { x: 10, y: 10 }, force: true });

    await page.getByTestId('step-config-content').getByTestId('mentions-input').fill(
      'Read the incoming webhook payload and log the incidentId, serviceName, errorMessage, severity, status, owner and region to the console.'
    );



    // ── Step 6: Click Ask AI to generate the JS code ─────────────────────────

    // No data-testid on the Ask AI button (DescriptionComponent.tsx line 89)

    // Two 'Ask AI' buttons exist: nth(0) = canvas button, nth(1) = panel description button

    await page.getByRole('button', { name: 'Ask AI' }).nth(1).click();



    // ── Step 7: Wait for AI to generate code ─────────────────────────────────

    await page.waitForTimeout(5000);



    // ── Step 8: Click Test (dry run) — fails naturally if button not found/clickable

    // data-testid='dry-run-step-test-button' (dryRunButton.tsx)

    await page.getByTestId('dry-run-step-test-button').click();



    // ── Step 9: Close input variables modal if it appears ────────────────────

    // data-testid='input-variables-close-btn' (customVariablesComponent.tsx)

    const inputVarsClose = page.getByTestId('input-variables-close-btn');

    if (await inputVarsClose.isVisible({ timeout: 4000 }).catch(() => false)) {

      await inputVarsClose.click();

    }



    // ── Step 10: Save the JS Code step — fails naturally if button not found/clickable

    // data-testid='save-button' (saveButtonV3.tsx)

    await page.getByTestId('save-button').click();

    console.log('✅ JS Code step added, AI prompted for incident payload, tested and saved');

  });

});
 
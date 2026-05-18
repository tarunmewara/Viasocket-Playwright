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



  test('TC-WF4-004: Add Multiple Paths condition, add Slack step inside first branch, test and save', async ({ page }) => {

    // ── Step 1: Navigate to the SAME flow created in TC-WF4-001 ─────────────

    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF4-001 before this test runs').toBeTruthy();

    await page.goto(storedFlowPageUrl);

    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });



    // ── Step 2: Click Add Step on the canvas ─────────────────────────────────

    await page.getByTestId('add-step-button').click();



    // ── Step 3: Select Multiple Paths (If Conditions) ────────────────────────

    await page.getByTestId('builtin-tool-option').filter({ hasText: /Multiple Paths/i }).first().click();



    // ── Step 4: Dismiss the variable popover ─────────────────────────────────

    await page.getByTestId('flow-canvas').click({ position: { x: 10, y: 10 }, force: true });



    // ── Step 4b: Fill the condition for the first path ────────────────────────

    const conditionInput = page.getByRole('textbox', { name: 'Enter a condition for path.' });

    await conditionInput.fill('Check if the severity is critical');

    await expect(conditionInput).toHaveValue('Check if the severity is critical');



    // ── Step 5: Save the Multiple Paths step ─────────────────────────────────

    await page.getByTestId('save-button').click();



    // ── Step 6: Click 'Add or drag step here' inside the first branch ─────────

    // The if-block renders branches: nth(0) = first path, nth(1) = Else

    await page.getByText('Add or drag step here').nth(0).click();



    // ── Step 7: Search for Slack in the Add Step panel ───────────────────────

    await page.getByTestId('trigger-search-input').fill('slack');



    // ── Step 8: Select the Slack app from search results ─────────────────────

    await page.getByRole('option', { name: /^Slack$/i }).click();



    // ── Step 8b: Select 'Send Message' action from the Slack actions list ────

    await page.getByTestId('trigger-action-item').filter({ hasText: 'Send Message' }).first().click();



    // ── Step 9: Click auth connection chip to connect Slack account ──────────

    await page.getByTestId('auth-connection-chip').click();



    // ── Step 10: Select the existing Slack connection ─────────────────────────

    await page.getByRole('listbox').getByRole('option').filter({ hasText: 'something' }).first().click();



    // ── Step 11: Click 'Select Slack channel(s)' button to open channel picker

    await page.getByRole('button', { name: 'Select Slack channel(s)' }).click();



    // ── Step 12: Select the Slack channel ────────────────────────────────────

    await page.getByText('incident-alerts (C0B0F6ADNTA)').click();



    // ── Step 13: Dismiss popover before filling message ───────────────────────

    // data-testid='plugin-field-content' (pluginHocV2.tsx) — field key is 'content' for Send Message

    const msgField = page.getByTestId('plugin-field-content').getByRole('textbox');

    // await msgField.click();

    await page.getByTestId('flow-canvas').click({ position: { x: 10, y: 10 }, force: true });



    // ── Step 14: Fill the message content ────────────────────────────────────

    const slackMsg = 'Incident Alert: incidentId serviceName errorMessage severity status owner region';

    await msgField.fill(slackMsg);

    await expect(msgField).toHaveValue(slackMsg);



    // ── Step 15: Test the Slack step (dry run) ────────────────────────────────

    // data-testid='dry-run-test-button' (dryRunButton.tsx) — plugin steps use dry-run-test-button

    await page.getByTestId('dry-run-test-button').click();

    // Wait for mutation to settle before saving (race condition fix).

    await expect(page.getByTestId('dry-run-test-button')).toBeEnabled({ timeout: 30000 });



    // ── Step 16: Save the Slack step ──────────────────────────────────────────

    // data-testid='save-button' (saveButtonV3.tsx)

    await expect(page.getByTestId('save-button')).toBeEnabled({ timeout: 10000 });

    await page.getByTestId('save-button').click();

    console.log('✅ Multiple Paths added, Slack Send Message configured in first branch, tested and saved');

  });



  test('TC-WF4-005: Add Delay step after Slack inside first branch, configure 1 minute delay, test and save', async ({ page }) => {

    // ── Step 1: Navigate to the SAME flow created in TC-WF4-001 ─────────────

    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF4-001 before this test runs').toBeTruthy();

    await page.goto(storedFlowPageUrl);

    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });



    // ── Step 2: Click 'Add or drag step here' inside the first branch (after Slack)

    // Using locator scoped to #critical-inner-content to target the branch specifically.

    await page.locator('#critical-inner-content').getByText('Add or drag step here').click();



    // ── Step 3: Search for Delay in the Add Step panel ───────────────────────

    // data-testid='trigger-search-input' (AddStepSearchView.tsx)

    await page.getByTestId('trigger-search-input').fill('delay');



    // ── Step 4: Select Delay from the Add Step slider ─────────────────────────

    await page.getByTestId('add-step-slider').getByText('Delay', { exact: true }).click();



    // ── Step 5: Dismiss the variable popover that opens automatically ─────────

    await page.getByTestId('flow-canvas').click({ position: { x: 10, y: 10 }, force: true });



    // ── Step 6: Fill the delay duration input ────────────────────────────────

    // data-testid='mentions-input-dGfEhUhQ' — confirmed working selector from previous run

    const delayInput = page.getByTestId('step-config-content').getByTestId('mentions-input-dGfEhUhQ');

    await delayInput.fill('1 minute');



    // ── Step 7: Click Ask AI to configure the delay ───────────────────────────

    // data-testid='custom-autosuggest-ask-ai-btn' (customAutoSuggestV2.tsx line 516)

    await page.getByTestId('custom-autosuggest-ask-ai-btn').click();

    // Functional gate: Test button only becomes enabled once AI has configured the delay.
    await expect(page.getByTestId('dry-run-test-button')).toBeEnabled({ timeout: 20000 });



    // ── Step 8: Click Test (dry run) ──────────────────────────────────────────

    // data-testid='dry-run-test-button' (dryRunButton.tsx)

    await page.getByTestId('dry-run-test-button').click();

    // Wait for mutation to settle: button disabled while mutate.status==='pending' (dryRunButton.tsx line 180).
    // Clicking save before this causes handleSaveClick (saveButtonV3.tsx line 531-534) to
    // silently close the panel without saving — test would pass falsely.
    await expect(page.getByTestId('dry-run-test-button')).toBeEnabled({ timeout: 30000 });



    // ── Step 9: Save the Delay step ───────────────────────────────────────────

    // Assert save-button enabled first — proves hasBeenTested=true after test run.
    // If still disabled, test run failed silently.
    await expect(page.getByTestId('save-button')).toBeEnabled({ timeout: 10000 });

    await page.getByTestId('save-button').click();

    console.log('✅ Delay step added after Slack in first branch, configured for 1 minute, tested and saved');

  });

  test('TC-WF4-006: Add API Call step after Slack inside first branch, configure JSON body, test and save', async ({ page }) => {

    // ── Step 1: Navigate to the SAME flow created in TC-WF4-001 ─────────────

    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF4-001 before this test runs').toBeTruthy();

    await page.goto(storedFlowPageUrl);

    // await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });



    // ── Step 2: Click 'Add or drag step here' inside the first branch ─────────

    await page.locator('#critical-inner-content').getByText('Add or drag step here').click();



    // ── Step 3: Search for API Call in the Add Step panel ────────────────────

    await page.getByTestId('trigger-search-input').click();

    await page.getByTestId('trigger-search-input').fill('API Call');



    // ── Step 4: Select API Call from the Add Step slider ─────────────────────

    await page.getByTestId('add-step-slider').getByText('API Call').click();



    // ── Step 5: Open the API editor accordion ────────────────────────────────

    await page.getByTestId('api-slider-editor-accordion-summary').click();



    // ── Step 6: Click the URL input field ────────────────────────────────────

    // await page.getByTestId('mentions-input-requestInput').click();
    await page.getByPlaceholder('https://flow.viasocket.com/').click();

    await page.getByPlaceholder('https://flow.viasocket.com/').fill('https://flow.sokt.io/func/scriunfrtqaE');

   await page.getByTestId('flow-canvas').click({ position: { x: 10, y: 10 }, force: true });

    // ── Step 7: Select JSON body type ────────────────────────────────────────

    await page.getByTestId('body-tab-type-radio-group').getByText('json').click();



    // ── Step 8: Click the body textbox and fill JSON request body ────────────

    await page.getByRole('tabpanel').getByRole('textbox').click();

    await page.getByRole('tabpanel').getByRole('textbox').fill('{\n  "incidentId": context.req.body?.["incidentId"],\n  "serviceName": context.req.body?.["serviceName"],\n  "severity": context.req.body?.["severity"],\n  "errorMessage": context.req.body?.["errorMessage"],\n  "owner": context.req.body?.["owner"],\n  "escalatedAt": context.res.minimal_normalized_incident?.normalizedIncident?.escalationRequired\n}');



    // ── Step 9: Click Test (dry run) ─────────────────────────────────────────

    // data-testid='dry-run-step-test-button' (dryRunButton.tsx)

    await page.getByTestId('dry-run-step-test-button').click();



    // ── Step 10: Click the Test button inside the variables modal ────────────

    await page.getByRole('button', { name: 'Test' }).click();



    // ── Step 11: Wait for dry run to settle ──────────────────────────────────

    // Button re-enables when mutate.status returns to idle (dryRunButton.tsx line 180).
    // Clicking save before this causes handleSaveClick (saveButtonV3.tsx line 531-534) to
    // silently close the panel without saving — test would pass falsely.
    // await expect(page.getByTestId('dry-run-step-test-button')).toBeEnabled({ timeout: 30000 });



    // ── Step 12: Close the input variables modal ──────────────────────────────

    await page.getByTestId('input-variables-close-btn').click();



    // ── Step 13: Save the API Call step ──────────────────────────────────────

    // Assert save-button enabled first — proves hasBeenTested=true after test run.
    // If still disabled, test run failed silently.
    await expect(page.getByTestId('save-button')).toBeEnabled({ timeout: 10000 });

    await page.getByTestId('save-button').click();

    console.log('✅ API Call step added after Slack in first branch, JSON body configured, tested and saved');

  });

  test('TC-WF4-007: Add Gmail Send Email step inside first branch, configure recipient/subject/body, test and save', async ({ page }) => {

    // ── Step 1: Navigate to the SAME flow created in TC-WF4-001 ─────────────

    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF4-001 before this test runs').toBeTruthy();

    await page.goto(storedFlowPageUrl);

    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });



    // ── Step 2: Click 'Add or drag step here' inside the first branch ─────────

    await page.locator('#critical-inner-content').getByText('Add or drag step here').click();



    // ── Step 3: Search for Gmail in the Add Step panel ────────────────────────

    await page.getByTestId('trigger-search-input').click();

    await page.getByTestId('trigger-search-input').fill('gmail');



    // ── Step 4: Select Gmail app from the Add Step slider ─────────────────────

    await page.getByTestId('add-step-slider').getByText('Gmail', { exact: true }).click();



    // ── Step 5: Select 'Send Email' action ───────────────────────────────────

    await page.getByTestId('add-step-slider').getByText('Send Email').click();



    // ── Step 6: Fill the 'To' field ───────────────────────────────────────────

    await page.getByTestId('mentions-input-to').click();

    await page.getByTestId('mentions-input-to').fill('volar49603@hacknapp.com');

    await page.getByTestId('flow-canvas').click({ position: { x: 10, y: 10 }, force: true });



    // ── Step 7: Fill the 'Subject' field ─────────────────────────────────────

    await page.getByTestId('mentions-input-subject').click();

    await page.getByTestId('mentions-input-subject').fill('URGENT: Incident Escalation -minimal_normalized_incident.normalizedIncident.escalationRequired');
 
    await page.getByTestId('flow-canvas').click({ position: { x: 10, y: 10 }, force: true });


    // ── Step 8: Fill the message body ────────────────────────────────────────

    await page.getByTestId('mentions-input-messageBody').click();

    await page.getByTestId('mentions-input-messageBody').fill('Critical incident escalated.\n\nIncident ID: body."incidentId"\nService: body."serviceName"\nSeverity:body."severity"\n\nPlease investigate immediately.');


    // ── Step 9: Click Test (dry run) ─────────────────────────────────────────

    // data-testid='dry-run-test-button' (dryRunButton.tsx)

await page.getByTestId('trigger-search-input').fill('Notion');



// ── Step 4: Select Notion app from the Add Step slider ────────────────────

await page.getByTestId('add-step-slider').getByText('Notion').click();



// ── Step 5: Select 'Create Data Source Item' action ───────────────────────

await page.getByTestId('add-step-slider').getByText('Create Data Source Item').click();



// ── Step 6: Click auth connection chip to connect Notion account ──────────

await page.getByTestId('auth-connection-chip').click();



// ── Step 7: Select the existing Notion connection ─────────────────────────

await page.getByText('Tarun Mewara\u2019s WorkspaceCreated by suraj choudharyApr 25Used in 1 automation').click();



// ── Step 8: Open the data source dropdown ────────────────────────────────

await page.getByTestId('dropdown-chip-data_source_id').click();



// ── Step 9: Click 'Choose Fields' to reveal field selectors ─────────────

await page.getByRole('button', { name: 'Choose Fields' }).click();



// ── Step 10: Select 'Project name (title)' field ─────────────────────────

await page.getByText('Project name (title)').click();



// ── Step 11: Fill the Project name field ──────────────────────────────────

await page.getByTestId('mentions-input-dynamic_field.Project name:@:title').click();

await page.getByTestId('mentions-input-dynamic_field.Project name:@:title').fill('RandomProject');



// ── Step 12: Open the page content template mode dropdown ────────────────

await page.getByTestId('dropdown-chip-page_content.template_mode').click();



// ── Step 13: Select 'No template (none)' ─────────────────────────────────

await page.getByText('No template (none)').click();



// ── Step 14: Click Test (dry run) ─────────────────────────────────────────

// data-testid='dry-run-test-button' (dryRunButton.tsx) — plugin steps use dry-run-test-button

await page.getByTestId('dry-run-test-button').click();

// Wait for mutation to settle: button disabled while mutate.status==='pending' (dryRunButton.tsx line 180).
// Clicking save before this causes handleSaveClick (saveButtonV3.tsx line 531-534) to
// silently close the panel without saving — test would pass falsely.
await expect(page.getByTestId('dry-run-test-button')).toBeEnabled({ timeout: 30000 });



// ── Step 15: Save the Notion step ─────────────────────────────────────────

// Assert save-button enabled first — proves hasBeenTested=true after test run.
// If still disabled, test run failed silently.
await expect(page.getByTestId('save-button')).toBeEnabled({ timeout: 10000 });

await page.getByTestId('save-button').click();

console.log('✅ Notion Create Data Source Item step added in the Else path, fields configured, tested and saved');

});
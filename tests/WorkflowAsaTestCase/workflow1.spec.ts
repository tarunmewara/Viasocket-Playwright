import { test, expect } from '@playwright/test';
import { WebhookComponent } from '../../components/workflow/webhook.component';
import { JSCodeComponent } from '../../components/workflow/js-code.component';

// 🔹 Dynamic payload generator
function generatePayload() {
  const randomId = Date.now();
  return {
    orderId: `ORD${randomId}`,
    userId: `USR${Math.floor(Math.random() * 10000)}`,
    amount: Math.floor(Math.random() * 5000) + 100,
    currency: 'INR',
    items: [
      { name: 'Shoes', price: 1000, qty: 1 },
      { name: 'Socks', price: 200, qty: 1 }
    ],
    email: `test${randomId}@example.com`,
    ipAddress: '192.168.1.1',
    country: 'IN',
    paymentMethod: 'CARD'
  };
}

// Tests must run sequentially (serial mode) so Test 2 always runs after Test 1
test.describe.configure({ mode: 'serial' });

// Module-level storage for the flow page URL — set by TC-WF-001, used by TC-WF-003
let storedFlowPageUrl = '';

test.describe('Webhook Flow', () => {
  // 10-second cooldown between each test to let the UI settle
  test.afterEach(async ({ page }) => {
    await page.waitForTimeout(10000);
  });


  test('TC-WF-001: Create workflow, set webhook trigger and store URL', async ({ page }) => {
    const webhook = new WebhookComponent(page);

    // ── Step 1: Open project ────────────────────────────────────────────────
    await page.goto('/projects/16563');

    // ── Step 2: Create new workflow ─────────────────────────────────────────
    await page.getByTestId('project-slider-create-flow-btn').click();

    // ── Step 3: Select Webhook Trigger ──────────────────────────────────────
    // data-testid='trigger-option' (AddStepSearchView.tsx line 415), filtered by text
    await webhook.selectWebhookTrigger();

    // ── Step 4: Capture and store webhook URL ───────────────────────────────
    // URL rendered as visible text on canvas node — no testid exists on this element
    const webhookUrl = await webhook.captureAndStoreWebhookUrl();

    // ── Step 5: Wait for canvas to load, then store flow page URL for TC-WF-003
    // Wait for Add Step button to be visible — confirms canvas is fully loaded
    // This ensures we don't store the interim SET_TRIGGER URL
    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });
    storedFlowPageUrl = page.url().split('?')[0];
    console.log('✅ Captured and stored Webhook URL:', webhookUrl);
    console.log('✅ Flow page URL stored:', storedFlowPageUrl);
    expect(webhookUrl).toBeTruthy();
    expect(webhookUrl).toContain('/func/');
  });

  test('TC-WF-002: Send payload to the stored webhook URL', async ({ request }) => {
    // ── Step 1: Read the URL stored by TC-WF-001 ────────────────────────────
    const webhookUrl = WebhookComponent.capturedWebhookUrl;

    console.log('📌 Using stored Webhook URL:', webhookUrl);
    expect(webhookUrl, 'Webhook URL must be set by TC-WF-001 before this test runs').toBeTruthy();
    expect(webhookUrl).toContain('/func/');

    // ── Step 2: Generate dynamic payload ────────────────────────────────────
    const payload = generatePayload();
    console.log('📦 Payload:', payload);

    // ── Step 3: POST payload to the stored webhook URL ───────────────────────
    const response = await request.post(webhookUrl, {
      headers: { 'Content-Type': 'application/json' },
      data: payload
    });

    console.log('📬 Webhook Response Status:', response.status());
    console.log('📬 Webhook Response Body:', await response.text());

    // ── Step 4: Assert webhook accepted the payload ──────────────────────────
    expect(response.status()).toBe(200);
  });

  test('TC-WF-003: Add JS Code step, use Ask AI with a prompt, test and save', async ({ page }) => {
    const js = new JSCodeComponent(page);

    // ── Step 1: Navigate to the SAME flow created in TC-WF-001 ─────────────
    // Strip query params (stepId=ADD_STEP etc.) from stored URL so the canvas loads cleanly
    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF-001 before this test runs').toBeTruthy();
    const baseFlowUrl = storedFlowPageUrl.split('?')[0];
    await page.goto(baseFlowUrl);
    // Wait for the canvas Add Step button to confirm the flow loaded
    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });

    // ── Step 2: Click Add Step on the canvas ────────────────────────────────
    // data-testid='add-step-button' (canvas)
    await page.getByTestId('add-step-button').click();

    // ── Step 3: Select JS Code from the Add Step panel ──────────────────────
    // data-testid='builtin-tool-option' (AddStepSearchView.tsx line 434), filtered by text
    await page.getByTestId('builtin-tool-option').filter({ hasText: /JS Code/i }).first().click();

    // ── Step 4: Close the variable popover that opens automatically ──────────
    // data-testid='variable-popover-close-button' (VariablePopoverMenu.tsx line 484)
    await js.variablePopoverCloseButton.click();

    // ── Step 5: Fill description with the AI prompt ──────────────────────────
    // placeholder='Provide a high-level description of the task.' (DescriptionComponent.tsx)
    await js.descriptionTextarea.click();
    await js.descriptionTextarea.fill('Read the incoming webhook payload and log the orderId, amount and paymentMethod to the console.');

    // ── Step 6: Click Ask AI button inside the JS Code description panel ───
    // Two 'Ask AI' buttons exist: nth(0) = canvas data-testid='ask-ai-button' (ZoomableFlowComponent.tsx),
    // nth(1) = panel button from CustomAutoSuggestV2 (customAutoSuggestV2.tsx line 571, no data-testid)
    await page.getByRole('button', { name: 'Ask AI' }).nth(1).click();

    // ── Step 7: Wait for AI to generate code ────────────────────────────────
    await page.waitForTimeout(5000);

    // ── Step 8: Click Test (dry run for the step) ────────────────────────────
    // data-testid='dry-run-step-test-button' (dryRunButtonForFunctionApiPlugin/dryRunButton.tsx line 228)
    await page.getByTestId('dry-run-step-test-button').click();

    // ── Step 9: Handle input variables modal if it appears ───────────────────
    // The modal opens when usedVariables are found; close it after it appears
    // data-testid='input-variables-close-btn' (customVariablesComponent.tsx line 137)
    const inputVarsClose = page.getByTestId('input-variables-close-btn');
    if (await inputVarsClose.isVisible({ timeout: 4000 }).catch(() => false)) {
      await inputVarsClose.click();
    }

    // ── Step 10: Save the JS Code step ──────────────────────────────────────
    // data-testid='save-button' (saveButtonV3.tsx)
    await page.getByTestId('save-button').click();

    console.log('✅ JS Code step added, AI prompted, tested and saved');
  });

    test('TC-WF-004: Add Multiple Paths condition, add Slack step inside first branch, test and save', async ({ page }) => {

    // ── Step 1: Navigate to the SAME flow created in TC-WF-001 ─────────────
    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF-001 before this test runs').toBeTruthy();
    await page.goto(storedFlowPageUrl);
    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });

    // ── Step 2: Click Add Step to open step selection panel ─────────────────
    // data-testid='add-step-button' (canvas)
    await page.getByTestId('add-step-button').click();

    // ── Step 3: Select Multiple Paths (If Conditions) ────────────────────────
    // data-testid='builtin-tool-option' (AddStepSearchView.tsx line 434), filtered by text
    await page.getByTestId('builtin-tool-option').filter({ hasText: /Multiple Paths/i }).first().click();

    // ── Step 4: Close the variable popover that opens automatically ──────────
    // data-testid='variable-popover-close-button' (VariablePopoverMenu.tsx line 484)
    await page.getByTestId('variable-popover-close-button').click();

    // ── Step 4b: Fill the condition for Path 1 ───────────────────────────────
    // The condition textbox must be interacted with to enable the Save button
    // No data-testid — stable selector: role=textbox with name matching the placeholder
    await page.getByRole('textbox', { name: 'Enter a condition for path.' }).fill('Check if the order is marked as high risk');

    // ── Step 5: Save the Multiple Paths step ────────────────────────────────
    // data-testid='save-button' (saveButtonV3.tsx)
    await page.getByTestId('save-button').click();

    // ── Step 6: Click 'Add or drag step here' inside the Else branch ─────────
    // The if-block renders two branches: Path 1 (false/left) and Else (true/right)
    // nth(0) = Path 1 branch, nth(1) = Else branch
    await page.getByText('Add or drag step here').nth(1).click();

    // ── Step 7: Search for Slack in the Add Step panel ───────────────────────
    // data-testid='trigger-search-input' (AddStepSearchView.tsx line 476)
    await page.getByTestId('trigger-search-input').fill('slack');

    // ── Step 8: Select the Slack option from results ─────────────────────────
    // Search renders results as Autocomplete options (role='option'), not ConnectedAppsRenderer items
    await page.getByRole('option', { name: /^Slack$/i }).click();

    // ── Step 8b: Select 'Send Message' action from the Slack actions list ────
    // After selecting Slack app, the action list opens — must pick an action first
    // data-testid='trigger-action-item' (ActionsListAutocomplete.tsx line 200), filtered by text
    await page.getByTestId('trigger-action-item').filter({ hasText: 'Send Message' }).first().click();

    // ── Step 9: Click auth connection chip to connect Slack account ──────────
    // data-testid='auth-connection-chip' (BasicAndAuth2.tsx line 640)
    await page.getByTestId('auth-connection-chip').click();

    // ── Step 10: Select the existing Slack connection ───────────────────────
    // Text 'something' is the existing connection label — no data-testid on connection list items
    await page.getByText('something').click();
    // Wait for the plugin form to reload with fields after connection is selected
    await page.waitForTimeout(3000);

    // ── Step 11: Click 'Select Slack channel(s)' button inside channel_id field ──
    // Scope to plugin-field-channel_id to avoid ambiguity; wait for button to be visible
    await page.getByTestId('plugin-field-channel_id').getByRole('button', { name: 'Select Slack channel(s)' }).click();

    // ── Step 12: Wait for the channel dropdown and select the channel ─────────
    await page.getByText('fraud-review (C0AQTGJ23DM)').waitFor({ state: 'visible', timeout: 10000 });
    await page.getByText('fraud-review (C0AQTGJ23DM)').click();

    // ── Step 13: Click outside the dropdown to close it and confirm channel ───
    // Click on the plugin-field-content area to dismiss the channel picker
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // ── Step 14: Click the Message Content field and close variable popover ──
    // data-testid='plugin-field-content' (pluginHocV2.tsx line 592) — confirmed from DOM snapshot
    await page.getByTestId('plugin-field-content').getByRole('textbox').click();
    // data-testid='variable-popover-close-button' (VariablePopoverMenu.tsx line 484)
    await page.getByTestId('variable-popover-close-button').click();

    // ── Step 14b: Fill the message content ───────────────────────────────────
    await page.getByTestId('plugin-field-content').getByRole('textbox').fill(
      'Order Alert: orderId amount paymentMethod'
    );

    // ── Step 15: Test the Slack step (dry run) ───────────────────────────────
    // data-testid='dry-run-test-button' (pluginButton/dryRunButton.tsx line 177)
    await page.getByTestId('dry-run-test-button').click();

    // ── Step 16: Save the Slack step ────────────────────────────────────────
    // data-testid='save-button' (saveButtonV3.tsx)
    await page.getByTestId('save-button').click();

    console.log('✅ Multiple Paths added, Slack step configured in first branch, tested and saved');
  });

  test('TC-WF-005: Add API Call step, open API Editor, fill URL, test and save', async ({ page }) => {

    // ── Step 1: Navigate to the SAME flow created in TC-WF-001 ─────────────
    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF-001 before this test runs').toBeTruthy();
    await page.goto(storedFlowPageUrl);
    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });

    // ── Step 1b: Dismiss Flow Document popover if present ────────────────────
    // The popover intercepts pointer events on the canvas — dismiss before interacting
    const closePopover5 = page.getByRole('button', { name: '× Close' });
    if (await closePopover5.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closePopover5.click();
    }

    // ── Step 2: Click Add Step on the canvas ────────────────────────────────
    // data-testid='add-step-button' (canvas)
    await page.getByTestId('add-step-button').click();

    // ── Step 3: Select API Call from the Add Step panel ──────────────────────
    // data-testid='builtin-tool-option' (AddStepSearchView.tsx line 434), filtered by text
    await page.getByTestId('builtin-tool-option').filter({ hasText: /API Call/i }).first().click();

    // ── Step 4: Open the API Editor accordion ────────────────────────────────
    // data-testid='api-slider-editor-accordion-summary' (apiSliderV2.tsx line 144)
    // Use force:true to bypass any overlay interception
    await page.getByTestId('api-slider-editor-accordion-summary').click({ force: true });

    // ── Step 5: Fill the URL input field ─────────────────────────────────────
    // placeholder='https://flow.viasocket.com/' (apiInputField.tsx line 108)
    // Must fill a URL to enable the Test button
    await page.getByPlaceholder('https://flow.viasocket.com/').click();
    await page.getByPlaceholder('https://flow.viasocket.com/').fill('https://flow.sokt.io/func/scripRAncoeV');

    // ── Step 6: Close the variable popover that opens on URL focus ───────────
    // data-testid='variable-popover-close-button' (VariablePopoverMenu.tsx line 484)
    await page.getByTestId('variable-popover-close-button').click();

    // ── Step 7: Click the body/code textbox inside the tab panel ────────────
    // Scoped to tabpanel, empty textbox — no data-testid on this editor
    await page.getByRole('tabpanel').getByRole('textbox').filter({ hasText: /^$/ }).click();
    await page.getByRole('tabpanel').getByRole('textbox').fill('{\n  "orderId": context.req.body?.["orderId"],\n  "amount": context.req.body?.["amount"]\n}');

    // ── Step 8: Test the API Call step (dry run) ─────────────────────────────
    // data-testid='dry-run-step-test-button' (dryRunButtonForFunctionApiPlugin/dryRunButton.tsx line 228)
    await page.getByTestId('dry-run-step-test-button').click();

    // ── Step 9: Close the input variables modal if it appears ────────────────
    // data-testid='input-variables-close-btn' (customVariablesComponent.tsx line 137)
    const inputVarsClose5 = page.getByTestId('input-variables-close-btn');
    if (await inputVarsClose5.isVisible({ timeout: 4000 }).catch(() => false)) {
      await inputVarsClose5.click();
    }

    // ── Step 10: Save the API Call step ──────────────────────────────────────
    // data-testid='save-button' (saveButtonV3.tsx)
    await page.getByTestId('save-button').click();

    console.log('✅ API Call step added, API Editor opened, URL filled, tested and saved');
  });

  test('TC-WF-006: Add Memory step, create a record with JSON data, test and save', async ({ page }) => {

    // ── Step 1: Navigate to the SAME flow created in TC-WF-001 ─────────────
    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF-001 before this test runs').toBeTruthy();
    await page.goto(storedFlowPageUrl);
    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });

    // ── Step 1b: Dismiss Flow Document popover if present ────────────────────
    const closePopover6 = page.getByRole('button', { name: '× Close' });
    if (await closePopover6.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closePopover6.click();
    }

    // ── Step 2: Click Add Step on the canvas ────────────────────────────────
    await page.getByTestId('add-step-button').click();

    // ── Step 3: Search for Memory in the Add Step panel ──────────────────────
    // data-testid='trigger-search-input' (AddStepSearchView.tsx)
    await page.getByTestId('trigger-search-input').fill('memory');

    // ── Step 4: Select the Memory app from search results ────────────────────
    // data-testid='connectedApp-memory' (ConnectedAppsRenderer.tsx line 44)
    // Search renders results as Autocomplete options (role='option'), not ConnectedAppsRenderer items
    await page.getByRole('option', { name: /^Memory$/i }).click();

    // ── Step 5: Select 'Create a record' action ───────────────────────────────
    // data-testid='trigger-action-item' (ActionsListAutocomplete.tsx line 200), filtered by text
    await page.getByTestId('trigger-action-item').filter({ hasText: /Create a record/i }).first().click();

    // ── Step 6: Click auth connection chip ───────────────────────────────────
    // data-testid='auth-connection-chip' (BasicAndAuth2.tsx)
    await page.getByTestId('auth-connection-chip').click();

    // ── Step 7: Click the Collection field ───────────────────────────────────
    await page.getByLabel('Collection').click();

    // ── Step 8: Click 'Select Data Type' button ───────────────────────────────
    await page.getByRole('button', { name: 'Select Data Type' }).click();

    // ── Step 9: Select JSON data type ────────────────────────────────────────
    await page.getByRole('option', { name: 'JSON' }).click();

    // ── Step 10: Click the JSON string textbox ───────────────────────────────
    // data-testid='plugin-field-json_string' (pluginHocV2.tsx line 592)
    await page.getByTestId('plugin-field-json_string').getByRole('textbox').click();

    // ── Step 11: Close the variable popover ──────────────────────────────────
    // data-testid='variable-popover-close-button' (VariablePopoverMenu.tsx)
    await page.getByTestId('variable-popover-close-button').click();

    // ── Step 12: Fill the JSON string field ──────────────────────────────────
    await page.getByTestId('plugin-field-json_string').getByRole('textbox').fill(
      '{\n  "orderId": "body.\\"orderId\\"",\n  "userId": "body.\\"userId\\"",\n  "amount": "body.\\"amount\\"",\n  "riskScore": "order_risk_assessment.normalizedOrder.riskScore",\n  "status": "processed"\n}'
    );

    // ── Step 13: Test the Memory step (dry run) ───────────────────────────────
    // data-testid='dry-run-test-button' (pluginButton/dryRunButton.tsx)
    await page.getByTestId('dry-run-test-button').click();

    // ── Step 14: Close the input variables modal if it appears ───────────────
    // data-testid='input-variables-close-btn' (customVariablesComponent.tsx)
    const inputVarsClose6 = page.getByTestId('input-variables-close-btn');
    if (await inputVarsClose6.isVisible({ timeout: 4000 }).catch(() => false)) {
      await inputVarsClose6.click();
    }

    // ── Step 15: Save the Memory step ────────────────────────────────────────
    // data-testid='save-button' (saveButtonV3.tsx)
    await page.getByTestId('save-button').click();

    console.log('✅ Memory step added, Create a record with JSON data, tested and saved');
  });

  test('TC-WF-007: Add Call AI Agent step, fill prompt, test and save', async ({ page }) => {

    // ── Step 1: Navigate to the SAME flow created in TC-WF-001 ─────────────
    expect(storedFlowPageUrl, 'Flow page URL must be stored by TC-WF-001 before this test runs').toBeTruthy();
    await page.goto(storedFlowPageUrl);
    await page.getByTestId('add-step-button').waitFor({ state: 'visible', timeout: 15000 });

    // ── Step 1b: Dismiss Flow Document popover if present ────────────────────
    const closePopover7 = page.getByRole('button', { name: '× Close' });
    if (await closePopover7.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closePopover7.click();
    }

    // ── Step 2: Click Add Step on the canvas ────────────────────────────────
    await page.getByTestId('add-step-button').click();

    // ── Step 3: Select 'Call AI Agent (Instant)' from the Add Step panel ────
    // data-testid='builtin-tool-option' (AddStepSearchView.tsx line 434), filtered by text
    await page.getByTestId('builtin-tool-option').filter({ hasText: /Call AI Agent/i }).first().click();

    // ── Step 4: Click the prompt textbox ────────────────────────────────────
    // Placeholder text from the plugin-rendered AI input field
    await page.getByRole('textbox', { name: /E.g., What is AI?/i }).click();

    // ── Step 5: Close the variable popover that opens on focus ──────────────
    // data-testid='variable-popover-close-button' (VariablePopoverMenu.tsx)
    await page.getByTestId('variable-popover-close-button').click();

    // ── Step 6: Fill the prompt textbox ─────────────────────────────────────
    await page.getByRole('textbox', { name: /E.g., What is AI?/i }).fill(
      'You are an e-commerce assistant.\n\nGenerate a short order summary:\n\nOrder ID: body."orderId"\nAmount: body."amount"\nItems: body."items"\n\nOutput format:\n- Summary (2 lines)\n- Tone: professional'
    );

    // ── Step 7: Test the AI Agent step (dry run) ─────────────────────────────
    // data-testid='dry-run-test-button' (pluginButton/dryRunButton.tsx)
    await page.getByTestId('dry-run-test-button').click();

    // ── Step 8: Close the input variables modal if it appears ────────────────
    // data-testid='input-variables-close-btn' (customVariablesComponent.tsx)
    const inputVarsClose7 = page.getByTestId('input-variables-close-btn');
    if (await inputVarsClose7.isVisible({ timeout: 4000 }).catch(() => false)) {
      await inputVarsClose7.click();
    }

    // ── Step 9: Save the AI Agent step ───────────────────────────────────────
    // data-testid='save-button' (saveButtonV3.tsx)
    await page.getByTestId('save-button').click();

    console.log('✅ Call AI Agent step added, prompt filled, tested and saved');
  });

});
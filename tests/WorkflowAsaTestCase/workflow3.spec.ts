import { test, expect } from '../../fixtures/base.fixture';

// Module-level storage for the flow page URL
let storedFlowPageUrl = '';

test.describe('Google Forms Trigger Workflow', () => {

  test('TC-GF-001: Create workflow with Google Forms trigger and store URL', async ({ page, dashboard, triggers, workflow }) => {
    await dashboard.navigateToProject('58109');
    await dashboard.clickCreateNewFlow();
    await triggers.triggerSearchInput.waitFor({ state: 'visible', timeout: 10000 });
    await triggers.searchTrigger('Google Form');
    await triggers.selectTriggerApp('Google Forms');
    await triggers.selectTriggerAction('New Form Response');
    await workflow.googleForms.selectForm('AUTOMATION TESTING');
    await workflow.googleForms.testTrigger();
    await workflow.googleForms.saveTrigger();

    await workflow.addStep.addStepButton.waitFor({ state: 'visible', timeout: 15000 });
    storedFlowPageUrl = page.url().split('?')[0];

    await expect(workflow.publish.goLiveButton).toBeVisible();
  });

  test('TC-GF-002: Add JS Code step to existing workflow', async ({ page, workflow, triggers }) => {
    await page.goto(storedFlowPageUrl);
    // await workflow.addStep.addStepButton.waitFor({ state: 'visible', timeout: 15000 });
    await workflow.clickTriggerNode();
    await workflow.testTrigger();

    await workflow.addStep.clickAddStep();

    await workflow.googleForms.selectJsCode()
    await page.getByRole('textbox', { name: 'Function Name' }).fill('normalize_lead_data');



    const code = `const lead = input;

// Validation
if (!lead.email || !lead.name) {
  throw new Error("Missing required fields");
}

// Normalize budget
let budget = parseInt(lead.budget) || 0;

// Normalize text
const normalizedLead = {
  name: lead.name.trim(),
  email: lead.email.toLowerCase(),
  company: lead.company || "Unknown",
  budget: budget,
  requirement: lead.requirement || "",
  createdAt: new Date().toISOString()
};

return {
  normalizedLead
};`;
    await workflow.googleForms.clickMentionsInput();
    await workflow.googleForms.mentionsInput.fill(code);
    await page.keyboard.press('Space');
    await workflow.jscode.clickAskAI();
    await workflow.jscode.chatbotChangesAppliedLink.waitFor({ state: 'visible', timeout: 60000 });
    await workflow.jscode.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.googleForms.closeInputVariablesModal();
    await workflow.jscode.save();

    await expect(workflow.publish.goLiveButton).toBeVisible();
  });

  test('TC-GF-003: Add AI Agent step and test workflow', async ({ page, workflow }) => {
    await page.goto(storedFlowPageUrl);

    await workflow.clickTriggerNode();
    await workflow.testTrigger();
    await workflow.closeSlider();
    await workflow.clickStepNode('normalize_lead_data');
    await workflow.clickDryRunStepTestButton();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.aiAgent.closeInputVariablesModal();
    await workflow.closeSlider();
    await workflow.addStep.clickAddStep();
    await workflow.addStep.selectStepByText('Call AI Agent (Instant)');
    const aiPrompt = `You are a sales qualification assistant.
Give:
1. Lead Score (0–100)
2. Category: Hot / Warm / Cold
3. Reason (1 line)

Output in JSON:
{
  "score": number,
  "category": "Hot|Warm|Cold",
  "reason": "text"
}
  Evaluate this lead:
  noramlize lead data is: `;

    await workflow.aiAgent.queryInput.click();
    await workflow.aiAgent.queryInput.fill(aiPrompt);
    await page.getByTestId('add-variable-button').click();
    await page.getByText('normalize_lead_data').click();
    await workflow.aiAgent.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.aiAgent.closeInputVariablesModal();

    await workflow.aiAgent.save();
    await page.waitForTimeout(3000);
  });
  test('TC-GF-004: Add JS-step to formate ai agent data', async ({ page, workflow }) => {
    await page.goto(storedFlowPageUrl);

    await workflow.clickTriggerNode();
    await workflow.testTrigger();

    await workflow.clickStepNode('normalize_lead_data');
    await workflow.jscode.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.clickStepNode('Call_AI_Agent_Instantly');
    await workflow.aiAgent.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.aiAgent.closeInputVariablesModal();

    await workflow.addStep.clickAddStep();
    await workflow.addStep.selectStepByText('JS Code');

    const jsPrompt = `1. Extract content from AI response.
2. Remove markdown formatting.
3. Parse the JSON content.
4. Return score, category, and reason.`;

    await workflow.jscode.fillMentionsInput(jsPrompt);
    await page.keyboard.press('Space');
    await workflow.jscode.clickAskAiInStepConfig();
    await workflow.jscode.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.jscode.closeInputVariablesModal();
    await workflow.jscode.save();
  });

  test('TC-GF-005: Add if-condition to filter data', async ({ workflow, page }) => {
    await page.goto('https://beta-flow.viasocket.com/projects/58109/proj58109/workflow/scrivNKgATVf/draft');

    await workflow.clickTriggerNode();
    await workflow.testTrigger();

    await workflow.clickStepNode('normalize_lead_data');
    await workflow.jscode.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.clickStepNode('Call_AI_Agent_Instantly');
    await workflow.aiAgent.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.aiAgent.closeInputVariablesModal();

    await workflow.clickStepNode('extract_and_parse_ai_response');
    await workflow.jscode.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.addStep.clickAddStep();
    await workflow.addStep.selectStepByText('Multiple Paths (If Conditions)');
    await workflow.multipath.fillCondition('Check if the AI response category is Cold');
    await workflow.multipath.save();
    await workflow.multipath.addmorecondition();
    await workflow.multipath.fillCondition('Check if the AI response category is Hot');
    await workflow.multipath.dismissOverlays();
    await workflow.jscode.clickAskAiInStepConfig();
  })
  test('TC-GF-006: send message to slack', async ({ workflow, page }) => {
    await page.goto(storedFlowPageUrl);

    await workflow.clickTriggerNode();
    await workflow.testTrigger();

    await workflow.clickStepNode('normalize_lead_data');
    await workflow.jscode.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.clickStepNode('Call_AI_Agent_Instantly');
    await workflow.aiAgent.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.aiAgent.closeInputVariablesModal();

    await workflow.clickStepNode('extract_and_parse_ai_response');
    await workflow.jscode.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.jscode.closeInputVariablesModal();


    await page.locator('#Cold-inner-content').getByText('Add or drag step here').click();
    await page.getByTestId('trigger-search-input').fill('slack');
    await page.getByTestId('add-step-slider').getByText('Slack', { exact: true }).click();
    await page.getByTestId('add-step-slider').getByText('Send Message').click();
    await page.getByTestId('auth-connection-chip').click();
    await page.getByTestId('auth-connection-item-auth2CKqZkbo_rowbu58rc').click();
    await page.getByRole('button', { name: 'Select Slack channel(s)' }).click();
    await page.getByText('all-test (C0ARQ0XRVAA)').click();
    await page.locator('div').filter({ hasText: /^all-test$/ }).first().click();
    await page.getByTestId('mentions-input-content').fill(`🔥 New Hot Lead

Name: {{body."Full_name"}}
Company: {{body."Company"}}
Score: {{body."Budget"}}

Requirement:
{{body."Requirement"}}`);
    await page.getByTestId('dry-run-test-button').click();
    await page.getByTestId('save-button').click();
  })
  test('TC-GF-007: send email for hot leads', async ({ workflow, page }) => {
    await page.goto(storedFlowPageUrl);  
    await workflow.clickTriggerNode();
    await workflow.testTrigger();

    await workflow.clickStepNode('normalize_lead_data');
    await workflow.jscode.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.clickStepNode('Call_AI_Agent_Instantly');
    await workflow.aiAgent.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.aiAgent.closeInputVariablesModal();

    await workflow.clickStepNode('extract_and_parse_ai_response');
    await workflow.jscode.clickTest();
    await page.getByRole('button', { name: 'Test' }).click();
    await workflow.jscode.closeInputVariablesModal();
 

    await page.locator('#Hot-inner-content').getByText('Add or drag step here').click();
  await page.getByTestId('trigger-search-input').fill('gmail');
  await page.getByTestId('add-step-slider').getByText('Gmail', { exact: true }).click();
  await page.getByTestId('add-step-slider').getByText('Send Email With Attachments').click();
  await page.getByTestId('mentions-input-to').click();
  await page.getByTestId('mentions-input-to').fill('sc@Viasocket.com');
  await page.getByTestId('mentions-input-subject').click();
  await page.getByTestId('mentions-input-to').fill('sc@Viasocket.com ');
  await page.getByTestId('mentions-input-subject').fill('automatoin testing workflow');
  await page.getByTestId('dropdown-chip-messageType').click();
  await page.getByRole('option', { name: 'Plain' }).click();
  await page.getByTestId('mentions-input-messageBody').click();
  await page.getByTestId('mentions-input-messageBody').fill('hii suraj choudhary,\nautomation testing workflow is runnig till this step,and this is if condition hot lead block');
  await page.getByTestId('dry-run-test-button').click();
  await page.getByTestId('save-button').click();
  })
});

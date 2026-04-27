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

  test('TC-GF-002: Add JS Code step to existing workflow', async ({ page, workflow }) => {
    await page.goto(storedFlowPageUrl);
    await workflow.clickTriggerNode();
    await workflow.testTrigger();

    await workflow.addStep.clickAddStep();
    await workflow.googleForms.selectJsCode();

    const code = `1. Define lead object with provided variables.
2. Validate email and name.
3. Normalize lead data.
4. Calculate budget score.
5. Return normalized lead and budget score.`;
    await workflow.googleForms.clickMentionsInput();
    await workflow.googleForms.mentionsInput.fill(code);
    await page.keyboard.press('Space');
    await workflow.jscode.clickAskAI();
    await workflow.jscode.chatbotChangesAppliedLink.waitFor({ state: 'visible', timeout: 60000 });
    await workflow.jscode.fillFunctionName('normalize_lead_data');
    await workflow.jscode.clickTest();
    await workflow.jscode.clickTestButtonInModal();
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
    await workflow.jscode.clickTestButtonInModal();
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
    await workflow.aiAgent.clickAddVariableButton();
    await workflow.aiAgent.selectVariableByText('normalize_lead_data');
    await workflow.aiAgent.clickTest();
    await workflow.aiAgent.clickTestButtonInModal();
    await workflow.aiAgent.closeInputVariablesModal();

    await workflow.aiAgent.save();
    await page.waitForTimeout(3000);
  });


  test('TC-GF-004: Add JS-step to formate ai agent data', async ({ page, workflow }) => {
    await page.goto(storedFlowPageUrl);

    await workflow.clickTriggerNode();
    await workflow.testTrigger();
    await page.waitForTimeout(5000);

    await workflow.clickStepNode('normalize_lead_data');
    await workflow.jscode.clickTest();
    await workflow.jscode.clickTestButtonInModal();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.clickStepNode('Call_AI_Agent_Instantly');
    await workflow.aiAgent.clickTest();
    await workflow.aiAgent.clickTestButtonInModal();
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
    await workflow.jscode.clickTestButtonInModal();
    await workflow.jscode.closeInputVariablesModal();
    await workflow.jscode.save();
  });

  test('TC-GF-005: Add if-condition to filter data', async ({ workflow, page }) => {
    await page.goto(storedFlowPageUrl);

    await workflow.clickTriggerNode();
    await workflow.testTrigger();
    await page.waitForTimeout(5000);

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
    await page.waitForTimeout(1000);
    await workflow.addStep.selectStepByText('Multiple Paths (If Conditions)');
    // await workflow.multipath.fillCondition('Check if the AI response category is Cold');
    await page.getByTestId('mentions-input').click();
    await page.keyboard.type('Check if the AI response category is Cold');
    await workflow.multipath.save();

    await workflow.multipath.addmorecondition();
    await page.keyboard.type('Check if the AI response category is Hot');

    await workflow.jscode.clickAskAiInStepConfig();
    await page.waitForTimeout(5000);
  })

  test('TC-GF-006: send message to slack', async ({ workflow, page }) => {
    await page.goto(storedFlowPageUrl);

    await workflow.clickTriggerNode();
    await workflow.testTrigger();
    await page.waitForTimeout(5000);

    await workflow.clickStepNode('normalize_lead_data');
    await workflow.jscode.clickTest();
    await workflow.jscode.clickTestButtonInModal();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.clickStepNode('Call_AI_Agent_Instantly');
    await workflow.aiAgent.clickTest();
    await workflow.aiAgent.clickTestButtonInModal();
    await workflow.aiAgent.closeInputVariablesModal();

    await workflow.clickStepNode('extract_and_parse_ai_response');
    await workflow.jscode.clickTest();
    await workflow.jscode.clickTestButtonInModal();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.multipath.clickAddStepInPath('Cold');
    await workflow.addStep.searchStep('slack');
    await workflow.addStep.selectStepByText('Slack');
    await workflow.addStep.selectStepByText('Send Message');
    await workflow.slack.selectAuthConnection('auth2CKqZkbo_rowbu58rc');
    await workflow.slack.selectChannel('all-test (C0ARQ0XRVAA)');
    await page.locator('div').filter({ hasText: /^all-test$/ }).first().click();

    await workflow.slack.clickAddVariableButton();
    await workflow.slack.selectVariableByText('extract_and_parse_ai_response');
    await workflow.slack.clickTest();
    await workflow.slack.clickTestButtonInModal();
    await workflow.slack.closeInputVariablesModal();
    await workflow.slack.save();
  })

  test('TC-GF-007: send email for hot leads', async ({ workflow, page }) => {
    await page.goto(storedFlowPageUrl);
    await workflow.clickTriggerNode();
    await workflow.testTrigger();
    await page.waitForTimeout(5000);

    await workflow.clickStepNode('normalize_lead_data');
    await workflow.jscode.clickTest();
    await workflow.jscode.clickTestButtonInModal();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.clickStepNode('Call_AI_Agent_Instantly');
    await workflow.aiAgent.clickTest();
    await workflow.aiAgent.clickTestButtonInModal();
    await workflow.aiAgent.closeInputVariablesModal();

    await workflow.clickStepNode('extract_and_parse_ai_response');
    await workflow.jscode.clickTest();
    await workflow.jscode.clickTestButtonInModal();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.multipath.clickAddStepInPath('Hot');
    await workflow.addStep.searchStep('gmail');
    await workflow.addStep.selectStepByText('Gmail');
    await workflow.addStep.selectStepByText('Send Email With Attachments');
    await page.getByTestId('auth-connection-chip').click();
    await page.getByTestId('auth-connection-item-auth27YL3YAZ_rowo0bqrhj5g').click();
    await workflow.gmail.fillToMentionsInput('sc@Viasocket.com');
    await page.keyboard.press('Space');
    await workflow.gmail.fillSubjectMentionsInput('automatoin testing workflow');
    await page.keyboard.press('Space');
    await workflow.gmail.fillMessageBodyMentionsInput('hii suraj choudhary,\nautomation testing workflow is runnig till this step,and this is if condition hot lead block');
    await workflow.gmail.clickTest();
    await workflow.gmail.save();
  })

  test('TC-GF-008: workspace memory', async ({ workflow, page }) => {
    await page.goto(storedFlowPageUrl);
    await workflow.clickTriggerNode();
    await workflow.testTrigger();
    await page.waitForTimeout(5000);

    await workflow.clickStepNode('normalize_lead_data');
    await workflow.jscode.clickTest();
    await workflow.jscode.clickTestButtonInModal();
    await workflow.jscode.closeInputVariablesModal();

    await workflow.clickStepNode('Call_AI_Agent_Instantly');
    await workflow.aiAgent.clickTest();
    await workflow.aiAgent.clickTestButtonInModal();
    await workflow.aiAgent.closeInputVariablesModal();

    await workflow.clickStepNode('extract_and_parse_ai_response');
    await workflow.jscode.clickTest();
    await workflow.jscode.clickTestButtonInModal();
    await workflow.jscode.closeInputVariablesModal();


    await workflow.addStep.clickAddStep();
    await workflow.addStep.searchStep('workspace memory');
    await workflow.addStep.selectStepByText('Workspace Memory');
    await workflow.workspaceMemory.selectAuthConnection('auth2XzbNsrW_rowhc2623dta');
    await workflow.workspaceMemory.fillUniqueId('abc123');
    await page.keyboard.press('Space');

    const workspaceCode = `
   async function saveLeadData() {
  const key = "leadData";

  const leadRecord = {
    email: context.req?.body?.Email,
    name: context.req?.body?.Full_name,
    company: context.req?.body?.Company,
    budget: context.req?.body?.Budget,
    score: context.res.normalize_and_score_lead?.budgetScore,
    category: context.res.parse_and_return_ai_response?.category
  };
  let existingData = await findFromMemory(key, []);

  if (!Array.isArray(existingData)) {
    existingData = [];
  }

  existingData.push(leadRecord);

  await updateInMemory(key, existingData);

  return leadRecord;
}

return await saveLeadData();
`;
    await workflow.workspaceMemory.fillAiCode(workspaceCode);
    await page.keyboard.press('Space');
    await workflow.workspaceMemory.clickAskAi();
    await page.waitForTimeout(5000);
    await workflow.workspaceMemory.clickTest();
    await workflow.workspaceMemory.clickTestButtonInModal();
    await workflow.workspaceMemory.closeInputVariablesModal();
    await workflow.workspaceMemory.save();
  })

});

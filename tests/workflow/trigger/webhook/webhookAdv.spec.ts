import { test, expect } from '../../../../fixtures/base.fixture';

test.describe('Webhook Advance Config', () => {
    test('create new flow and select webhook trigger', async ({ workspace, dashboard, triggers, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.clickCreateNewFlow();
        await workflow.flowTitleInput.click();
        await workflow.flowTitleInput.fill('webhook_adance_config_testcases');
        await workflow.flowTitleInput.press('Tab');
        await triggers.selectWebhookTrigger();
    });
});

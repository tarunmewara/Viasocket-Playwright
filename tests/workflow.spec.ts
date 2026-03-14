import { test, expect } from '../fixtures/base.fixture';
import { DashboardPage } from '../pages/DashboardPage';
import { TriggersPage } from '../pages/TriggersPage';
import { WorkflowPage } from '../pages/WorkflowPage';

test.describe('Workflow Tests', () => {

    // storageState is configured globally in playwright.config.ts via STORAGE_STATE env var
    test.beforeEach(async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.navigateToOrg();
        await dashboardPage.selectOrganization();
        await dashboardPage.clickCreateNewFlow();
    });

    test('Make Flow Live', async ({ page }) => {
        const triggersPage = new TriggersPage(page);
        const workflowPage = new WorkflowPage(page);

        await triggersPage.clickSelectTriggerDiv();
        await triggersPage.selectWebhookTrigger();
        await triggersPage.hideFullscreen();

        await workflowPage.selectActionEvent();
        await workflowPage.selectJSCodeAction();
        await workflowPage.selectCodeSubAction();
        await workflowPage.fillCodeEditor('return true');

        await workflowPage.clickTestSaveGroup();
        await workflowPage.clickTest();
        await workflowPage.clickSave();
        await workflowPage.clickGoLive();
        await workflowPage.confirmGoLiveYes();
        await workflowPage.clickClose();
    });

    test('Feedback to Workflow', async ({ page }) => {
        const triggersPage = new TriggersPage(page);
        const workflowPage = new WorkflowPage(page);

        await triggersPage.clickSelectTriggerDiv();
        await triggersPage.selectWebhookTrigger();
        await triggersPage.hideFullscreen();

        await workflowPage.selectActionEvent();
        await workflowPage.selectJSCodeAction();
        await workflowPage.selectCodeSubAction();
        await workflowPage.fillCodeEditor('return true');

        await workflowPage.clickTestSaveGroup();
        await workflowPage.clickTest();
        await workflowPage.clickSave();
        await workflowPage.clickGoLive();
        await workflowPage.confirmGoLiveYes();

        await workflowPage.clickProvideFeedback();
        await workflowPage.fillFeedback('this is only for testing, kindly ignore this');
        await workflowPage.submitIdea();
    });

    test('Pause a Workflow', async ({ page }) => {
        const triggersPage = new TriggersPage(page);
        const workflowPage = new WorkflowPage(page);

        await triggersPage.clickSelectTriggerDiv();
        await triggersPage.selectWebhookTrigger();
        await triggersPage.hideFullscreen();

        await workflowPage.pauseWorkflow();
    });

});

import { test, expect } from '../fixtures/base.fixture';
import { DashboardPage } from '../pages/DashboardPage';
import { TriggersPage } from '../pages/TriggersPage';
import { WorkflowPage } from '../pages/WorkflowPage';

test.describe('Triggers Tests', () => {

    // storageState is configured globally in playwright.config.ts via STORAGE_STATE env var
    test.beforeEach(async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.navigateToOrg();
        await dashboardPage.selectOrganization();
        await dashboardPage.clickCreateNewFlow();
    });

    test('Create new flow button', async ({ page }) => {
        // Only basic flow creation required (handled in beforeEach)
    });

    test('Add Webhook Only', async ({ page }) => {
        const triggersPage = new TriggersPage(page);

        await triggersPage.clickSelectTriggerText();
        await triggersPage.selectWebhookTrigger();
        await triggersPage.hideFullscreen();
    });

    test('Add Webhook with IF Condition', async ({ page }) => {
        const triggersPage = new TriggersPage(page);

        await triggersPage.clickSelectTriggerText();
        await triggersPage.selectWebhookTrigger();
        await triggersPage.hideFullscreen();

        await triggersPage.clickRunFlowIf();
        await triggersPage.enableRunFlowIf();
        await triggersPage.fillCondition('if 3>2');
        await triggersPage.clickBackdrop();
        await triggersPage.clickBackdrop();
        await triggersPage.hideFullscreen();
        await triggersPage.clickTest();
    });

    test('Add Cron with Basic Condition', async ({ page }) => {
        const triggersPage = new TriggersPage(page);

        await triggersPage.clickSelectTriggerDiv();
        await triggersPage.selectCronTrigger();
        await triggersPage.fillCronExpression('daily 4 pm');
        await triggersPage.clickSetCron();
    });

    test('Add Cron with Add and Get Data', async ({ page }) => {
        const triggersPage = new TriggersPage(page);
        const workflowPage = new WorkflowPage(page);

        await triggersPage.clickSelectTriggerDiv();
        await triggersPage.selectCronTrigger();
        await triggersPage.fillCronExpression('daily 4pm');
        await triggersPage.clickSetCron();
        await triggersPage.clickCronResult('daily at 4pm');
        await triggersPage.clickGetData();

        await workflowPage.selectJSCodeAction();
        await workflowPage.selectCodeSubAction();
        await workflowPage.fillCodeEditor('return true');
        await workflowPage.clickTest();
        await workflowPage.clickSave();
        await triggersPage.hideFullscreen();
    });

    test('Cron Add, Get Data, and Loop', async ({ page }) => {
        const triggersPage = new TriggersPage(page);
        const workflowPage = new WorkflowPage(page);

        await triggersPage.clickSelectTriggerDiv();
        await triggersPage.selectCronTrigger();
        await triggersPage.fillCronExpression('daily 4 pm');
        await triggersPage.clickSetCron();
        await triggersPage.clickCronResult('daily at 4 PM');
        await triggersPage.clickGetData();

        await workflowPage.selectJSCodeAction();
        await workflowPage.selectCodeSubAction();
        await workflowPage.fillCodeEditor('return true');
        await workflowPage.clickTest();
        await workflowPage.clickSave();

        await triggersPage.clickSwitch();
        await triggersPage.hideFullscreen();
    });

    test('Add Plugin As a Trigger', async ({ page }) => {
        const triggersPage = new TriggersPage(page);

        await triggersPage.clickSelectTriggerDiv();
        await triggersPage.searchTrigger('google sheet');
        await triggersPage.selectPlugin('Google Sheets');
        await triggersPage.selectPluginEvent('New or Updated Spreadsheet');
        await triggersPage.clickChooseSpreadsheet();
        await triggersPage.selectSpreadsheet('testing (');
        await triggersPage.clickChooseSheet();
        await triggersPage.selectSheet('Sheet1 (0)');
        await triggersPage.checkNoRadio();
        await triggersPage.clickTest();
        await triggersPage.clickSave();
    });

    test('Add Plugin with If Condition', async ({ page }) => {
        const triggersPage = new TriggersPage(page);

        await triggersPage.clickSelectTriggerDiv();
        await triggersPage.searchTrigger('google sheets');
        await triggersPage.selectPlugin('Google Sheets');
        await triggersPage.selectPluginEvent('New or Updated Spreadsheet Row');
        await triggersPage.clickChooseSpreadsheet();
        await triggersPage.selectSpreadsheet('testing (');
        await triggersPage.clickChooseSheet();
        await triggersPage.selectSheet('Sheet1 (0)');
        await triggersPage.checkNoRadio();
        await triggersPage.clickTest();
        await triggersPage.clickSave();

        await triggersPage.clickRunFlowIf();
        await triggersPage.enableRunFlowIf();
        await triggersPage.fillCondition('if 3>4');

        // The condition input popup obscures the Test button. We must click out of it.
        await triggersPage.clickBackdrop();
        await triggersPage.clickTest();
        await triggersPage.hideFullscreen();
    });

});

import { test, expect } from '../../../../fixtures/base.fixture';

test.describe('Webhook Trigger', () => {
    test('create new flow and select webhook trigger', async ({ page, workspace, dashboard, triggers, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.clickCreateNewFlow();
        await workflow.flowTitleInput.click();
        await workflow.flowTitleInput.fill('webhook_test_cases_workflow');
        await workflow.flowTitleInput.press('Tab');
        await triggers.selectWebhookTrigger();
    });

    test('search and open webhook flow', async ({ page, workspace, dashboard }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
    });

    test('webhook node is visible on canvas', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await expect(workflow.inflowWebhookNode).toBeVisible();
    });

    test('webhook slider opens on click', async ({ page, workspace, dashboard, workflow, triggers }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await expect(triggers.webhookTabs).toBeVisible();
    });

    test('copy button is visible in webhook slider', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await expect(page.getByTestId('copy-button')).toBeVisible();
    });

    test('copy button click works', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await page.getByTestId('copy-button').click();
    });

    test('code snippet language dropdown works', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await page.getByText('cURL', { exact: true }).click();
        await page.getByRole('option', { name: 'Node' }).click();
    });

    test('trigger webhook button is visible', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await expect(page.getByRole('button', { name: 'Trigger this webhook' })).toBeVisible();
    });

    test('trigger webhook button click works', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await page.getByRole('button', { name: 'Trigger this webhook' }).click();
    });

    test('help button is visible', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await expect(page.getByTestId('help-button')).toBeVisible();
    });

    test('webhook slider can be closed', async ({ page, workspace, dashboard, workflow, triggers }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await triggers.slider.clickClose();
        await expect(triggers.webhookTabs).not.toBeVisible();
    });

    test('webhook payload tab is visible', async ({ page, workspace, dashboard, workflow, triggers }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await expect(triggers.webhookPayloadTab).toBeVisible();
    });

    test('webhook payload tab click works', async ({ page, workspace, dashboard, workflow, triggers }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await triggers.webhookPayloadTab.click();
    });

    test('change trigger button is visible', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await expect(workflow.cronChangeButton).toBeVisible();
    });

    test('change trigger button click works', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.inflowWebhookNode.click();
        await workflow.cronChangeButton.click();
    });

    test('delete webhook flow', async ({ page, workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.openSearchPanel();
        await dashboard.searchFlows('webhook_test_cases_workflow');
        await dashboard.selectSearchResult();
        await workflow.flowMoreOptionsButton.click();
        await page.getByText('Move To Trash').click();
        await workflow.flowDeleteConfirmButton.click();
    });
});

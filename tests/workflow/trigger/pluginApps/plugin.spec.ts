import { test, expect } from '../../../../fixtures/base.fixture';

const PROJECT_ID = '58104';
const PLUGIN_NAME = 'Gmail';
const ACTION_SEARCH_TERM = 'new email';
const SECOND_ACTION_SEARCH_TERM = 'send';
const CRON_STATEMENT = 'Every day at 9am';

test.describe('Plugin App Trigger', () => {

    test.beforeEach(async ({ dashboard }) => {
        await dashboard.navigateToProject(PROJECT_ID);
        await dashboard.clickCreateNewFlow();
    });

    test('TC-PLG-EASY-001: Trigger search input is visible on new flow', async ({ triggers }) => {
        await expect(triggers.triggerSearchInput).toBeVisible();
    });

    test('TC-PLG-EASY-002: Trigger option list is visible on new flow', async ({ triggers }) => {
        await expect(triggers.triggerOption.first()).toBeVisible();
    });

    test('TC-PLG-EASY-003: Searching plugin updates trigger search value', async ({ triggers }) => {
        await triggers.searchTrigger(PLUGIN_NAME);
        await expect(triggers.triggerSearchInput).toHaveValue(PLUGIN_NAME);
    });

    test('TC-PLG-EASY-004: Searching plugin shows matching trigger option', async ({ triggers }) => {
        await triggers.searchTrigger(PLUGIN_NAME);
        await expect(triggers.pluginOptionByName(PLUGIN_NAME)).toBeVisible();
    });

    test('TC-PLG-EASY-005: Selecting plugin opens plugin action list', async ({ triggers }) => {
        await triggers.selectPluginTrigger(PLUGIN_NAME);

        await expect(triggers.triggerSearchInput).not.toBeVisible();
        await expect(triggers.triggerActionItem.first()).toBeVisible();
    });

    test('TC-PLG-EASY-006: Plugin action search input is visible after plugin selection', async ({ triggers }) => {
        await triggers.selectPluginTrigger(PLUGIN_NAME);
        await expect(triggers.actionSearchInput).toBeVisible();
    });

    test('TC-PLG-EASY-007: Plugin action list shows trigger items', async ({ triggers }) => {
        await triggers.selectPluginTrigger(PLUGIN_NAME);
        await expect(triggers.triggerActionItem.first()).toBeVisible();
    });

    test('TC-PLG-EASY-008: Action search accepts input value', async ({ triggers }) => {
        await triggers.selectPluginTrigger(PLUGIN_NAME);
        await triggers.searchPluginAction(ACTION_SEARCH_TERM);

        await expect(triggers.actionSearchInput).toHaveValue(ACTION_SEARCH_TERM);
    });

    test('TC-PLG-EASY-009: Action search keeps action list visible', async ({ triggers }) => {
        await triggers.selectPluginTrigger(PLUGIN_NAME);
        await triggers.searchPluginAction(ACTION_SEARCH_TERM);

        await expect(triggers.triggerActionItem.first()).toBeVisible();
    });

    test('TC-PLG-EASY-010: Back button is visible in plugin action list', async ({ triggers }) => {
        await triggers.selectPluginTrigger(PLUGIN_NAME);
        await expect(triggers.pluginTriggerBackButton).toBeVisible();
    });

    test('TC-PLG-EASY-011: Clicking back returns user to trigger search list', async ({ triggers }) => {
        await triggers.selectPluginTrigger(PLUGIN_NAME);
        await triggers.goBackFromPluginActions();

        await expect(triggers.triggerSearchInput).toBeVisible();
        await expect(triggers.triggerOption.first()).toBeVisible();
    });

    test('TC-PLG-EASY-012: User can search plugin again after returning back', async ({ triggers }) => {
        await triggers.selectPluginTrigger(PLUGIN_NAME);
        await triggers.goBackFromPluginActions();
        await triggers.searchTrigger(PLUGIN_NAME);

        await expect(triggers.pluginOptionByName(PLUGIN_NAME)).toBeVisible();
    });

    test('TC-PLG-EASY-013: Close button is not available on trigger list for first-time trigger setup', async ({ triggers }) => {
        await expect(triggers.triggerSearchInput).toBeVisible();
        await expect(triggers.slider.closeButton).not.toBeVisible();
    });

    test('TC-PLG-EASY-015: Action search input can be updated with a second value', async ({ triggers }) => {
        await triggers.selectPluginTrigger(PLUGIN_NAME);
        await triggers.searchPluginAction(ACTION_SEARCH_TERM);
        await triggers.searchPluginAction(SECOND_ACTION_SEARCH_TERM);

        await expect(triggers.actionSearchInput).toHaveValue(SECOND_ACTION_SEARCH_TERM);
    });

  

    test('TC-PLG-MED-002: Change button allows changing plugin trigger to webhook', async ({ triggers, workflow }) => {
        await triggers.setPluginTriggerByName(PLUGIN_NAME);
        await workflow.clickTriggerChangeButton();

        await expect(triggers.triggerSearchInput).toBeVisible();
        await triggers.selectWebhookTrigger();
        await expect(workflow.setWebhookButton).toBeVisible();
        await workflow.confirmWebhookTrigger();

        await expect(workflow.inflowWebhookNode).toBeVisible();
    });

    test('TC-PLG-MED-003: Change button allows changing plugin trigger to cron', async ({ triggers, workflow }) => {
        await triggers.setPluginTriggerByName(PLUGIN_NAME);
        await workflow.clickTriggerChangeButton();

        await expect(triggers.triggerSearchInput).toBeVisible();
        await triggers.selectCronTrigger();
        await triggers.cron.fillStatement(CRON_STATEMENT);
        await triggers.cron.save();

        await expect(workflow.inflowCronNode).toBeVisible();
    });



});


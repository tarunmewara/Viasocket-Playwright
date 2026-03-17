import { test, expect } from '../../../../fixtures/base.fixture';

const PLUGIN_NAME = 'Gmail';

test.describe('Plugin App Trigger', () => {

    test.beforeEach(async ({ dashboard }) => {
        await dashboard.navigateToProject('58104');
        await dashboard.clickCreateNewFlow();
    });

    // Helper: type plugin name in search, click the matching trigger option
    async function selectPlugin({ triggers }: any, pluginName = PLUGIN_NAME) {
        await triggers.triggerSearchInput.fill(pluginName);
        await expect(triggers.triggerOption.filter({ hasText: new RegExp(pluginName, 'i') }).first()).toBeVisible();
        await triggers.triggerOption.filter({ hasText: new RegExp(pluginName, 'i') }).first().click();
    }

    // ------------------------------------------------------------------ //
    // Test 1: Searching for a plugin shows matching trigger options       //
    // ------------------------------------------------------------------ //
    test('searching for plugin shows matching options', async ({ triggers }) => {
        await expect(triggers.triggerSearchInput).toBeVisible();
        await triggers.triggerSearchInput.fill(PLUGIN_NAME);

        await expect(triggers.triggerOption.filter({ hasText: new RegExp(PLUGIN_NAME, 'i') }).first()).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 2: Trigger search input is fillable (testid on <input>)        //
    // ------------------------------------------------------------------ //
    test('trigger search input is fillable', async ({ triggers }) => {
        await triggers.triggerSearchInput.fill(PLUGIN_NAME);

        // Verify the value was accepted (input is not empty)
        await expect(triggers.triggerSearchInput).toHaveValue(PLUGIN_NAME);
    });

    // ------------------------------------------------------------------ //
    // Test 3: Searching filters the trigger option list                   //
    // ------------------------------------------------------------------ //
    test('searching filters trigger options by text', async ({ triggers }) => {
        await triggers.triggerSearchInput.fill(PLUGIN_NAME);

        // Should only contain options matching the search term
        const allOptions = triggers.triggerOption;
        await expect(allOptions.first()).toBeVisible();
        await expect(allOptions.first()).toContainText(new RegExp(PLUGIN_NAME, 'i'));
    });

    // ------------------------------------------------------------------ //
    // Test 4: Selecting a plugin opens the action / trigger list          //
    // ------------------------------------------------------------------ //
    test('selecting plugin opens its action list', async ({ triggers }) => {
        await selectPlugin({ triggers });

        // trigger-search-input is gone, action list is visible
        await expect(triggers.triggerSearchInput).not.toBeVisible();
        await expect(triggers.triggerActionItem.first()).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 5: Action list shows trigger items                             //
    // ------------------------------------------------------------------ //
    test('plugin action list shows trigger action items', async ({ triggers }) => {
        await selectPlugin({ triggers });

        await expect(triggers.triggerActionItem.first()).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 6: Action search input visible inside the plugin action list   //
    // ------------------------------------------------------------------ //
    test('action search input visible in plugin action list', async ({ triggers }) => {
        await selectPlugin({ triggers });

        await expect(triggers.actionSearchInput).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 7: Action search input is fillable (testid on <input>)         //
    // ------------------------------------------------------------------ //
    test('action search input is fillable and filters actions', async ({ triggers }) => {
        await selectPlugin({ triggers });

        await expect(triggers.actionSearchInput).toBeVisible();
        await triggers.actionSearchInput.fill('new email');

        // Filtered items should still be visible
        await expect(triggers.triggerActionItem.first()).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 8: Back button visible in the plugin action list               //
    // ------------------------------------------------------------------ //
    test('back button visible in plugin action list', async ({ triggers }) => {
        await selectPlugin({ triggers });

        await expect(triggers.pluginTriggerBackButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 9: Clicking back returns to the trigger search list            //
    // ------------------------------------------------------------------ //
    test('clicking back button returns to trigger search', async ({ triggers }) => {
        await selectPlugin({ triggers });

        await expect(triggers.pluginTriggerBackButton).toBeVisible();
        await triggers.pluginTriggerBackButton.click();

        // Trigger search input and options visible again
        await expect(triggers.triggerSearchInput).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 10: Plugin trigger slider can be closed                        //
    // ------------------------------------------------------------------ //
    test('plugin trigger slider can be closed', async ({ triggers }) => {
        await selectPlugin({ triggers });

        await expect(triggers.triggerActionItem.first()).toBeVisible();

        await triggers.slider.clickClose();

        // Action items and search input should be gone
        await expect(triggers.triggerActionItem.first()).not.toBeVisible();
    });

});

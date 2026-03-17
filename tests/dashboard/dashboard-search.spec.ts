import { test, expect } from '../../fixtures/base.fixture';

test.describe('Dashboard Search', () => {

    test.beforeEach(async ({ workspace, dashboard }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await expect(dashboard.searchButton).toBeVisible({ timeout: 15000 });
    });

    test('TC-SEARCH-01: Open and close search panel', async ({ dashboard }) => {
        await dashboard.openSearchPanel();

        await expect(dashboard.searchPanelInput).toBeVisible();
        await expect(dashboard.searchPanelCloseButton).toBeVisible();

        await dashboard.closeSearchPanel();

        await expect(dashboard.searchPanelInput).not.toBeVisible();
    });

    test('TC-SEARCH-02: Search panel shows recent flows when empty', async ({ dashboard, page }) => {
        await dashboard.openSearchPanel();

        await expect(dashboard.searchPanelInput).toBeVisible();

        // With empty query, panel should show recent flows heading
        await expect(page.getByRole('heading', { name: 'Flows', exact: true })).toBeVisible();
    });

    test('TC-SEARCH-03: Search for a flow by name', async ({ dashboard, page }) => {
        await dashboard.openSearchPanel();

        await dashboard.searchFlows('test');

        // Wait for search results (debounced 300ms + async)
        await expect(page.getByRole('heading', { name: 'Flows', exact: true })).toBeVisible({ timeout: 5000 });

        // Verify at least one result appears in the list
        await expect(page.locator('li[role="option"]').first()).toBeVisible({ timeout: 5000 });
    });

    test('TC-SEARCH-04: Search with no results shows empty state', async ({ dashboard, page }) => {
        await dashboard.openSearchPanel();

        await dashboard.searchFlows('zzzznonexistent99999');

        // Wait for debounce + deferred value + log API call to complete, then verify empty state
        await expect(page.getByRole('heading', { name: 'No results found' })).toBeVisible({ timeout: 15000 });
    });

    test('TC-SEARCH-05: Click search result navigates to flow', async ({ dashboard, page }) => {
        await dashboard.openSearchPanel();

        // Wait for recent flows to appear
        await expect(page.locator('li[role="option"]').first()).toBeVisible({ timeout: 5000 });

        // Click first result
        await page.locator('li[role="option"]').first().click();

        // Should navigate to workflow page (URL contains /workflow/)
        await page.waitForURL('**/workflow/**', { timeout: 10000 });
    });

    test('TC-SEARCH-06: Open search panel via Ctrl+K shortcut', async ({ dashboard, page }) => {
        await page.keyboard.press('Control+k');

        await expect(dashboard.searchPanelInput).toBeVisible();
    });

});

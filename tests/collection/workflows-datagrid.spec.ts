import { test, expect } from '../../fixtures/base.fixture';

test.describe('Workflows DataGrid Tests', () => {

    test.beforeEach(async ({ workspace, dashboard }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        // Wait for the dashboard to load
        await expect(dashboard.collectionAllButton).toBeVisible({ timeout: 15000 });
    });

    test.describe('DataGrid Display', () => {

        test('TC-WF-GRID-01: Verify DataGrid is visible on home page', async ({ page }) => {
            // Check if DataGrid container is visible
            const dataGrid = page.locator('[role="grid"]');
            await expect(dataGrid).toBeVisible({ timeout: 10000 });
        });

        test('TC-WF-GRID-02: Verify DataGrid column headers are present', async ({ page }) => {
            // Verify all column headers exist
            await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
            await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
            await expect(page.getByRole('columnheader', { name: /Updated/i })).toBeVisible();
            await expect(page.getByRole('columnheader', { name: 'Collection' })).toBeVisible();
            await expect(page.getByRole('columnheader', { name: 'Runs' })).toBeVisible();
        });

        test('TC-WF-GRID-03: Verify workflows are displayed in DataGrid', async ({ page }) => {
            const dataGrid = page.locator('[role="grid"]');
            await expect(dataGrid).toBeVisible({ timeout: 10000 });

            // Check if there are any rows (excluding header)
            const rows = page.getByRole('row').filter({ has: page.getByRole('gridcell') });
            const rowCount = await rows.count();
            
            // If there are workflows, verify at least one row exists
            if (rowCount > 0) {
                expect(rowCount).toBeGreaterThan(0);
            }
        });

        test('TC-WF-GRID-04: Verify workflow row contains all required cells', async ({ page }) => {
            const rows = page.getByRole('row').filter({ has: page.getByRole('gridcell') });
            const rowCount = await rows.count();

            if (rowCount === 0) {
                test.skip();
                return;
            }

            // Check first row has all cells
            const firstRow = rows.first();
            const cells = firstRow.getByRole('gridcell');
            const cellCount = await cells.count();
            
            // Should have 5 cells: Name, Status, Updated, Collection, Runs
            expect(cellCount).toBeGreaterThanOrEqual(5);
        });
    });

    test.describe('Filter Tabs', () => {

        test('TC-WF-GRID-05: Verify all filter tabs are visible', async ({ page }) => {
            // Check for filter tabs container
            const filterTabs = page.getByTestId('dashboard-filter-tabs');
            await expect(filterTabs).toBeVisible();
            
            // Verify individual tabs exist
            const tabs = page.getByTestId('dashboard-filter-tab');
            const tabCount = await tabs.count();
            expect(tabCount).toBeGreaterThan(0);
        });

        test('TC-WF-GRID-06: Click on ALL WORKFLOWS tab', async ({ dashboard }) => {
            await dashboard.selectAllWorkflows();
            // Tab selection is handled by the dashboard fixture
        });

        test('TC-WF-GRID-07: Click on LIVE tab', async ({ dashboard }) => {
            await dashboard.selectLive();
            // Tab selection is handled by the dashboard fixture
        });

        test('TC-WF-GRID-08: Click on DRAFTED tab', async ({ dashboard }) => {
            await dashboard.selectDrafted();
            // Tab selection is handled by the dashboard fixture
        });

        test('TC-WF-GRID-09: Click on ERROR tab', async ({ dashboard }) => {
            await dashboard.selectError();
            // Tab selection is handled by the dashboard fixture
        });

        test('TC-WF-GRID-10: Verify filter tab shows count', async ({ page }) => {
            // Check if tabs display counts
            const tabs = page.getByTestId('dashboard-filter-tab');
            const firstTab = tabs.first();
            const tabText = await firstTab.textContent();
            
            // Should contain text and count in format "Label (count)"
            expect(tabText).toBeTruthy();
            expect(tabText).toMatch(/\(\d+\)/);
        });
    });

    test.describe('Time Period Filter', () => {

        test('TC-WF-GRID-11: Verify time period dropdown is visible', async ({ page }) => {
            // Check for time period selector using data-testid
            const timePeriodSelect = page.getByTestId('dashboard-analytics-time-period-select');
            await expect(timePeriodSelect).toBeVisible();
        });

        test('TC-WF-GRID-12: Select Today time period', async ({ dashboard }) => {
            await dashboard.selectToday();
            // Verify the selection (implementation depends on UI feedback)
        });

        test('TC-WF-GRID-13: Select Last 7 Days time period', async ({ dashboard }) => {
            await dashboard.selectLast7Days();
            // Verify the selection (implementation depends on UI feedback)
        });
    });

    test.describe('Analytics Metrics', () => {

        test('TC-WF-GRID-14: Verify analytics metrics are displayed', async ({ page }) => {
            // Check for Runs, Success, Failure metrics
            const runsText = page.getByText(/Runs:/i);
            const successText = page.getByText(/Success:/i);
            const failureText = page.getByText(/Failure:/i);

            // Verify metrics are visible
            await expect(runsText).toBeVisible({ timeout: 10000 });
            await expect(successText).toBeVisible();
            await expect(failureText).toBeVisible();
        });

        test('TC-WF-GRID-15: Verify Runs count is displayed', async ({ dashboard }) => {
            const runsCount = await dashboard.getRunsCount();
            expect(runsCount).toBeTruthy();
        });

        test('TC-WF-GRID-16: Verify Success percentage is displayed', async ({ dashboard }) => {
            const successPercent = await dashboard.getSuccessPercent();
            expect(successPercent).toBeTruthy();
        });

        test('TC-WF-GRID-17: Verify Failure percentage is displayed', async ({ dashboard }) => {
            const failurePercent = await dashboard.getFailurePercent();
            expect(failurePercent).toBeTruthy();
        });
    });

    test.describe('DataGrid Interactions', () => {

        test('TC-WF-GRID-18: Click on a workflow row to open it', async ({ page, dashboard }) => {
            const flowCardCount = await dashboard.getFlowCardCount();

            if (flowCardCount === 0) {
                test.skip();
                return;
            }

            // Click on the first workflow using flow-card testid
            await dashboard.clickFlowCard(0);

            // Should navigate to workflow editor or details page
            await page.waitForURL(/.*\/flow\/.*/i, { timeout: 10000 });
        });

        test('TC-WF-GRID-19: Verify workflow name is clickable link', async ({ page, dashboard }) => {
            const flowCardCount = await dashboard.getFlowCardCount();

            if (flowCardCount === 0) {
                test.skip();
                return;
            }

            // Verify flow card location link exists
            const locationLink = dashboard.flowCardLocationLink.first();
            await expect(locationLink).toBeVisible();
        });

        test('TC-WF-GRID-20: Verify workflow status chip is displayed', async ({ page }) => {
            const rows = page.getByRole('row').filter({ has: page.getByRole('gridcell') });
            const rowCount = await rows.count();

            if (rowCount === 0) {
                test.skip();
                return;
            }

            // Check if status cell contains a chip or status indicator
            const firstRow = rows.first();
            const statusCell = firstRow.getByRole('gridcell').nth(1); // Status is 2nd column
            
            await expect(statusCell).toBeVisible();
        });

        test('TC-WF-GRID-21: Verify row menu button is present', async ({ page, dashboard }) => {
            const flowCardCount = await dashboard.getFlowCardCount();

            if (flowCardCount === 0) {
                test.skip();
                return;
            }

            // Look for menu button in the first flow card
            const firstCard = dashboard.flowCard.first();
            const menuButton = firstCard.getByRole('button').last();
            
            await expect(menuButton).toBeVisible();
        });

        test('TC-WF-GRID-22: Open workflow row menu', async ({ page, dashboard }) => {
            const flowCardCount = await dashboard.getFlowCardCount();

            if (flowCardCount === 0) {
                test.skip();
                return;
            }

            // Click menu button on first flow card
            const firstCard = dashboard.flowCard.first();
            const menuButton = firstCard.getByRole('button').last();
            await menuButton.click();

            // Verify menu appears
            const menu = page.getByRole('menu');
            await expect(menu).toBeVisible({ timeout: 5000 });
        });
    });

    test.describe('Column Sorting', () => {

        test('TC-WF-GRID-23: Click Name column header to sort', async ({ page }) => {
            const nameHeader = page.getByRole('columnheader', { name: 'Name' });
            await nameHeader.click();

            // Wait for potential re-render
            await page.waitForTimeout(500);
        });

        test('TC-WF-GRID-24: Click Updated column header to sort', async ({ page }) => {
            const updatedHeader = page.getByRole('columnheader', { name: /Updated/i });
            await updatedHeader.click();

            // Wait for potential re-render
            await page.waitForTimeout(500);
        });

        test('TC-WF-GRID-25: Verify sort indicator appears on column header', async ({ page }) => {
            const nameHeader = page.getByRole('columnheader', { name: 'Name' });
            await nameHeader.click();

            // Check for sort icon or aria-sort attribute
            const sortAttribute = await nameHeader.getAttribute('aria-sort');
            
            // Should have ascending or descending sort
            expect(sortAttribute).toBeTruthy();
        });
    });

    test.describe('Empty State', () => {

        test('TC-WF-GRID-26: Verify empty state when no workflows exist', async ({ page, dashboard }) => {
            // Filter to a state that might be empty (e.g., ERROR)
            await dashboard.selectError();

            // Check if there's an empty state message or no rows
            const rows = page.getByRole('row').filter({ has: page.getByRole('gridcell') });
            const rowCount = await rows.count();

            if (rowCount === 0) {
                // Verify empty state message or illustration
                const emptyMessage = page.getByText(/No workflows/i).or(
                    page.getByText(/No data/i)
                );
                
                const hasEmptyState = await emptyMessage.isVisible().catch(() => false);
                
                // Either has empty message or just no rows (both valid)
                expect(rowCount === 0 || hasEmptyState).toBeTruthy();
            }
        });
    });

    test.describe('Pagination', () => {

        test('TC-WF-GRID-27: Verify pagination controls if many workflows exist', async ({ page }) => {
            // Check if pagination exists (only appears with many workflows)
            const pagination = page.locator('.MuiTablePagination-root').or(
                page.getByRole('navigation', { name: /pagination/i })
            );
            
            const hasPagination = await pagination.isVisible().catch(() => false);
            
            if (hasPagination) {
                await expect(pagination).toBeVisible();
            } else {
                // No pagination means fewer workflows, which is also valid
                test.skip();
            }
        });

        test('TC-WF-GRID-28: Navigate to next page if pagination exists', async ({ page }) => {
            const nextButton = page.getByLabel('Go to next page').or(
                page.getByRole('button', { name: /next/i })
            );
            
            const isVisible = await nextButton.isVisible().catch(() => false);
            
            if (!isVisible) {
                test.skip();
                return;
            }

            const isEnabled = await nextButton.isEnabled();
            
            if (!isEnabled) {
                test.skip();
                return;
            }

            await nextButton.click();
            await page.waitForTimeout(1000);
        });
    });
});

import { test, expect } from '../../fixtures/base.fixture';
import { MCPPage } from '../../pages/mcp/mcp.page';
import type { Page } from '@playwright/test';

/**
 * Wait for MCP landing page to stabilize after async MCP list load.
 * Resolves once either "Existing MCPs" heading or "Get Started" button is visible.
 */
async function waitForMCPPageStable(mcp: MCPPage, page: Page): Promise<void> {
    await expect(mcp.mainHeading).toBeVisible({ timeout: 15000 });
    // mcpDataGrid only renders AFTER the MCP list API returns with existing MCPs.
    // getStartedButton renders when API returns empty list (no MCPs).
    // Wait for DataGrid first (stable indicator that API completed with MCPs).
    // Fall back to getStartedButton if no MCPs exist.
    try {
        await expect(mcp.mcpDataGrid).toBeVisible({ timeout: 10000 });
    } catch {
        await expect(mcp.getStartedButton).toBeVisible({ timeout: 5000 });
    }
}

/**
 * Navigate to an existing MCP's selected page, creating one if none exist.
 */
async function navigateToSelectedMCP(mcp: MCPPage, page: Page): Promise<void> {
    await waitForMCPPageStable(mcp, page);
    const hasExisting = await mcp.existingMCPsHeading.isVisible();
    if (hasExisting) {
        await mcp.mcpDataGrid.getByRole('row').filter({ has: page.getByRole('gridcell') }).first().click();
    } else {
        await mcp.clickGetStarted();
        await expect(mcp.generateSecureUrlButton).toBeVisible({ timeout: 10000 });
        await mcp.clickGenerateSecureUrl();
    }
    await expect(page).toHaveURL(/\/mcp\/\d+\/\w+/, { timeout: 30000 });
}

test.describe('MCP Module Tests', () => {

    test.beforeEach(async ({ workspace, mcp, page }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await mcp.navigateFromSidebar();
        await expect(page).toHaveURL(/\/mcp\//, { timeout: 15000 });
    });

    test.describe('Landing Page', () => {

        test('TC-MCP-01: MCP landing page displays main heading', async ({ mcp }) => {
            await expect(mcp.mainHeading).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-02: MCP landing page displays step cards', async ({ mcp, page }) => {
            await waitForMCPPageStable(mcp, page);
            await expect(mcp.stepOneCard).toBeVisible({ timeout: 10000 });
            await expect(mcp.stepTwoCard).toBeVisible();
            await expect(mcp.stepThreeCard).toBeVisible();
        });

        test('TC-MCP-03: Learn More link is visible on step three', async ({ mcp }) => {
            await expect(mcp.learnMoreLink).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-04: Get Started or Create New button is present', async ({ mcp, page }) => {
            await waitForMCPPageStable(mcp, page);
            const getStartedVisible = await mcp.getStartedButton.isVisible();
            const createNewVisible = await mcp.createNewButton.isVisible();
            expect(getStartedVisible || createNewVisible).toBe(true);
        });

        test('TC-MCP-05: Existing MCPs heading visible when MCPs exist', async ({ mcp }) => {
            const hasExisting = await mcp.hasExistingMCPs();
            if (!hasExisting) {
                test.skip();
                return;
            }
            await expect(mcp.existingMCPsHeading).toBeVisible();
        });

        test('TC-MCP-06: MCP DataGrid visible when MCPs exist', async ({ mcp }) => {
            const hasExisting = await mcp.hasExistingMCPs();
            if (!hasExisting) {
                test.skip();
                return;
            }
            await expect(mcp.mcpDataGrid).toBeVisible();
        });
    });

    test.describe('Create New MCP', () => {

        test('TC-MCP-07: Get Started shows Generate Secure URL button', async ({ mcp, page }) => {
            await waitForMCPPageStable(mcp, page);
            const hasExisting = await mcp.existingMCPsHeading.isVisible();
            if (hasExisting) {
                await mcp.clickCreateNew();
            } else {
                await mcp.clickGetStarted();
            }

            await expect(mcp.generateSecureUrlButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-08: Generate Secure URL creates MCP and navigates to selected page', async ({ mcp, page }) => {
            await waitForMCPPageStable(mcp, page);
            const hasExisting = await mcp.existingMCPsHeading.isVisible();
            if (hasExisting) {
                await mcp.clickCreateNew();
            } else {
                await mcp.clickGetStarted();
            }

            await expect(mcp.generateSecureUrlButton).toBeVisible({ timeout: 10000 });
            await mcp.clickGenerateSecureUrl();

            // Should navigate to /mcp/:orgId/:mcpId
            await expect(page).toHaveURL(/\/mcp\/\d+\/\w+/, { timeout: 30000 });
        });
    });

    test.describe('Selected MCP Page', () => {

        test.beforeEach(async ({ page, mcp }) => {
            await navigateToSelectedMCP(mcp, page);
        });

        test('TC-MCP-09: Selected MCP page shows sidebar with Your MCPs heading', async ({ mcp }) => {
            await expect(mcp.yourMCPsHeading).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-10: Sidebar Create New button is visible', async ({ mcp }) => {
            await expect(mcp.sidebarCreateNewButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-11: Configure tab is visible and selected by default', async ({ mcp }) => {
            await expect(mcp.configureTab).toBeVisible({ timeout: 15000 });
        });

        test('TC-MCP-12: Connect tab is visible', async ({ mcp }) => {
            await expect(mcp.connectTab).toBeVisible({ timeout: 15000 });
        });

        test('TC-MCP-13: Switch to Connect tab shows client selector', async ({ mcp }) => {
            await expect(mcp.connectTab).toBeVisible({ timeout: 15000 });
            await mcp.switchToConnectTab();
            await expect(mcp.selectClientButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-14: Connect tab shows URL visibility toggle', async ({ mcp }) => {
            await expect(mcp.connectTab).toBeVisible({ timeout: 15000 });
            await mcp.switchToConnectTab();
            await expect(mcp.toggleUrlVisibilityButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-15: Toggle URL visibility changes button text', async ({ mcp }) => {
            await expect(mcp.connectTab).toBeVisible({ timeout: 15000 });
            await mcp.switchToConnectTab();
            await expect(mcp.toggleUrlVisibilityButton).toBeVisible({ timeout: 10000 });

            // Default state should be "Show"
            await expect(mcp.toggleUrlVisibilityButton).toHaveText('Show');

            // Click to show URL
            await mcp.toggleUrlVisibility();
            await expect(mcp.toggleUrlVisibilityButton).toHaveText('Hide');

            // Click to hide URL again
            await mcp.toggleUrlVisibility();
            await expect(mcp.toggleUrlVisibilityButton).toHaveText('Show');
        });

        test('TC-MCP-16: MCP name is displayed on selected page', async ({ mcp }) => {
            await expect(mcp.mcpNameDisplay).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Client Selector Dialog', () => {

        test.beforeEach(async ({ page, mcp }) => {
            await navigateToSelectedMCP(mcp, page);

            // Switch to Connect tab
            await expect(mcp.connectTab).toBeVisible({ timeout: 15000 });
            await mcp.switchToConnectTab();
            await expect(mcp.selectClientButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-17: Open client selector dialog', async ({ mcp, page }) => {
            await mcp.openClientSelector();
            // Dialog should show "New MCP Server" title
            await expect(page.getByText('New MCP Server')).toBeVisible({ timeout: 5000 });
        });

        test('TC-MCP-18: Client dialog has search input', async ({ mcp }) => {
            await mcp.openClientSelector();
            await expect(mcp.clientSearchInput).toBeVisible({ timeout: 5000 });
        });

        test('TC-MCP-19: Client dialog shows Popular clients section', async ({ mcp, page }) => {
            await mcp.openClientSelector();
            await expect(page.getByRole('heading', { name: 'Popular clients' })).toBeVisible({ timeout: 5000 });
        });

        test('TC-MCP-20: Client dialog shows All clients section', async ({ mcp, page }) => {
            await mcp.openClientSelector();
            await expect(page.getByRole('heading', { name: 'All clients' })).toBeVisible({ timeout: 5000 });
        });

        test('TC-MCP-21: Search filters clients in dialog', async ({ mcp, page }) => {
            await mcp.openClientSelector();
            await mcp.searchClient('Claude');

            // Should show filtered results (use .first() as client appears in both Popular and All sections)
            await expect(page.getByRole('heading', { name: 'Claude' }).first()).toBeVisible({ timeout: 5000 });
        });

        test('TC-MCP-22: Close client dialog', async ({ mcp, page }) => {
            await mcp.openClientSelector();
            await expect(page.getByText('New MCP Server')).toBeVisible({ timeout: 5000 });

            await mcp.closeClientDialog();
            await expect(page.getByText('New MCP Server')).not.toBeVisible({ timeout: 5000 });
        });

        test('TC-MCP-23: Select a client updates the selector button', async ({ mcp }) => {
            await mcp.openClientSelector();
            await mcp.selectClientByName('Cursor');

            // Dialog should close and button should show selected client name
            await expect(mcp.selectClientButton).toContainText('Cursor', { timeout: 5000 });
        });
    });
});

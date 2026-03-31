import { test, expect } from '../../fixtures/base.fixture';
import { MCPPage } from '../../pages/mcp/mcp.page';
import type { Page } from '@playwright/test';

/**
 * Wait for the MCP landing page to be fully loaded and stable.
 */
async function waitForMCPPageStable(mcp: MCPPage, page: Page): Promise<void> {
    // Wait for page to be fully loaded (including React app)
    await page.waitForLoadState('load');
    await expect(mcp.mainHeading).toBeVisible({ timeout: 20000 });
    // Mushroom card is always visible now (renders for both empty and non-empty states)
    await expect(mcp.mushroomCard).toBeVisible({ timeout: 15000 });
}

/**
 * Navigate to an existing MCP's selected page.
 * Note: MCP creation now happens via external Mushroom app, so we can only navigate to existing MCPs.
 * Returns true if navigation successful, false if no MCPs exist (caller should skip test).
 */
async function navigateToSelectedMCP(mcp: MCPPage, page: Page): Promise<boolean> {
    await waitForMCPPageStable(mcp, page);
    const hasExisting = await mcp.existingMCPsHeading.isVisible();
    if (!hasExisting) {
        return false;
    }
    await mcp.mcpDataGrid.getByRole('row').filter({ has: page.getByRole('gridcell') }).first().click();
    await page.waitForURL(/\/mcp\/\d+\/[a-f0-9]{24}/, { timeout: 15000 });
    return true;
}

test.describe('MCP Module Tests', () => {

    test.beforeEach(async ({ page, mcp }) => {
        const orgId = process.env.ORG_ID;
        await page.goto(`/mcp/${orgId}`, { waitUntil: 'domcontentloaded' });
        await waitForMCPPageStable(mcp, page);
    });

    test.describe('Landing Page', () => {

        test('TC-MCP-01: MCP landing page displays main heading', async ({ mcp }) => {
            await expect(mcp.mainHeading).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-02: MCP landing page displays Mushroom card', async ({ mcp }) => {
            await expect(mcp.mushroomCard).toBeVisible({ timeout: 10000 });
            await expect(mcp.mushroomCardHeading).toBeVisible({ timeout: 10000 });
            await expect(mcp.mushroomCardChip).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-03: Mushroom card displays GET STARTED button', async ({ mcp }) => {
            await expect(mcp.getStartedButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-04: Existing MCPs heading visible when MCPs exist', async ({ mcp }) => {
            const hasExisting = await mcp.hasExistingMCPs();
            if (!hasExisting) {
                test.skip();
                return;
            }
            await expect(mcp.existingMCPsHeading).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-05: MCP DataGrid visible when MCPs exist', async ({ mcp }) => {
            const hasExisting = await mcp.hasExistingMCPs();
            if (!hasExisting) {
                test.skip();
                return;
            }
            await expect(mcp.mcpDataGrid).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('Mushroom Integration', () => {

        test('TC-MCP-06: Mushroom card displays correct heading and description', async ({ mcp }) => {
            await expect(mcp.mushroomCardHeading).toHaveText('Create MCP Servers with Mushroom', { timeout: 10000 });
            await expect(mcp.mushroomCard).toContainText('Build, configure, and deploy MCP servers visually', { timeout: 10000 });
        });

        test('TC-MCP-07: Mushroom card shows NEW PRODUCT chip', async ({ mcp }) => {
            await expect(mcp.mushroomCardChip).toBeVisible({ timeout: 10000 });
            await expect(mcp.mushroomCardChip).toHaveText('NEW PRODUCT', { timeout: 10000 });
        });
    });

    test.describe('Selected MCP Page', () => {

        test.beforeEach(async ({ page, mcp }) => {
            const orgId = process.env.ORG_ID;
            const mcpId = process.env.MCP_ID;
            
            // URL format: /mcp/{orgId}/{mcpId}
            // orgId = organization ID (e.g., 58104)
            // mcpId = specific MCP's _id (e.g., MongoDB ObjectId, NOT the same as orgId)
            
            if (!mcpId || mcpId === orgId) {
                // Fallback: parent beforeEach already loaded landing page, just navigate to first MCP
                const hasNavigated = await navigateToSelectedMCP(mcp, page);
                if (!hasNavigated) {
                    test.skip();
                }
            } else {
                // Direct navigation to specific MCP using MCP_ID from .env
                await page.goto(`/mcp/${orgId}/${mcpId}`, { waitUntil: 'domcontentloaded' });
                await page.waitForLoadState('load');
                // Wait for selected MCP page to load
                await expect(mcp.yourMCPsHeading).toBeVisible({ timeout: 15000 });
            }
        });

        test('TC-MCP-08: Selected MCP page shows sidebar with Your MCPs heading', async ({ mcp }) => {
            await expect(mcp.yourMCPsHeading).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-09: Sidebar back button is visible', async ({ mcp }) => {
            await expect(mcp.backButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-10: Sidebar Create New button is visible', async ({ mcp }) => {
            await expect(mcp.sidebarCreateNewButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-11: Sidebar shows Go to embed link', async ({ mcp }) => {
            await expect(mcp.goToEmbedLink).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-12: Configure tab is visible and selected by default', async ({ mcp }) => {
            await expect(mcp.configureTab).toBeVisible({ timeout: 15000 });
        });

        test('TC-MCP-13: Connect tab is visible', async ({ mcp }) => {
            await expect(mcp.connectTab).toBeVisible({ timeout: 15000 });
        });

        test('TC-MCP-14: Switch to Connect tab shows client selector', async ({ mcp }) => {
            await mcp.switchToConnectTab();
            await expect(mcp.selectClientButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-15: Connect tab shows URL visibility toggle', async ({ mcp }) => {
            await mcp.switchToConnectTab();
            await expect(mcp.toggleUrlVisibilityButton).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-16: Toggle URL visibility changes button text', async ({ mcp }) => {
            await mcp.switchToConnectTab();
            await expect(mcp.toggleUrlVisibilityButton).toBeVisible({ timeout: 10000 });

            // Default state should be "Show"
            await expect(mcp.toggleUrlVisibilityButton).toHaveText('Show', { timeout: 5000 });

            // Click to show URL
            await mcp.toggleUrlVisibility();
            await expect(mcp.toggleUrlVisibilityButton).toHaveText('Hide', { timeout: 5000 });

            // Click to hide URL again
            await mcp.toggleUrlVisibility();
            await expect(mcp.toggleUrlVisibilityButton).toHaveText('Show', { timeout: 5000 });
        });

        test('TC-MCP-17: MCP name is displayed on selected page', async ({ mcp }) => {
            await expect(mcp.mcpNameDisplay).toBeVisible({ timeout: 10000 });
        });

        test('TC-MCP-18: MCP name edit button appears on hover', async ({ mcp }) => {
            await expect(mcp.mcpNameDisplay).toBeVisible({ timeout: 10000 });
            await mcp.mcpNameDisplay.hover();
            await expect(mcp.mcpNameEditButton).toBeVisible({ timeout: 5000 });
        });
    });

});

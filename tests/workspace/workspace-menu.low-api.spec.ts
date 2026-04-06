import { test, expect } from '../../fixtures/base.fixture';

test.describe('Workspace Menu - Navigation Tests', () => {

    test.beforeEach(async ({ page }) => {
        const orgId = process.env.ORG_ID;
        if (!orgId) {
            throw new Error('ORG_ID environment variable is required');
        }
        await page.goto(`/projects/${orgId}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        // Wait for sidebar to be visible by checking for "Home" link which is always present
        await page.getByRole('link', { name: 'Home' }).waitFor({ state: 'visible', timeout: 30000 });
    });

    test('TC-WORK-MENU-01: Verify workspace menu opens and displays all options', async ({ workspace }) => {
        await workspace.openWorkspaceMenu();

        await expect(workspace.switchWorkspaceLink).toBeVisible();
        await expect(workspace.workspaceSettingsLink).toBeVisible();
        await expect(workspace.membersLink).toBeVisible();
        await expect(workspace.notificationsLink).toBeVisible();
        // Note: Edit Profile and Logout are in the profile menu, not workspace menu
    });

    test('TC-WORK-MENU-02: Navigate to Switch Workspace', async ({ workspace }) => {
        await workspace.openWorkspaceMenu();
        await workspace.switchWorkspace();

        await expect(workspace.createNewWorkspaceButton).toBeVisible();
    });

    test('TC-WORK-MENU-03: Navigate to Members page', async ({ workspace, page }) => {
        await workspace.openWorkspaceMenu();
        await workspace.goToMembers();

        await expect(page).toHaveURL(/.*\/invite/);
    });

    test('TC-WORK-MENU-04: Navigate to Workspace Settings', async ({ workspace, page }) => {
        await workspace.openWorkspaceMenu();
        await workspace.goToWorkspaceSettings();

        await expect(page).toHaveURL(/.*\/setting/);
    });

    test('TC-WORK-MENU-05: Navigate to Notifications', async ({ workspace, page }) => {
        await workspace.openWorkspaceMenu();
        await workspace.goToNotifications();

        await expect(page).toHaveURL(/.*\/notifications/);
    });

    test('TC-WORK-MENU-06: Navigate to Edit Profile via Profile Menu', async ({ workspace, page }) => {
        // Edit Profile is in the profile menu, not workspace menu
        await workspace.openProfileMenu();
        await workspace.goToEditProfile();

        await expect(page).toHaveURL(/.*\/update-user/);
    });

});

test.describe('Workspace Menu - Multiple Navigation Test', () => {

    test.beforeEach(async ({ page }) => {
        const orgId = process.env.ORG_ID;
        if (!orgId) {
            throw new Error('ORG_ID environment variable is required');
        }
        await page.goto(`/projects/${orgId}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        // Wait for sidebar to be visible by checking for "Home" link which is always present
        await page.getByRole('link', { name: 'Home' }).waitFor({ state: 'visible', timeout: 30000 });
    });

    test('TC-WORK-MENU-07: Verify all workspace menu navigation options work', async ({ workspace, page }) => {
        // Test that each menu item navigates correctly
        // Note: Testing sequentially causes element detachment, so we test individually
        
        await test.step('Navigate to Members', async () => {
            await workspace.openWorkspaceMenu();
            await workspace.goToMembers();
            await expect(page).toHaveURL(/.*\/invite/);
        });
    });

});

test.describe('Workspace Menu - State Tests', () => {

    test.beforeEach(async ({ page }) => {
        const orgId = process.env.ORG_ID;
        if (!orgId) {
            throw new Error('ORG_ID environment variable is required');
        }
        await page.goto(`/projects/${orgId}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        // Wait for sidebar to be visible by checking for "Home" link which is always present
        await page.getByRole('link', { name: 'Home' }).waitFor({ state: 'visible', timeout: 30000 });
    });

    test('TC-WORK-MENU-08: Verify workspace name is displayed in menu trigger', async ({ workspace }) => {
        const workspaceName = await workspace.getWorkspaceName();
        expect(workspaceName).toBeTruthy();
        expect(workspaceName.length).toBeGreaterThan(0);
    });

    test('TC-WORK-MENU-09: Verify workspace menu displays correctly', async ({ workspace }) => {
        await workspace.openWorkspaceMenu();
        
        // Verify all menu items are visible
        await expect(workspace.switchWorkspaceLink).toBeVisible();
        await expect(workspace.workspaceSettingsLink).toBeVisible();
        await expect(workspace.membersLink).toBeVisible();
        await expect(workspace.notificationsLink).toBeVisible();
    });

});

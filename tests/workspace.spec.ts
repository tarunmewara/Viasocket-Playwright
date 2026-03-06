import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { WorkspacePage } from '../pages/WorkspacePage';

test.describe('Workspace Tests', () => {

    // storageState is configured globally in playwright.config.ts via STORAGE_STATE env var
    test.beforeEach(async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.navigateToOrg();
    });

    test('Create New Workspace', async ({ page }) => {
        const workspacePage = new WorkspacePage(page);

        await workspacePage.clickCreateNewWorkspace();

        const randomName = `workspace${Date.now()}`;
        await workspacePage.fillWorkspaceName(randomName);

        await workspacePage.selectIndustry('Agriculture');
        await workspacePage.selectTeamSize('-500');

        await workspacePage.clickCreate();
    });

    test('Switch Workspace', async ({ page }) => {
        const workspacePage = new WorkspacePage(page);

        await workspacePage.openWorkspaceFromDashboard(9);
        await workspacePage.openWorkspaceMenu('Tarun Mewara');
        await workspacePage.clickSwitchWorkspace();
        await workspacePage.selectWorkspaceToSwitchTo(10);
    });

    test('Leave Workspace', async ({ page }) => {
        const workspacePage = new WorkspacePage(page);

        await workspacePage.openWorkspaceFromDashboard(9);
        await workspacePage.openWorkspaceMenu('Tarunmewara');
        await workspacePage.clickEditProfile();

        // Get all workspaces starting with 'workspace'
        const workspaceNames = await workspacePage.getWorkspaceNamesByPrefix('workspace');
        console.log('Workspaces found:', workspaceNames);

        if (workspaceNames.length > 0) {
            // Pick a random workspace
            const randomIndex = Math.floor(Math.random() * workspaceNames.length);
            const selectedWorkspace = workspaceNames[randomIndex];
            console.log(`Picking random workspace: ${selectedWorkspace}`);

            // Perform leave action for that particular workspace
            await workspacePage.clickLeaveForWorkspace(selectedWorkspace);
            await workspacePage.confirmLeave();
        } else {
            console.log('No workspaces found starting with "workspace"');
        }
    });

});

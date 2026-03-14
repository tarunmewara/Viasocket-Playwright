import { test, expect } from '../fixtures/base.fixture';

test.describe('Workspace Tests', () => {

    test.beforeEach(async ({ workspace }) => {
        await workspace.navigateToOrg();
    });

    test('TC-WORK-01: Create New Workspace', async ({ workspace }) => {
        await workspace.clickCreateNewWorkspace();

        await expect(workspace.createModal.workspaceNameInput).toBeVisible();

        const randomName = `workspace${Date.now()}`;
        await workspace.createModal.fillWorkspaceName(randomName);
        await workspace.createModal.selectIndustry('Agriculture');
        await workspace.createModal.selectEmployees('500+');
        await workspace.createModal.submit();
    });

    test('TC-WORK-02: Switch Workspace', async ({ workspace }) => {
        await workspace.selectFirstWorkspace();
        await workspace.openWorkspaceMenu();
        await workspace.switchWorkspace();
        await expect(workspace.createNewWorkspaceButton).toBeVisible();
    });

    test('TC-WORK-03: Leave Workspace', async ({ workspace }) => {
        await workspace.selectFirstWorkspace();
        await workspace.openWorkspaceMenu();
        await workspace.goToEditProfile();
        await workspace.openLeaveDialog();
        await workspace.confirmLeaveWorkspace();
    });

});

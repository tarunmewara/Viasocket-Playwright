import { test, expect } from '../../fixtures/base.fixture';

const WORKSPACE_NAME_PREFIX = 'workspace';

test.describe('Workspace Selection Page', () => {

    test.beforeEach(async ({ workspace }) => {
        await workspace.navigateToOrg();
    });

    test('TC-WORK-01: Verify workspace selection page loads', async ({ workspace }) => {
        await expect(workspace.createNewWorkspaceButton).toBeVisible();
        await expect(workspace.profileMenuButton).toBeVisible();
    });

    test('TC-WORK-02: Create a new workspace', async ({ workspace }) => {
        await workspace.clickCreateNewWorkspace();

        await expect(workspace.createModal.workspaceNameInput).toBeVisible();

        const randomName = `${WORKSPACE_NAME_PREFIX}${Date.now()}`;
        await workspace.createModal.fillWorkspaceName(randomName);
        await workspace.createModal.submit();
    });

    test('TC-WORK-03: Cancel create workspace modal', async ({ workspace }) => {
        await workspace.clickCreateNewWorkspace();

        await expect(workspace.createModal.workspaceNameInput).toBeVisible();

        await workspace.createModal.close();

        await expect(workspace.createModal.workspaceNameInput).not.toBeVisible();
    });

    test('TC-WORK-04: Select a workspace from the list', async ({ workspace }) => {
        await workspace.selectWorkspaceByName(process.env.WORKSPACE_NAME || 'suraj choudhary');
    });

    test('TC-WORK-05: Search for a workspace', async ({ workspace, page }) => {
        const searchVisible = await workspace.searchInput.isVisible();
        if (!searchVisible) {
            test.skip();
            return;
        }

        await workspace.searchWorkspace('shubham');

        await expect(page.getByText('shubham dhakad')).toBeVisible();
    });

    test('TC-WORK-06: Open profile menu and verify options', async ({ workspace }) => {
        await workspace.openProfileMenu();

        await expect(workspace.profileEditMenuItem).toBeVisible();
        await expect(workspace.profileLogoutMenuItem).toBeVisible();
    });

    test('TC-WORK-07: Navigate to edit profile from profile menu', async ({ workspace }) => {
        await workspace.editProfileFromMenu();
    });

    test('TC-WORK-08: Create workspace with industry and employees', async ({ workspace }) => {
        await workspace.clickCreateNewWorkspace();

        await expect(workspace.createModal.workspaceNameInput).toBeVisible();

        const randomName = `${WORKSPACE_NAME_PREFIX}${Date.now()}`;
        await workspace.createModal.fillWorkspaceName(randomName);
        await workspace.createModal.selectIndustry('Agriculture');
        await workspace.createModal.selectEmployees('1-10');
        await workspace.createModal.submit();
    });

    test('TC-WORK-09: Verify create button disabled with empty name', async ({ workspace }) => {
        await workspace.clickCreateNewWorkspace();

        await expect(workspace.createModal.workspaceNameInput).toBeVisible();
        await expect(workspace.createModal.submitButton).toBeDisabled();
    });

});

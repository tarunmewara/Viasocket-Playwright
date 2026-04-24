import { test, expect } from '../../fixtures/base.fixture';

test.describe('Workspace Selection - Read-Only Tests', () => {

    test.beforeEach(async ({ workspace, page }) => {
        await workspace.navigateToOrg();
        // Wait for workspace selection page to be fully loaded
        await workspace.createNewWorkspaceButton.waitFor({ state: 'visible', timeout: 60000 });
    });

    test('TC-WORK-SEL-01: Verify workspace selection page elements', async ({ workspace }) => {
        await expect(workspace.createNewWorkspaceButton).toBeVisible();
        await expect(workspace.profileMenuButton).toBeVisible();
    });

    test('TC-WORK-SEL-02: Select existing workspace from list', async ({ workspace }) => {
        const workspaceName = process.env.WORKSPACE_NAME;
        if (!workspaceName) {
            throw new Error('WORKSPACE_NAME environment variable is required');
        }
        
        await workspace.selectWorkspaceByName(workspaceName);
    });

    test('TC-WORK-SEL-03: Profile menu displays correct options', async ({ workspace }) => {
        await workspace.openProfileMenu();

        await expect(workspace.profileEditMenuItem).toBeVisible();
        await expect(workspace.profileLogoutMenuItem).toBeVisible();
    });

    test('TC-WORK-SEL-04: Navigate to edit profile', async ({ workspace }) => {
        await workspace.editProfileFromMenu();
    });

});

test.describe('Workspace Selection - Mutation Tests', () => {

    test.beforeEach(async ({ workspace, page }) => {
        await workspace.navigateToOrg();
        // Wait for workspace selection page to be fully loaded
        await workspace.createNewWorkspaceButton.waitFor({ state: 'visible', timeout: 60000 });
    });

    test('TC-WORK-SEL-05: Create workspace with all fields', async ({ workspace }) => {
        const workspaceName = `workspace${Date.now()}`;

        await test.step('Open create workspace modal', async () => {
            await workspace.clickCreateNewWorkspace();
            await expect(workspace.createModal.workspaceNameInput).toBeVisible();
        });

        await test.step('Fill workspace details', async () => {
            await workspace.createModal.fillWorkspaceName(workspaceName);
            await workspace.createModal.selectIndustry('Agriculture');
            await workspace.createModal.selectEmployees('1-10');
        });

        await test.step('Submit and verify creation', async () => {
            await workspace.createModal.submit();
        });
    });

    test('TC-WORK-SEL-06: Create workspace with minimal fields', async ({ workspace }) => {
        const workspaceName = `workspace${Date.now()}`;

        await workspace.clickCreateNewWorkspace();
        await expect(workspace.createModal.workspaceNameInput).toBeVisible();

        await workspace.createModal.fillWorkspaceName(workspaceName);
        await workspace.createModal.submit();
    });

    test('TC-WORK-SEL-07: Cancel workspace creation', async ({ workspace }) => {
        await workspace.clickCreateNewWorkspace();
        await expect(workspace.createModal.workspaceNameInput).toBeVisible();

        await workspace.createModal.close();

        await expect(workspace.createModal.workspaceNameInput).not.toBeVisible();
        await expect(workspace.createNewWorkspaceButton).toBeVisible();
    });

});

test.describe('Workspace Selection - Validation Tests', () => {

    test.beforeEach(async ({ workspace, page }) => {
        await workspace.navigateToOrg();
        // Wait for workspace selection page to be fully loaded
        await workspace.createNewWorkspaceButton.waitFor({ state: 'visible', timeout: 60000 });
    });

    test('TC-WORK-SEL-08: Create button disabled with empty name', async ({ workspace }) => {
        await workspace.clickCreateNewWorkspace();

        await expect(workspace.createModal.workspaceNameInput).toBeVisible();
        await expect(workspace.createModal.submitButton).toBeDisabled();
    });

});

test.describe('Workspace Selection - Pagination Tests (requires 25+ workspaces)', () => {

    test.beforeEach(async ({ workspace, page }) => {
        await workspace.navigateToOrg();
       
    });

    test('TC-WORK-SEL-09: Verify pagination controls are visible', async ({ page }) => {
        const rowsPerPageCombobox = page.getByRole('combobox', { name: 'Rows per page:' });
        const isPaginationVisible = await rowsPerPageCombobox.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (!isPaginationVisible) {
            test.skip();
            return;
        }

        await expect(rowsPerPageCombobox).toBeVisible();
        await expect(page.getByLabel('Go to next page')).toBeVisible();
    });

    test('TC-WORK-SEL-10: Change rows per page', async ({ page, workspace }) => {
        const rowsPerPageCombobox = page.getByRole('combobox', { name: 'Rows per page:' });
        const isPaginationVisible = await rowsPerPageCombobox.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (!isPaginationVisible) {
            test.skip();
            return;
        }

        await test.step('Change to 50 rows per page', async () => {
            await rowsPerPageCombobox.click();
            await page.getByRole('option', { name: '50' }).click();
            await page.waitForTimeout(1000);
        });

        await test.step('Verify items are displayed', async () => {
            // Pagination only exists in DataGrid view (>10 workspaces)
            const rowCount = await page.getByRole('row').filter({ has: page.getByRole('gridcell') }).count();
            expect(rowCount).toBeGreaterThan(0);
        });

        await test.step('Change back to 25 rows per page', async () => {
            await rowsPerPageCombobox.click();
            await page.getByRole('option', { name: '25' }).click();
            await page.waitForTimeout(1000);
        });
    });

    test('TC-WORK-SEL-11: Navigate through pagination pages', async ({ page }) => {
        const rowsPerPageCombobox = page.getByRole('combobox', { name: 'Rows per page:' });
        const isPaginationVisible = await rowsPerPageCombobox.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (!isPaginationVisible) {
            test.skip();
            return;
        }

        const nextPageButton = page.getByLabel('Go to next page');
        const isNextEnabled = await nextPageButton.isEnabled();

        if (!isNextEnabled) {
            test.skip();
            return;
        }

        await test.step('Navigate to next page', async () => {
            await nextPageButton.click();
            await page.waitForTimeout(1000);
        });

        await test.step('Navigate back to previous page', async () => {
            await page.getByLabel('Go to previous page').click();
            await page.waitForTimeout(1000);
        });
    });



});

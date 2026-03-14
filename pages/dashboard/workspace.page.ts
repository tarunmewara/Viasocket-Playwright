import { Page, Locator } from '@playwright/test';
import { CreateWorkspaceModal } from '../../modals/create-workspace.modal';

/**
 * Workspace Page
 * Composes: CreateWorkspaceModal
 * Handles: workspace selection page (search, create, datagrid/card list),
 * workspace menu (Switch Workspace, Workspace Settings, Members,
 * Notifications, Edit Profile), leave workspace, beta toggle, logout,
 * profile menu
 * Reference: selectedWorkspace.tsx, WorkspacesComponent.tsx, AllOrgs.tsx,
 *            LeaveWorkspaceButton.tsx, createOrgModal.tsx
 */
export class WorkspacePage {
    readonly page: Page;

    // Workspace trigger (opens the dropdown menu)
    readonly workspaceTrigger: Locator;

    // Workspace menu nav items (rendered via ListGroupedComponent, no individual data-testid)
    readonly switchWorkspaceLink: Locator;
    readonly workspaceSettingsLink: Locator;
    readonly membersLink: Locator;
    readonly notificationsLink: Locator;
    readonly editProfileLink: Locator;
    readonly logoutLink: Locator;

    // Leave workspace
    readonly leaveWorkspaceButton: Locator;
    readonly leaveWorkspaceConfirmButton: Locator;
    readonly leaveWorkspaceCancelButton: Locator;

    // Beta mode
    readonly betaSwitch: Locator;
    readonly betaConfirmButton: Locator;
    readonly betaCancelButton: Locator;

    // Workspace selection page (WorkspacesComponent.tsx / AllOrgs.tsx)
    readonly backButton: Locator;
    readonly searchInput: Locator;
    readonly createNewWorkspaceButton: Locator;
    readonly orgDataGrid: Locator;
    readonly orgCardAction: Locator;
    readonly renameInput: Locator;

    // Create Workspace modal (composed)
    readonly createModal: CreateWorkspaceModal;

    // Profile menu (on workspace selection page)
    readonly profileMenuButton: Locator;
    readonly profileMenu: Locator;
    readonly profileEditMenuItem: Locator;
    readonly profileLogoutMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from selectedWorkspace.tsx
        this.workspaceTrigger = page.getByTestId('workspace-trigger');
        this.betaSwitch = page.getByTestId('workspace-beta-switch');
        this.betaConfirmButton = page.getByTestId('workspace-beta-confirm');
        this.betaCancelButton = page.getByTestId('workspace-beta-cancel');

        // data-testid locators from LeaveWorkspaceButton.tsx
        this.leaveWorkspaceButton = page.getByTestId('leave-workspace-open-button');
        this.leaveWorkspaceConfirmButton = page.getByTestId('leave-workspace-confirm-button');
        this.leaveWorkspaceCancelButton = page.getByTestId('leave-workspace-cancel-button');

        // Role/text locators for workspace selection page (data-testid stripped in prod)
        this.backButton = page.getByRole('button', { name: 'back' });
        this.searchInput = page.getByPlaceholder('Search');
        this.createNewWorkspaceButton = page.getByRole('button', { name: 'Create New Workspace' });
        this.renameInput = page.locator('.title-textfield input');

        // AllOrgs.tsx — DataGrid (>10 orgs) or card view (≤10 orgs)
        this.orgDataGrid = page.locator('.MuiDataGrid-root');
        this.orgCardAction = page.locator('.MuiCardActionArea-root');

        // Create Workspace modal (composed)
        this.createModal = new CreateWorkspaceModal(page);

        // Profile menu (role/text locators — data-testid stripped in prod)
        this.profileMenuButton = page.locator('.workspace__page button').filter({ has: page.locator('.MuiTypography-h6') }).first();
        this.profileMenu = page.getByRole('menu');
        this.profileEditMenuItem = page.getByRole('menuitem', { name: 'Edit Profile' });
        this.profileLogoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });

        // Role/text based locators (workSpaceLink items have no data-testid)
        this.switchWorkspaceLink = page.getByRole('button', { name: 'Switch Workspace' });
        this.workspaceSettingsLink = page.getByRole('link', { name: 'Workspace Settings' });
        this.membersLink = page.getByRole('link', { name: 'Members' });
        this.notificationsLink = page.getByRole('link', { name: 'Notifications' });
        this.editProfileLink = page.getByRole('link', { name: 'Edit Profile' });
        this.logoutLink = page.getByRole('button', { name: 'Log Out' });
    }

    // --- Navigation ---

    async navigateToOrg(): Promise<void> {
        await this.page.goto(`${process.env.BASE_URL || 'https://flow.viasocket.com'}/org`);
    }

    async goBack(): Promise<void> {
        await this.backButton.click();
    }

    // --- Workspace selection page ---

    async searchWorkspace(query: string): Promise<void> {
        await this.searchInput.locator('input').fill(query);
    }

    async clickCreateNewWorkspace(): Promise<void> {
        await this.createNewWorkspaceButton.click();
    }

    async selectWorkspaceByRow(orgId: string): Promise<void> {
        await this.page.getByTestId(`org-row-${orgId}`).click();
    }

    async selectWorkspaceByCard(index: number = 0): Promise<void> {
        await this.orgCardAction.nth(index).click();
    }

    async selectWorkspaceByName(name: string): Promise<void> {
        await this.page.getByText(name, { exact: true }).first().click();
    }

    async selectFirstWorkspace(): Promise<void> {
        const isGrid = await this.orgDataGrid.isVisible().catch(() => false);
        if (isGrid) {
            await this.page.locator('.MuiDataGrid-row').first().click();
        } else {
            await this.orgCardAction.first().click();
        }
    }

    async getWorkspaceCardCount(): Promise<number> {
        return this.orgCardAction.count();
    }

    async isDataGridVisible(): Promise<boolean> {
        return this.orgDataGrid.isVisible();
    }

    // --- Workspace menu ---

    async openWorkspaceMenu(): Promise<void> {
        await this.workspaceTrigger.click();
    }

    async switchWorkspace(): Promise<void> {
        await this.switchWorkspaceLink.click();
    }

    async goToWorkspaceSettings(): Promise<void> {
        await this.workspaceSettingsLink.click();
    }

    async goToMembers(): Promise<void> {
        await this.membersLink.click();
    }

    async goToNotifications(): Promise<void> {
        await this.notificationsLink.click();
    }

    async goToEditProfile(): Promise<void> {
        await this.editProfileLink.click();
    }

    async logout(): Promise<void> {
        await this.logoutLink.click();
    }

    // --- Leave workspace ---

    async openLeaveDialog(): Promise<void> {
        await this.leaveWorkspaceButton.click();
    }

    async confirmLeaveWorkspace(): Promise<void> {
        await this.leaveWorkspaceButton.click();
        await this.leaveWorkspaceConfirmButton.click();
    }

    async cancelLeaveWorkspace(): Promise<void> {
        await this.leaveWorkspaceCancelButton.click();
    }

    // --- Beta mode ---

    async toggleBetaMode(): Promise<void> {
        await this.betaSwitch.click();
    }

    async confirmBetaToggle(): Promise<void> {
        await this.betaConfirmButton.click();
    }

    async cancelBetaToggle(): Promise<void> {
        await this.betaCancelButton.click();
    }

    // --- Profile menu (workspace selection page) ---

    async openProfileMenu(): Promise<void> {
        await this.profileMenuButton.click();
    }

    async editProfileFromMenu(): Promise<void> {
        await this.openProfileMenu();
        await this.profileEditMenuItem.click();
    }

    async logoutFromMenu(): Promise<void> {
        await this.openProfileMenu();
        await this.profileLogoutMenuItem.click();
    }

    // --- State checks ---

    async isWorkspaceMenuOpen(): Promise<boolean> {
        return this.switchWorkspaceLink.isVisible();
    }

    async getWorkspaceName(): Promise<string> {
        const nameEl = this.workspaceTrigger.locator('h6');
        return (await nameEl.textContent()) ?? '';
    }

    async isBetaEnabled(): Promise<boolean> {
        const checkbox = this.betaSwitch.locator('input[type="checkbox"]');
        return checkbox.isChecked();
    }

    async isSelectWorkspacePageVisible(): Promise<boolean> {
        return this.createNewWorkspaceButton.isVisible();
    }
}

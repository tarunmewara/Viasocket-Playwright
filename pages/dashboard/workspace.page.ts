import { Page, Locator } from '@playwright/test';

/**
 * Workspace Page
 * Handles: workspace menu (Switch Workspace, Workspace Settings, Members,
 * Notifications, Edit Profile), leave workspace, beta toggle, logout,
 * profile menu, workspace selector
 * Reference: selectedWorkspace.tsx, WorkspacesComponent.tsx, LeaveWorkspaceButton.tsx
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

        // data-testid locators from WorkspacesComponent.tsx (profile menu)
        this.profileMenuButton = page.getByTestId('workspace-profile-menu-button');
        this.profileMenu = page.getByTestId('profile-menu');
        this.profileEditMenuItem = page.getByTestId('workspace-edit-profile-menu-item');
        this.profileLogoutMenuItem = page.getByTestId('workspace-logout-menu-item');

        // Role/text based locators (workSpaceLink items have no data-testid)
        this.switchWorkspaceLink = page.getByRole('button', { name: 'Switch Workspace' });
        this.workspaceSettingsLink = page.getByRole('link', { name: 'Workspace Settings' });
        this.membersLink = page.getByRole('link', { name: 'Members' });
        this.notificationsLink = page.getByRole('link', { name: 'Notifications' });
        this.editProfileLink = page.getByRole('link', { name: 'Edit Profile' });
        this.logoutLink = page.getByRole('button', { name: 'Log Out' });
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
}

import { Page, Locator } from '@playwright/test';

/**
 * Workspace Page
 * Handles: workspace CRUD, switch workspace, edit profile, leave workspace, profile menu
 */
export class WorkspacePage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods
    // Create New Workspace button, workspace name input, industry combobox, team size dropdown
    // Switch Workspace link, Edit Profile link, Leave confirm button
    // workspace-back-button, workspace-rename-input, workspace-search-input
    // workspace-create-new-button, workspace-profile-menu-button
    // workspace-edit-profile-menu-item, workspace-logout-menu-item
    // workspace-trigger, workspace-beta-switch
}

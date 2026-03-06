import { Page, Locator } from '@playwright/test';

export class WorkspacePage {
    private readonly page: Page;
    private readonly createNewWorkspaceBtn: Locator;
    private readonly workspaceNameInput: Locator;
    private readonly industryCombobox: Locator;
    private readonly teamSizeDropdown: Locator;
    private readonly createBtn: Locator;
    private readonly switchWorkspaceLink: Locator;
    private readonly editProfileLink: Locator;
    private readonly leaveConfirmBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createNewWorkspaceBtn = page.getByRole('button', { name: 'Create New Workspace' });
        this.workspaceNameInput = page.getByRole('textbox', { name: 'Workspace name' });

        // Use the accessible name for industry which is stable
        this.industryCombobox = page.getByRole('combobox', { name: 'Example :- IT' });

        // Based on DOM analysis:
        // nth(0) is 'timezone-select'
        // nth(1) is 'industry'
        // nth(2) is 'team size'
        this.teamSizeDropdown = page.getByRole('combobox').nth(2);

        this.createBtn = page.getByRole('button', { name: 'Create' });

        // Switch / Edit Workspace locators
        this.switchWorkspaceLink = page.getByRole('link', { name: 'Switch Workspace' });
        this.editProfileLink = page.getByRole('link', { name: 'Edit Profile' });
        this.leaveConfirmBtn = page.getByLabel('Confirm Action').getByRole('button', { name: 'Leave' });
    }

    async clickCreateNewWorkspace(): Promise<void> {
        await this.createNewWorkspaceBtn.click();
    }

    async fillWorkspaceName(name: string): Promise<void> {
        await this.workspaceNameInput.click();
        await this.workspaceNameInput.fill(name);
    }

    async selectIndustry(industryName: string): Promise<void> {
        await this.industryCombobox.click();
        await this.page.getByRole('option', { name: industryName }).click();
    }

    async selectTeamSize(sizeOption: string): Promise<void> {
        await this.teamSizeDropdown.click();
        await this.page.getByRole('option', { name: sizeOption }).click();
    }

    async clickCreate(): Promise<void> {
        await this.createBtn.click();
    }

    async openWorkspaceFromDashboard(childIndex: number = 9): Promise<void> {
        await this.page.locator(`div:nth-child(${childIndex}) > div:nth-child(3)`).click();
    }

    async openWorkspaceMenu(workspaceName: string): Promise<void> {
        await this.page.getByRole('heading', { name: workspaceName }).click();
    }

    async clickSwitchWorkspace(): Promise<void> {
        await this.switchWorkspaceLink.click();
    }

    async selectWorkspaceToSwitchTo(childIndex: number = 10): Promise<void> {
        await this.page.locator(`div:nth-child(${childIndex}) > div:nth-child(3)`).click();
    }

    async clickEditProfile(): Promise<void> {
        await this.editProfileLink.click();
    }

    async clickLeaveActionForRow(rowIndex: number = 17): Promise<void> {
        await this.page.locator(`tr:nth-child(${rowIndex}) > .mat-cell.cdk-cell.cdk-column-action > .mat-focus-indicator`).click();
    }

    async getWorkspaceNamesByPrefix(prefix: string): Promise<string[]> {
        // Wait for the table to be visible
        await this.page.waitForSelector('table');

        // Get all workspace names from the second column (assuming it's the name column based on the screenshot)
        const names = await this.page.locator('tr td:nth-child(2)').allTextContents();

        // Filter names by prefix and trim them
        return names
            .map(name => name.trim())
            .filter(name => name.startsWith(prefix));
    }

    async clickLeaveForWorkspace(workspaceName: string): Promise<void> {
        // Find the row where the second column matches the workspace name and click 'Leave' in the third column
        const row = this.page.locator('tr').filter({ has: this.page.locator('td:nth-child(2)', { hasText: workspaceName }) });
        await row.locator('td:nth-child(3) button').click();
    }

    async confirmLeave(): Promise<void> {
        await this.leaveConfirmBtn.click();
    }
}

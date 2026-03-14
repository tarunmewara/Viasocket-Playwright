import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    private readonly page: Page;
    private readonly orgGridCell: Locator;
    private readonly createNewFlowBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.orgGridCell = page.getByRole('gridcell').filter({ hasText: /^$/ }).nth(5);
        this.createNewFlowBtn = page.getByRole('list').filter({ hasText: 'Create New FlowHomeSearch (' }).locator('button');
    }

    async navigateToOrg(): Promise<void> {
        await this.page.goto('/org');
    }

    async selectOrganization(): Promise<void> {
        await this.orgGridCell.click();
    }

    async clickCreateNewFlow(): Promise<void> {
        await this.createNewFlowBtn.click();
    }
}

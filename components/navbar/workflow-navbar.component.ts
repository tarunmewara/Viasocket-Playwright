import { Page, Locator } from '@playwright/test';

/**
 * Workflow Navbar Component
 * Handles: workflow view tabs, refresh chip, resume/restore, more options
 * Reference: workFlowNavbar.tsx, flowPageMoreOptions.tsx
 */
export class WorkflowNavbarComponent {
    readonly page: Page;

    // View tabs
    readonly viewTabs: Locator;
    readonly flowViewTab: Locator;
    readonly logViewTab: Locator;

    // Refresh chip
    readonly refreshChip: Locator;

    // Resume / Restore button
    readonly resumeRestoreButton: Locator;

    // More options (hamburger)
    readonly moreOptionsButton: Locator;
    readonly menuItem: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from workFlowNavbar.tsx
        this.viewTabs = page.getByTestId('workflow-view-tabs');
        this.flowViewTab = page.getByTestId('workflow-flow-view-tab');
        this.logViewTab = page.getByTestId('workflow-log-view-tab');
        this.refreshChip = page.getByTestId('workflow-refresh-chip');
        this.resumeRestoreButton = page.getByTestId('workflow-resume-restore-button');

        // data-testid locators from flowPageMoreOptions.tsx
        this.moreOptionsButton = page.getByTestId('flow-more-options-button');
        this.menuItem = page.getByTestId('flow-menu-item');
    }

    async switchToFlowView(): Promise<void> {
        await this.flowViewTab.click();
    }

    async switchToLogView(): Promise<void> {
        await this.logViewTab.click();
    }

    async clickRefresh(): Promise<void> {
        await this.refreshChip.click();
    }

    async clickResumeRestore(): Promise<void> {
        await this.resumeRestoreButton.click();
    }

    async openMoreOptions(): Promise<void> {
        await this.moreOptionsButton.click();
    }

    async selectMenuOption(optionText: string): Promise<void> {
        await this.openMoreOptions();
        await this.menuItem.filter({ hasText: optionText }).click();
    }

    async isRefreshVisible(): Promise<boolean> {
        return this.refreshChip.isVisible();
    }

    async isResumeRestoreVisible(): Promise<boolean> {
        return this.resumeRestoreButton.isVisible();
    }

    async isViewTabsVisible(): Promise<boolean> {
        return this.viewTabs.isVisible();
    }
}

import { Page, Locator } from '@playwright/test';

/**
 * Workflow Navbar Component
 * Handles: view tabs (flow/log), refresh chip, resume/restore, flow title, hamburger menu
 */
export class WorkflowNavbarComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // workflow-view-tabs, workflow-flow-view-tab, workflow-log-view-tab
    // workflow-refresh-chip, workflow-resume-restore-button
    // flow-title-input, hamburger-menu-button
}

import { Page, Locator } from '@playwright/test';

/**
 * Flow Breadcrumb Component
 * Handles: breadcrumb navigation (home link, project link)
 */
export class FlowBreadcrumbComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // breadcrumb-home-link, breadcrumb-project-link
}

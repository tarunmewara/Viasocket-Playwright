import { Page, Locator } from '@playwright/test';

/**
 * Flow Breadcrumb Component
 * Handles: breadcrumb navigation on workflow page (home, project)
 * Reference: FlowBreadcrumb.tsx
 */
export class FlowBreadcrumbComponent {
    readonly page: Page;

    readonly homeLink: Locator;
    readonly projectLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from FlowBreadcrumb.tsx
        this.homeLink = page.getByTestId('breadcrumb-home-link');
        this.projectLink = page.getByTestId('breadcrumb-project-link');
    }

    async navigateHome(): Promise<void> {
        await this.homeLink.click();
    }

    async navigateToProject(): Promise<void> {
        await this.projectLink.click();
    }

    async isHomeVisible(): Promise<boolean> {
        return this.homeLink.isVisible();
    }

    async isProjectVisible(): Promise<boolean> {
        return this.projectLink.isVisible();
    }

    async getProjectName(): Promise<string | null> {
        return this.projectLink.textContent();
    }
}

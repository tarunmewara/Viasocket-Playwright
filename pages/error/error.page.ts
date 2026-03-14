import { Page, Locator } from '@playwright/test';

/**
 * Error & Not Found Page
 * Handles: error screen actions, 404 not found navigation
 * Reference: ErrorScreen.tsx, NotFoundPage.tsx
 */
export class ErrorPage {
    readonly page: Page;

    // Error screen
    readonly errorLogoutButton: Locator;
    readonly errorRefreshButton: Locator;
    readonly errorStatusExpandButton: Locator;
    readonly errorStatusViewLogsButton: Locator;

    // Not found
    readonly notFoundGoBackButton: Locator;
    readonly notFoundHomeButton: Locator;

    // User go back (generic)
    readonly userGoBackButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Error screen
        this.errorLogoutButton = page.getByTestId('error-screen-logout-button');
        this.errorRefreshButton = page.getByTestId('error-screen-refresh-button');
        this.errorStatusExpandButton = page.getByTestId('error-status-expand-button');
        this.errorStatusViewLogsButton = page.getByTestId('error-status-view-logs-button');

        // Not found
        this.notFoundGoBackButton = page.getByTestId('not-found-go-back-button');
        this.notFoundHomeButton = page.getByTestId('not-found-home-button');

        // User go back
        this.userGoBackButton = page.getByTestId('user-go-back-button');
    }

    async clickRefresh(): Promise<void> {
        await this.errorRefreshButton.click();
    }

    async clickLogout(): Promise<void> {
        await this.errorLogoutButton.click();
    }

    async expandErrorStatus(): Promise<void> {
        await this.errorStatusExpandButton.click();
    }

    async viewLogs(): Promise<void> {
        await this.errorStatusViewLogsButton.click();
    }

    async goBack(): Promise<void> {
        await this.notFoundGoBackButton.click();
    }

    async goHome(): Promise<void> {
        await this.notFoundHomeButton.click();
    }
}

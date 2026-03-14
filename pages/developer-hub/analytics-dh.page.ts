import { Page, Locator } from '@playwright/test';

/**
 * DH Analytics Page (Developer Hub)
 * Handles: developer hub analytics — actions guide, app details, auth navigation,
 * connection, errors, force update, restore, run logs, triggers guide, version links
 * Reference: DHATableRow.tsx, dhAnalytics.tsx
 */
export class DhAnalyticsPage {
    readonly page: Page;

    readonly actionsGuideLink: Locator;
    readonly appDetailsButton: Locator;
    readonly authNavigateButton: Locator;
    readonly connectionButton: Locator;
    readonly errorsLinkButton: Locator;
    readonly forceUpdateButton: Locator;
    readonly restoreActionButton: Locator;
    readonly restoreVersionButton: Locator;
    readonly runLogsButton: Locator;
    readonly tableCreateButton: Locator;
    readonly topOrgsButton: Locator;
    readonly topOrgsRunsButton: Locator;
    readonly triggersGuideLink: Locator;
    readonly versionLinkButton: Locator;
    readonly versionRunsButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.actionsGuideLink = page.getByTestId('analytics-actions-guide-link');
        this.appDetailsButton = page.getByTestId('analytics-app-details-button');
        this.authNavigateButton = page.getByTestId('analytics-auth-navigate-button');
        this.connectionButton = page.getByTestId('analytics-connection-button');
        this.errorsLinkButton = page.getByTestId('analytics-errors-link-button');
        this.forceUpdateButton = page.getByTestId('analytics-force-update-button');
        this.restoreActionButton = page.getByTestId('analytics-restore-action-button');
        this.restoreVersionButton = page.getByTestId('analytics-restore-version-button');
        this.runLogsButton = page.getByTestId('analytics-run-logs-button');
        this.tableCreateButton = page.getByTestId('analytics-table-create-button');
        this.topOrgsButton = page.getByTestId('analytics-top-orgs-button');
        this.topOrgsRunsButton = page.getByTestId('analytics-top-orgs-runs-button');
        this.triggersGuideLink = page.getByTestId('analytics-triggers-guide-link');
        this.versionLinkButton = page.getByTestId('analytics-version-link-button');
        this.versionRunsButton = page.getByTestId('analytics-version-runs-button');
    }

    async clickAppDetails(): Promise<void> {
        await this.appDetailsButton.click();
    }

    async navigateToAuth(): Promise<void> {
        await this.authNavigateButton.click();
    }

    async clickConnection(): Promise<void> {
        await this.connectionButton.click();
    }

    async clickForceUpdate(): Promise<void> {
        await this.forceUpdateButton.click();
    }

    async clickRestoreAction(): Promise<void> {
        await this.restoreActionButton.click();
    }

    async clickRunLogs(): Promise<void> {
        await this.runLogsButton.click();
    }
}

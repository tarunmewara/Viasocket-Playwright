import { Page, Locator } from '@playwright/test';

/**
 * Connections Page
 * Handles: connection listing, search, toggle list/card view, connect new app,
 * update connection, card actions
 * Composes: ConnectionDrawerComponent, AuthLevelSelectorComponent, ServiceDrawerComponent
 * Reference: authDataTable.tsx, connectionsCardView.tsx, allAppsTable.tsx
 */
export class ConnectionsPage {
    readonly page: Page;

    // Page heading & description
    readonly heading: Locator;

    // Search
    readonly searchInput: Locator;

    // Toggle view (list <-> card)
    readonly toggleViewButton: Locator;

    // Connect new app
    readonly connectAppButton: Locator;

    // Card view
    readonly connectionCard: Locator;

    // Update connection (when user is not the owner)
    readonly updateConnectionOpenButton: Locator;

    // Update connection (when user is the owner)
    readonly updateConnectionButton: Locator;

    // Row details
    readonly rowExpandButton: Locator;
    readonly labelMaskCheckbox: Locator;
    readonly labelNameTextfield: Locator;

    // No results
    readonly noMatchingText: Locator;

    constructor(page: Page) {
        this.page = page;

        // Heading
        this.heading = page.getByRole('heading', { name: 'Connections' });

        // data-testid locators from authDataTable.tsx
        this.searchInput = page.getByTestId('searchbar-auth-search');
        this.toggleViewButton = page.getByTestId('connections-toggle-view-button');
        this.connectAppButton = page.getByTestId('connections-connect-app-button');

        // Card view — from connectionsCardView.tsx
        this.connectionCard = page.getByTestId('connections-card-action');

        // Update buttons — from allAppsTable.tsx, UpdateOrRequestConnectionUpdate.tsx
        this.updateConnectionOpenButton = page.getByTestId('connection-update-open-button');
        this.updateConnectionButton = page.getByTestId('connections-update-button');

        // Row details — from DrawerforSpecificConnection.tsx
        this.rowExpandButton = page.getByTestId('connections-row-expand-button');
        this.labelMaskCheckbox = page.getByTestId('connection-label-mask-checkbox');
        this.labelNameTextfield = page.getByTestId('connection-label-name-textfield');

        // Empty state
        this.noMatchingText = page.getByText('No matching apps found.');
    }

    async searchConnection(query: string): Promise<void> {
        await this.searchInput.locator('input').fill(query);
    }

    async clearSearch(): Promise<void> {
        await this.searchInput.locator('input').fill('');
    }

    async toggleView(): Promise<void> {
        await this.toggleViewButton.click();
    }

    async clickConnectApp(): Promise<void> {
        await this.connectAppButton.click();
    }

    async clickConnectionCard(index: number = 0): Promise<void> {
        await this.connectionCard.nth(index).click();
    }

    async getConnectionCardCount(): Promise<number> {
        return this.connectionCard.count();
    }

    async clickConnectionCardByName(serviceName: string): Promise<void> {
        await this.connectionCard.filter({ hasText: serviceName }).click();
    }

    async clickUpdateConnection(index: number = 0): Promise<void> {
        await this.updateConnectionButton.nth(index).click();
    }

    async clickRequestUpdateConnection(index: number = 0): Promise<void> {
        await this.updateConnectionOpenButton.nth(index).click();
    }

    async hasNoMatchingResults(): Promise<boolean> {
        return this.noMatchingText.isVisible();
    }

    async isLoaded(): Promise<boolean> {
        return this.heading.isVisible();
    }
}

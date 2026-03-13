import { Page, Locator } from '@playwright/test';

/**
 * Dashboard Page
 * Handles: org selection, create flow, flow cards, wallet, search, back
 */
export class DashboardPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods
    // Org grid cell, create new flow button
    // dashboard-wallet-button, dashboard-search-button, dashboard-back-button
    // org-datagrid, org-card-action, flow-card, recent-workflow-item
    // collection-all-button, collection-create-button, collection-list-item
    // collection-rename-input, collection-rename-submit-button, collection-rename-cancel-button
}

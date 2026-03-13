import { Page, Locator } from '@playwright/test';

/**
 * Connection Drawer Component
 * Handles: individual connection detail drawer — description editing,
 * used-in flows, valid actions/triggers, remove connection, copy auth ID
 * Reference: DrawerforSpecificConnection.tsx
 */
export class ConnectionDrawerComponent {
    readonly page: Page;

    // Header
    readonly closeButton: Locator;

    // Description
    readonly descriptionInput: Locator;

    // Used In — project expand/collapse and flow links
    readonly projectExpandToggle: Locator;
    readonly flowLink: Locator;

    // Valid Actions/Triggers — show more/less
    readonly showMoreButton: Locator;

    // Footer — Auth ID copy
    readonly copyAuthIdButton: Locator;

    // Actions
    readonly removeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from DrawerforSpecificConnection.tsx
        this.closeButton = page.getByTestId('connection-drawer-close-button');
        this.descriptionInput = page.getByTestId('connection-description-input');
        this.projectExpandToggle = page.getByTestId('connection-project-expand-toggle');
        this.flowLink = page.getByTestId('connection-flow-link');
        this.showMoreButton = page.getByTestId('connection-show-more-button');
        this.copyAuthIdButton = page.getByTestId('connection-copy-auth-id-button');
        this.removeButton = page.getByTestId('connection-remove-button');
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async fillDescription(text: string): Promise<void> {
        await this.descriptionInput.locator('input').fill(text);
    }

    async submitDescription(): Promise<void> {
        await this.descriptionInput.locator('input').press('Enter');
    }

    async blurDescription(): Promise<void> {
        await this.descriptionInput.locator('input').blur();
    }

    async toggleProjectExpand(index: number = 0): Promise<void> {
        await this.projectExpandToggle.nth(index).click();
    }

    async clickFlowLink(index: number = 0): Promise<void> {
        await this.flowLink.nth(index).click();
    }

    async clickFlowLinkByName(flowName: string): Promise<void> {
        await this.flowLink.filter({ hasText: flowName }).click();
    }

    async getFlowLinkCount(): Promise<number> {
        return this.flowLink.count();
    }

    async toggleShowMore(): Promise<void> {
        await this.showMoreButton.click();
    }

    async copyAuthId(): Promise<void> {
        await this.copyAuthIdButton.click();
    }

    async removeConnection(): Promise<void> {
        await this.removeButton.click();
    }

    async isVisible(): Promise<boolean> {
        return this.closeButton.isVisible();
    }
}

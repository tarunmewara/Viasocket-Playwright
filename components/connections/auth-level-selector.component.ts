import { Page, Locator } from '@playwright/test';

/**
 * Auth Level Selector Component
 * Handles: access level selection (org, collection, flow) for a connection
 * Reference: AuthSuccessPopUpLevel.tsx
 */
export class AuthLevelSelectorComponent {
    readonly page: Page;

    // Selector trigger (dotted underline text)
    readonly selectorTrigger: Locator;

    // Menu items
    readonly orgLevelOption: Locator;
    readonly collectionLevelOption: Locator;
    readonly flowLevelOption: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from AuthSuccessPopUpLevel.tsx
        this.selectorTrigger = page.getByTestId('auth-access-level-selector');
        this.orgLevelOption = page.getByTestId('auth-access-level-org');
        this.collectionLevelOption = page.getByTestId('auth-access-level-collection');
        this.flowLevelOption = page.getByTestId('auth-access-level-flow');
    }

    async openSelector(): Promise<void> {
        await this.selectorTrigger.click();
    }

    async selectOrgLevel(): Promise<void> {
        await this.openSelector();
        await this.orgLevelOption.click();
    }

    async selectCollectionLevel(): Promise<void> {
        await this.openSelector();
        await this.collectionLevelOption.click();
    }

    async selectFlowLevel(): Promise<void> {
        await this.openSelector();
        await this.flowLevelOption.click();
    }

    async getCurrentLevel(): Promise<string> {
        return (await this.selectorTrigger.textContent()) ?? '';
    }

    async isVisible(): Promise<boolean> {
        return this.selectorTrigger.isVisible();
    }
}

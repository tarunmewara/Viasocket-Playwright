import { Page, Locator } from '@playwright/test';

/**
 * Condition Component
 * Handles: if-block condition slider — add condition button
 * Reference: ifBlockSlider.tsx
 */
export class ConditionComponent {
    readonly page: Page;

    readonly addConditionButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locator from ifBlockSlider.tsx
        this.addConditionButton = page.getByTestId('ifblock-add-condition-button');
    }

    async addCondition(): Promise<void> {
        await this.addConditionButton.click();
    }

    async isAddConditionVisible(): Promise<boolean> {
        return this.addConditionButton.isVisible();
    }
}

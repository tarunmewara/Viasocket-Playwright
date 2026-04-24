import { Page, Locator } from '@playwright/test';

/**
 * Condition Component
 * Handles: if-block condition slider — add condition button
 * Reference: ifBlockSlider.tsx
 */
export class ConditionComponent {
    readonly page: Page;

    readonly addConditionButton: Locator;
    readonly switchAddConditionButton: Locator;
    readonly mentionsInput: Locator;
    readonly saveButton: Locator;
    readonly stepConfigContent: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locator from ifBlockSlider.tsx
        this.addConditionButton = page.getByTestId('ifblock-add-condition-button');
        this.switchAddConditionButton = page.getByTestId('switch-add-condition-button');
        this.mentionsInput = page.getByTestId('mentions-input');
        this.saveButton = page.getByTestId('save-button');
        this.stepConfigContent = page.getByTestId('step-config-content');
    }

    async addCondition(): Promise<void> {
        await this.addConditionButton.click();
    }

    async isAddConditionVisible(): Promise<boolean> {
        return this.addConditionButton.isVisible();
    }

    async clickSwitchAddCondition(): Promise<void> {
        await this.switchAddConditionButton.click();
    }

    async fillConditionDescription(text: string): Promise<void> {
        await this.mentionsInput.fill(text);
    }

    async fillConditionPath(text: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'Enter a condition for path.' }).fill(text);
    }

    async clickAskAI(): Promise<void> {
        await this.stepConfigContent.getByRole('button', { name: 'Ask AI' }).click();
    }

    async save(): Promise<void> {
        await this.saveButton.click();
    }
}

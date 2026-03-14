import { Page, Locator } from '@playwright/test';

/**
 * Success Modal
 * Handles: post-action success dialogs with start/done actions
 * Reference: success screen components
 */
export class SuccessModal {
    readonly page: Page;

    readonly afterDoneButton: Locator;
    readonly startButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.afterDoneButton = page.getByTestId('success-after-done-button');
        this.startButton = page.getByTestId('success-start-button');
    }

    async clickDone(): Promise<void> {
        await this.afterDoneButton.click();
    }

    async clickStart(): Promise<void> {
        await this.startButton.click();
    }
}

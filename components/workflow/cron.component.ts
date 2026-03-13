import { Page, Locator } from '@playwright/test';

/**
 * Cron Component
 * Handles: cron trigger configuration — uses slider next button for confirmation
 * Reference: closeSlidersButtonV2.tsx (slider-next-button when trigger isDrafted)
 */
export class CronComponent {
    readonly page: Page;

    // The "Next" button shown for cron trigger drafts
    readonly nextButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locator from closeSlidersButtonV2.tsx
        this.nextButton = page.getByTestId('slider-next-button');
    }

    async clickNext(): Promise<void> {
        await this.nextButton.click();
    }

    async isNextVisible(): Promise<boolean> {
        return this.nextButton.isVisible();
    }
}

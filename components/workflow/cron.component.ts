import { Page, Locator } from '@playwright/test';

/**
 * Cron Component
 * Handles: cron trigger configuration — uses slider next button for confirmation
 * Reference: closeSlidersButtonV2.tsx (slider-next-button when trigger isDrafted)
 *            cronComponent.tsx (cron expression input and save button)
 */
export class CronComponent {
    readonly page: Page;

    // The "Next" button shown for cron trigger drafts
    readonly nextButton: Locator;

    // Cron natural-language input (cronComponent.tsx — data-testid='cron-statement-input')
    readonly cronInput: Locator;

    // "Set Cron" / "Update Cron" save button (cronComponent.tsx — data-testid='cron-save-button')
    readonly setCronButton: Locator;

    // Timezone selector Autocomplete (data-testid='cron-timezone-input')
    readonly timezoneInput: Locator;

    // "Expression" toggle button — shows raw cron expression (data-testid='cron-expression-toggle')
    readonly expressionToggle: Locator;

    // Missing timezone warning box (data-testid='cron-timezone-missing')
    readonly timezoneMissing: Locator;

    // "Get data" advance config button (data-testid='cron-get-data-button')
    readonly getDataButton: Locator;

    // Change workspace timezone box (data-testid='cron-change-timezone')
    readonly changeTimezone: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locator from closeSlidersButtonV2.tsx
        this.nextButton = page.getByTestId('slider-next-button');

        this.cronInput = page.getByTestId('cron-statement-input').locator('input');
        this.setCronButton = page.getByTestId('cron-save-button');
        this.timezoneInput = page.getByTestId('cron-timezone-input');
        this.expressionToggle = page.getByTestId('cron-expression-toggle');
        this.timezoneMissing = page.getByTestId('cron-timezone-missing');
        this.getDataButton = page.getByTestId('cron-get-data-button');
        this.changeTimezone = page.getByTestId('cron-change-timezone');
    }

    async fillStatement(statement: string): Promise<void> {
        await this.cronInput.fill(statement);
    }

    async save(): Promise<void> {
        await this.setCronButton.click();
    }

    async clickNext(): Promise<void> {
        await this.nextButton.click();
    }

    async isNextVisible(): Promise<boolean> {
        return this.nextButton.isVisible();
    }
}

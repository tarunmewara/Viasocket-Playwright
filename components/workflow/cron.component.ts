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

    // Cron natural-language input — targets the combobox <input> inside the Autocomplete
    // container (data-testid='cron-statement-autocomplete' on root div, cronComponent.tsx)
    readonly cronInput: Locator;

    // "Set Cron" / "Update Cron" save button (cronComponent.tsx — data-testid='cron-save-button')
    readonly setCronButton: Locator;

    // Timezone selector — scoped to Autocomplete container (data-testid='cron-timezone-autocomplete')
    readonly timezoneInput: Locator;

    // "Expression" toggle button (data-testid='cron-expression-toggle')
    readonly expressionToggle: Locator;

    // Expression TextField shown after toggle (data-testid='cron-expression-field')
    readonly expressionField: Locator;

    // Missing timezone warning box (data-testid='cron-timezone-missing')
    readonly timezoneMissing: Locator;

    // "Get data" advance config button (data-testid='cron-get-data-button')
    readonly getDataButton: Locator;

    // Change workspace timezone box (data-testid='cron-change-timezone')
    readonly changeTimezone: Locator;

    // Advance config slider root (data-testid='cron-advance-config-slider')
    readonly cronAdvanceConfigSlider: Locator;

    // Hit flow individually accordion (data-testid='hit-flow-individually-accordion')
    readonly hitFlowIndividuallyAccordion: Locator;

    // Run flow one by one switch (data-testid='hit-flow-individually-switch')
    readonly hitFlowIndividuallySwitch: Locator;

    // Pre-filter key Autocomplete input (data-testid='pre-filter-key-input')
    readonly preFilterKeyInput: Locator;

    // Get-data pre-process step node on canvas (data-testid='cron-preprocess-step')
    readonly cronPreprocessStep: Locator;

    // Loop / hit-flow-individually step node on canvas (data-testid='cron-loop-step')
    readonly cronLoopStep: Locator;

    // Run-if-condition FAB button (data-testid='cron-run-if-condition-button')
    readonly cronRunIfConditionButton: Locator;

    // Pre-condition enable switch (data-testid='pre-condition-switch')
    readonly preConditionSwitch: Locator;

    // Generic save button for pre-process steps (data-testid='save-button')
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locator from closeSlidersButtonV2.tsx
        this.nextButton = page.getByTestId('slider-next-button');

        // Scope to the Autocomplete root div then pick the combobox <input> inside it.
        // This avoids relying on data-testid forwarding through MUI's inputProps chain.
        this.cronInput = page.getByTestId('cron-statement-autocomplete').getByRole('combobox');
        this.setCronButton = page.getByTestId('cron-save-button');
        this.timezoneInput = page.getByTestId('cron-timezone-autocomplete').getByRole('combobox');
        this.expressionToggle = page.getByTestId('cron-expression-toggle');
        this.expressionField = page.getByTestId('cron-expression-field');
        this.timezoneMissing = page.getByTestId('cron-timezone-missing');
        this.getDataButton = page.getByTestId('cron-get-data-button');
        this.changeTimezone = page.getByTestId('cron-change-timezone');
        this.cronAdvanceConfigSlider = page.getByTestId('cron-advance-config-slider');
        this.hitFlowIndividuallyAccordion = page.getByTestId('hit-flow-individually-accordion');
        this.hitFlowIndividuallySwitch = page.getByTestId('hit-flow-individually-switch');
        this.preFilterKeyInput = page.getByTestId('pre-filter-key-input');
        this.cronPreprocessStep = page.getByTestId('cron-preprocess-step');
        this.cronLoopStep = page.getByTestId('cron-loop-step');
        this.cronRunIfConditionButton = page.getByTestId('cron-run-if-condition-button');
        this.preConditionSwitch = page.getByTestId('pre-condition-switch');
        this.saveButton = page.getByTestId('save-button');
    }

    async fillStatement(statement: string): Promise<void> {
        // fill() sets the value atomically — more reliable than pressSequentially
        // under parallel load where individual keystrokes can be dropped.
        await this.cronInput.click();
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

    async selectTimezone(timezone: string): Promise<void> {
        await this.timezoneInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.timezoneInput.click();
        await this.timezoneInput.pressSequentially(timezone);
        await this.page.getByRole('option').filter({ hasText: timezone }).first().click({ timeout: 20000 });
    }

    async clickExpressionToggle(): Promise<void> {
        await this.expressionToggle.click();
    }

    async isExpressionFieldVisible(): Promise<boolean> {
        return this.expressionField.isVisible();
    }

}

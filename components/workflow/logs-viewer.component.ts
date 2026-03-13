import { Page, Locator } from '@playwright/test';

/**
 * Logs Viewer Component
 * Handles: log accordion, expand/collapse, return to flow, large log fetch, date pickers, filters
 * Reference: logsAccordionBody.tsx, logsAccordionHead.tsx, largeLogButton.tsx, logsTimePeriod.tsx, logsFilterSearchBar.tsx
 */
export class LogsViewerComponent {
    readonly page: Page;

    // Accordion controls (logsAccordionBody.tsx)
    readonly expandCollapseButton: Locator;
    readonly returnToFlowButton: Locator;
    readonly returnToFlowUnavailableButton: Locator;

    // Slider controls (logsAccordionHead.tsx)
    readonly sliderCloseButton: Locator;
    readonly executeFlowButton: Locator;

    // Large log (largeLogButton.tsx)
    readonly fetchLargeLogButton: Locator;

    // Date pickers (logsTimePeriod.tsx)
    readonly startDatePicker: Locator;
    readonly endDatePicker: Locator;

    // Filter controls (logsFilterSearchBar.tsx)
    readonly advanceFilterButton: Locator;
    readonly resetFilterChip: Locator;

    // Pause/Active toggle (PauseAndActiveToggleComponent.tsx)
    readonly pauseActiveToggle: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from logsAccordionBody.tsx
        this.expandCollapseButton = page.getByTestId('logs-expand-collapse-button');
        this.returnToFlowButton = page.getByTestId('logs-return-to-flow-button');
        this.returnToFlowUnavailableButton = page.getByTestId('logs-return-to-flow-unavailable-button');

        // data-testid locators from logsAccordionHead.tsx
        this.sliderCloseButton = page.getByTestId('logs-slider-close-button');
        this.executeFlowButton = page.getByTestId('logs-execute-flow-button');

        // data-testid locator from largeLogButton.tsx
        this.fetchLargeLogButton = page.getByTestId('large-log-fetch-button');

        // data-testid locators from logsTimePeriod.tsx
        this.startDatePicker = page.getByTestId('logs-start-date-picker');
        this.endDatePicker = page.getByTestId('logs-end-date-picker');

        // data-testid locators from logsFilterSearchBar.tsx
        this.advanceFilterButton = page.getByTestId('logs-advance-filter-button');
        this.resetFilterChip = page.getByTestId('logs-reset-filter-chip');

        // data-testid locator from PauseAndActiveToggleComponent.tsx
        this.pauseActiveToggle = page.getByTestId('flow-pause-active-toggle');
    }

    async toggleExpandCollapse(): Promise<void> {
        await this.expandCollapseButton.click();
    }

    async returnToFlow(): Promise<void> {
        await this.returnToFlowButton.click();
    }

    async closeSlider(): Promise<void> {
        await this.sliderCloseButton.click();
    }

    async executeFlow(): Promise<void> {
        await this.executeFlowButton.click();
    }

    async fetchLargeLog(): Promise<void> {
        await this.fetchLargeLogButton.click();
    }

    async openAdvanceFilter(): Promise<void> {
        await this.advanceFilterButton.click();
    }

    async resetFilter(): Promise<void> {
        await this.resetFilterChip.click();
    }

    async togglePauseActive(): Promise<void> {
        await this.pauseActiveToggle.click();
    }

    async isExpandCollapseVisible(): Promise<boolean> {
        return this.expandCollapseButton.isVisible();
    }

    async isReturnToFlowVisible(): Promise<boolean> {
        return this.returnToFlowButton.isVisible();
    }

    async isLargeLogFetchVisible(): Promise<boolean> {
        return this.fetchLargeLogButton.isVisible();
    }
}

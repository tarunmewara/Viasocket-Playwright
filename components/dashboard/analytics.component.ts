import { Page, Locator } from '@playwright/test';

/**
 * Analytics Component
 * Handles: dashboard analytics time period select and filter tabs
 * Reference: AnalyticsMetrics.tsx, FilterFlows.tsx
 */
export class AnalyticsComponent {
    readonly page: Page;

    // Time period selector
    readonly timePeriodSelect: Locator;
    readonly todayOption: Locator;
    readonly last7DaysOption: Locator;

    // Filter tabs container and individual tabs
    readonly filterTabs: Locator;
    readonly filterTab: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from AnalyticsMetrics.tsx
        this.timePeriodSelect = page.getByTestId('dashboard-analytics-time-period-select');
        this.todayOption = page.getByTestId('dashboard-analytics-today-option');
        this.last7DaysOption = page.getByTestId('dashboard-analytics-last7days-option');

        // data-testid locators from FilterFlows.tsx
        this.filterTabs = page.getByTestId('dashboard-filter-tabs');
        this.filterTab = page.getByTestId('dashboard-filter-tab');
    }

    // --- Time period ---

    async selectTimePeriod(period: 'today' | 'last7days'): Promise<void> {
        await this.timePeriodSelect.click();
        const optionTestId = period === 'today'
            ? 'dashboard-analytics-today-option'
            : 'dashboard-analytics-last7days-option';
        await this.page.getByTestId(optionTestId).click();
    }

    async selectToday(): Promise<void> {
        await this.selectTimePeriod('today');
    }

    async selectLast7Days(): Promise<void> {
        await this.selectTimePeriod('last7days');
    }

    // --- Filter tabs ---

    async selectFilter(
        filter: 'all' | 'active' | 'draft' | 'failed' | 'paused' | 'trash'
    ): Promise<void> {
        const labelMap: Record<string, string> = {
            all: 'All Workflows',
            active: 'Live',
            draft: 'Drafted',
            failed: 'Error',
            paused: 'Paused',
            trash: 'Trashed',
        };
        await this.filterTab.filter({ hasText: labelMap[filter] }).click();
    }

    async isTimePeriodVisible(): Promise<boolean> {
        return this.timePeriodSelect.isVisible();
    }

    async isFilterTabsVisible(): Promise<boolean> {
        return this.filterTabs.isVisible();
    }
}

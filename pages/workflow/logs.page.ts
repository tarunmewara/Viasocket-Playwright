import { Page } from '@playwright/test';
import { LogsViewerComponent } from '../../components/workflow/logs-viewer.component';
import { LogsFilterComponent } from '../../components/logs/logs-filter.component';

/**
 * Logs Page
 * Composes: LogsViewerComponent, LogsFilterComponent
 */
export class LogsPage {
    readonly page: Page;

    // Composed components
    readonly viewer: LogsViewerComponent;
    readonly filter: LogsFilterComponent;

    constructor(page: Page) {
        this.page = page;
        this.viewer = new LogsViewerComponent(page);
        this.filter = new LogsFilterComponent(page);
    }

    // --- Delegated: Viewer ---

    async toggleExpandCollapse(): Promise<void> {
        await this.viewer.toggleExpandCollapse();
    }

    async returnToFlow(): Promise<void> {
        await this.viewer.returnToFlow();
    }

    async closeSlider(): Promise<void> {
        await this.viewer.closeSlider();
    }

    async executeFlow(): Promise<void> {
        await this.viewer.executeFlow();
    }

    async fetchLargeLog(): Promise<void> {
        await this.viewer.fetchLargeLog();
    }

    async togglePauseActive(): Promise<void> {
        await this.viewer.togglePauseActive();
    }

    // --- Delegated: Filter ---

    async openAdvanceFilter(): Promise<void> {
        await this.viewer.openAdvanceFilter();
    }

    async resetFilter(): Promise<void> {
        await this.viewer.resetFilter();
    }

    async clickFilterHistory(): Promise<void> {
        await this.filter.clickFilterHistory();
    }

    async cancelFilter(): Promise<void> {
        await this.filter.cancel();
    }

    async rerunFilteredSuccess(): Promise<void> {
        await this.filter.rerunFilteredSuccess();
    }

    async rerunFilteredFailed(): Promise<void> {
        await this.filter.rerunFilteredFailed();
    }

    async rerunTotalSuccess(): Promise<void> {
        await this.filter.rerunTotalSuccess();
    }

    async rerunTotalFailed(): Promise<void> {
        await this.filter.rerunTotalFailed();
    }

    // --- State checks ---

    async isExpandCollapseVisible(): Promise<boolean> {
        return this.viewer.isExpandCollapseVisible();
    }

    async isReturnToFlowVisible(): Promise<boolean> {
        return this.viewer.isReturnToFlowVisible();
    }

    async isAdvanceFilterVisible(): Promise<boolean> {
        return this.viewer.advanceFilterButton.isVisible();
    }
}

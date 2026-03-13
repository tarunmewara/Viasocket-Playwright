import { Page, Locator } from '@playwright/test';

/**
 * Metrics Page
 * Handles: metrics table/chart views, timeframe selection, flow-wise/step-wise tabs,
 * data grid interaction, and view history links
 * Reference: Metrics.tsx, Navbar.tsx, metricTimeFrameDropdown.tsx
 */
export class MetricsPage {
    readonly page: Page;

    // Page heading
    readonly heading: Locator;

    // Main tabs (Tables / Charts)
    readonly tablesTab: Locator;
    readonly chartsTab: Locator;

    // Timeframe selector
    readonly timeframeSelect: Locator;
    readonly timeframeOption: Locator;

    // Sub tabs (Flow Wise / Step Wise)
    readonly flowWiseTab: Locator;
    readonly stepWiseTab: Locator;

    // Data grid
    readonly dataGrid: Locator;
    readonly dataGridRows: Locator;

    // Column headers
    readonly idColumn: Locator;
    readonly collectionColumn: Locator;
    readonly flowColumn: Locator;
    readonly typeColumn: Locator;
    readonly timeColumn: Locator;
    readonly runsColumn: Locator;
    readonly statusColumn: Locator;
    readonly executedOnColumn: Locator;
    readonly viewHistoryColumn: Locator;

    constructor(page: Page) {
        this.page = page;

        // Page heading
        this.heading = page.getByRole('heading', { name: 'Metrics' });

        // Main tabs — Tables and Charts
        this.tablesTab = page.getByRole('tab', { name: 'Tables' });
        this.chartsTab = page.getByRole('tab', { name: 'Charts' });

        // data-testid locators from metricTimeFrameDropdown.tsx
        this.timeframeSelect = page.getByTestId('metrics-timeframe-select');
        this.timeframeOption = page.getByTestId('metrics-timeframe-option');

        // Sub tabs — Flow Wise and Step Wise
        this.flowWiseTab = page.getByRole('tab', { name: 'FLOW WISE' });
        this.stepWiseTab = page.getByRole('tab', { name: 'STEP WISE' });

        // MUI DataGrid
        this.dataGrid = page.locator('.MuiDataGrid-root');
        this.dataGridRows = page.locator('.MuiDataGrid-row');

        // Column headers (from Metrics.tsx columns config)
        this.idColumn = page.getByRole('columnheader', { name: 'ID' });
        this.collectionColumn = page.getByRole('columnheader', { name: 'COLLECTION' });
        this.flowColumn = page.getByRole('columnheader', { name: 'FLOW' });
        this.typeColumn = page.getByRole('columnheader', { name: 'TYPE' });
        this.timeColumn = page.getByRole('columnheader', { name: 'TIME(sec)' });
        this.runsColumn = page.getByRole('columnheader', { name: 'RUNS' });
        this.statusColumn = page.getByRole('columnheader', { name: 'STATUS' });
        this.executedOnColumn = page.getByRole('columnheader', { name: 'EXECUTED ON' });
        this.viewHistoryColumn = page.getByRole('columnheader', { name: 'VIEW HISTORY' });
    }

    async switchToTablesView(): Promise<void> {
        await this.tablesTab.click();
    }

    async switchToChartsView(): Promise<void> {
        await this.chartsTab.click();
    }

    async selectTimeframe(value: string): Promise<void> {
        await this.timeframeSelect.click();
        await this.page.getByRole('option', { name: new RegExp(value, 'i') }).click();
    }

    async switchToFlowWise(): Promise<void> {
        await this.flowWiseTab.click();
    }

    async switchToStepWise(): Promise<void> {
        await this.stepWiseTab.click();
    }

    async getRowCount(): Promise<number> {
        return this.dataGridRows.count();
    }

    async clickFlowInRow(rowIndex: number): Promise<void> {
        const row = this.dataGridRows.nth(rowIndex);
        await row.locator('[data-field="title"]').click();
    }

    async getRowCellText(rowIndex: number, field: string): Promise<string> {
        const row = this.dataGridRows.nth(rowIndex);
        return (await row.locator(`[data-field="${field}"]`).textContent()) ?? '';
    }

    async clickViewHistory(rowIndex: number): Promise<void> {
        const row = this.dataGridRows.nth(rowIndex);
        await row.locator('[data-field="view_log"] button').click();
    }

    async isLoading(): Promise<boolean> {
        return this.dataGrid.locator('.MuiDataGrid-overlay').isVisible();
    }

    async isTablesViewActive(): Promise<boolean> {
        const ariaSelected = await this.tablesTab.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async isChartsViewActive(): Promise<boolean> {
        const ariaSelected = await this.chartsTab.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async isFlowWiseActive(): Promise<boolean> {
        const ariaSelected = await this.flowWiseTab.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async isStepWiseActive(): Promise<boolean> {
        const ariaSelected = await this.stepWiseTab.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }
}

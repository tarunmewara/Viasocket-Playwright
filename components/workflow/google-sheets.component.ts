import { Page, Locator } from '@playwright/test';

/**
 * Google Sheets Component
 * Handles: Google Sheets action configuration (Add New Row To Sheet)
 */
export class GoogleSheetsComponent {
    readonly page: Page;

    // Auth connection
    readonly authConnectionChip: Locator;

    // Dropdown buttons
    readonly chooseSpreadsheetButton: Locator;
    readonly chooseSheetButton: Locator;

    // Header row radio
    readonly headerRowYesRadio: Locator;

    // Column selection
    readonly selectColumnsButton: Locator;

    // Test and save buttons
    readonly dryRunTestButton: Locator;
    readonly saveButton: Locator;
    readonly inputVariablesCloseBtn: Locator;

    // Variable popover close button
    readonly variablePopoverCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.authConnectionChip = page.getByTestId('auth-connection-chip');
        this.chooseSpreadsheetButton = page.getByRole('button', { name: 'Choose SpreadSheet' });
        this.chooseSheetButton = page.getByRole('button', { name: 'Choose Sheet' });
        this.headerRowYesRadio = page.getByRole('radio', { name: 'Yes' });
        this.selectColumnsButton = page.getByRole('button', { name: 'Select Columns to Insert Data' });
        this.dryRunTestButton = page.getByTestId('dry-run-test-button');
        this.saveButton = page.getByTestId('save-button');
        this.inputVariablesCloseBtn = page.getByTestId('input-variables-close-btn');
        this.variablePopoverCloseButton = page.getByTestId('variable-popover-close-button');
    }

    async selectAuth(index: number = 2): Promise<void> {
        await this.authConnectionChip.click();
        await this.page.getByRole('option').nth(index).click();
    }

    async selectSpreadsheet(index: number = 0): Promise<void> {
        await this.chooseSpreadsheetButton.click();
        await this.page.getByRole('option').nth(index).click();
    }

    async selectSheet(index: number = 0): Promise<void> {
        await this.chooseSheetButton.click();
        await this.page.getByRole('option').nth(index).click();
    }

    async enableHeaderRow(): Promise<void> {
        await this.headerRowYesRadio.check();
    }

    async selectColumns(columns: string[]): Promise<void> {
        await this.selectColumnsButton.click();
        for (const column of columns) {
            await this.page.getByRole('option', { name: column }).getByRole('checkbox').check();
        }
    }

    async mapColumnValue(columnId: string, treeItemName: string, insertButtonName: string): Promise<void> {
        const columnName = columnId.split('--')[0];
        const textbox = this.page.getByTestId(`mentions-input-column_name.${columnName}`);
        await textbox.waitFor({ state: 'visible', timeout: 10000 });
        await textbox.click();
        const expandIcon = this.page.getByTestId(`tree-item-${treeItemName}`).locator('svg').first();
        await expandIcon.waitFor({ state: 'visible' });
        await expandIcon.click();
        const insertButton = this.page.getByTestId(`tree-item-${insertButtonName}`).getByTestId('tree-item-insert-button');
        await insertButton.waitFor({ state: 'visible' });
        await insertButton.click();
    }

    async testAndSave(): Promise<void> {
        await this.dryRunTestButton.click();
        await this.inputVariablesCloseBtn.click().catch(() => {});
        await this.saveButton.click();
    }
}

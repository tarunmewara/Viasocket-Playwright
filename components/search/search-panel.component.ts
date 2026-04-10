import { Page, Locator } from '@playwright/test';

export class SearchPanelComponent {
    readonly page: Page;

    // Header
    readonly searchHeading: Locator;
    readonly closeButton: Locator;

    // Search Input
    readonly searchInput: Locator;
    readonly shortcutChip: Locator;

    // Loading & Empty States
    readonly loadingText: Locator;
    readonly noResultsText: Locator;

    // Section Headings
    readonly flowsSectionHeading: Locator;
    readonly logsSectionHeading: Locator;

    // Results List
    readonly resultsList: Locator;
    readonly flowResultItems: Locator;
    readonly logResultItems: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header
        this.searchHeading = page.getByRole('heading', { name: 'Search', level: 5 });
        this.closeButton = page.getByTestId('search-panel-close-button');

        // Search Input
        this.searchInput = page.getByTestId('search-panel-input');
        this.shortcutChip = page.getByRole('button', { name: /Ctrl K|Cmd K/ });

        // Loading & Empty States
        this.loadingText = page.getByText('Loading...', { exact: true });
        this.noResultsText = page.getByRole('heading', { name: 'No results found', exact: true });

        // Section Headings
        this.flowsSectionHeading = page.getByRole('heading', { name: 'Flows', exact: true });
        this.logsSectionHeading = page.getByRole('heading', { name: 'Logs', exact: true });

        // Results List — use listbox role scoped to search autocomplete
        this.resultsList = page.locator('[role="listbox"]');
        this.flowResultItems = page.getByTestId('search-flow-result');
        this.logResultItems = page.getByTestId('search-log-result');
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async fillSearch(query: string): Promise<void> {
        await this.searchInput.locator('input').fill(query);
    }

    async clearSearch(): Promise<void> {
        await this.searchInput.locator('input').fill('');
    }

    async closeWithEscape(): Promise<void> {
        await this.page.keyboard.press('Escape');
    }

    async openWithKeyboard(): Promise<void> {
        const isMac = process.platform === 'darwin';
        if (isMac) {
            await this.page.keyboard.press('Meta+k');
        } else {
            await this.page.keyboard.press('Control+k');
        }
    }

    getFlowResultByName(flowName: string): Locator {
        return this.page.getByTestId('search-flow-result').filter({ hasText: flowName });
    }

    async clickFlowResult(flowName: string): Promise<void> {
        await this.page.getByTestId('search-flow-result').filter({ hasText: flowName }).click();
    }

    async clickLogResult(flowName: string): Promise<void> {
        await this.page.getByTestId('search-log-result').filter({ hasText: flowName }).click();
    }

    async clickNthResult(index: number): Promise<void> {
        await this.flowResultItems.nth(index).click();
    }

    async navigateResultsWithKeyboard(direction: 'up' | 'down'): Promise<void> {
        if (direction === 'down') {
            await this.page.keyboard.press('ArrowDown');
        } else {
            await this.page.keyboard.press('ArrowUp');
        }
    }

    async selectResultWithEnter(): Promise<void> {
        await this.page.keyboard.press('Enter');
    }

    async getResultCount(): Promise<number> {
        return this.flowResultItems.count();
    }

    async isVisible(): Promise<boolean> {
        return this.searchInput.isVisible();
    }

    async isLoading(): Promise<boolean> {
        return this.loadingText.isVisible();
    }

    async hasNoResults(): Promise<boolean> {
        return this.noResultsText.isVisible();
    }

    async hasFlowResults(): Promise<boolean> {
        return this.flowsSectionHeading.isVisible();
    }

    async hasLogResults(): Promise<boolean> {
        return this.logsSectionHeading.isVisible();
    }

    async getFlowResultStatus(flowName: string): Promise<string> {
        const row = this.page.getByTestId('search-flow-result').filter({ hasText: flowName });
        const chip = row.getByRole('status').first();
        return (await chip.textContent()) ?? '';
    }
}

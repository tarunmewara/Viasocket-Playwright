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
        this.shortcutChip = page.locator('.search-panel-container').getByRole('button', { name: /Ctrl K|Cmd K/ });

        // Loading & Empty States
        this.loadingText = page.locator('.search-panel-container').getByText('Loading...');
        this.noResultsText = page.locator('.search-panel-container').getByRole('heading', { name: 'No results found' });

        // Section Headings
        this.flowsSectionHeading = page.locator('.search-panel-container').getByRole('heading', { name: 'Flows' });
        this.logsSectionHeading = page.locator('.search-panel-container').getByRole('heading', { name: 'Logs' });

        // Results List
        this.resultsList = page.locator('.search-panel-container').getByRole('listbox');
        this.flowResultItems = page.locator('.search-panel-container li[role="option"]');
        this.logResultItems = page.locator('.search-panel-container li[role="option"]');
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
        return this.page.locator('.search-panel-container li[role="option"]').filter({ hasText: flowName });
    }

    async clickFlowResult(flowName: string): Promise<void> {
        const result = this.page.locator('.search-panel-container li[role="option"]').filter({ hasText: flowName });
        await result.click();
    }

    async clickLogResult(flowName: string): Promise<void> {
        const result = this.page.locator('.search-panel-container li[role="option"]').filter({ hasText: flowName });
        await result.click();
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
        const row = this.page.locator('.search-panel-container li[role="option"]').filter({ hasText: flowName });
        const chip = row.getByRole('status').first();
        return (await chip.textContent()) ?? '';
    }
}

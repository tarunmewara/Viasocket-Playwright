import { Page, Locator } from '@playwright/test';

/**
 * Templates Page
 * Handles: ALL TEMPLATES / MY TEMPLATES tabs, search autocomplete with app/department/industry filters,
 * sort dropdown, CREATE NEW TEMPLATE button, template cards grid, pagination
 * Reference: NewTemplateslider.tsx, TemplateCard.tsx, TemplateSearchAndFilters.tsx,
 *            TemplateSearchInputOptimized.tsx
 */
export class TemplatesPage {
    readonly page: Page;

    // --- Tabs ---
    readonly allTemplatesTab: Locator;
    readonly myTemplatesTab: Locator;

    // --- Create New Template ---
    readonly createNewTemplateButton: Locator;

    // --- Search (TemplateSearchInputOptimized.tsx) ---
    readonly searchAutocomplete: Locator;
    readonly searchInput: Locator;
    readonly searchDropdown: Locator;
    readonly showMoreDepartments: Locator;
    readonly showMoreIndustries: Locator;

    // --- Sort (TemplateSearchAndFilters.tsx) ---
    readonly sortSelect: Locator;

    // --- Template cards (TemplateCard.tsx) ---
    readonly templateCards: Locator;
    readonly templateCopyUrlButtons: Locator;

    // --- Pagination ---
    readonly pagination: Locator;

    // --- No results ---
    readonly noTemplatesFound: Locator;

    constructor(page: Page) {
        this.page = page;

        // Tabs — from NewTemplateslider.tsx
        this.allTemplatesTab = page.getByRole('tab', { name: 'All Templates' });
        this.myTemplatesTab = page.getByRole('tab', { name: 'My Templates' });

        // Create New Template button — from NewTemplateslider.tsx
        this.createNewTemplateButton = page.getByRole('button', { name: 'Create New Template' });

        // Search — from TemplateSearchInputOptimized.tsx
        this.searchAutocomplete = page.getByTestId('template-search-autocomplete');
        this.searchInput = this.searchAutocomplete.getByRole('combobox');
        this.searchDropdown = page.getByRole('listbox');
        this.showMoreDepartments = page.getByTestId('template-search-show-more-departments');
        this.showMoreIndustries = page.getByTestId('template-search-show-more-industries');

        // Sort — from TemplateSearchAndFilters.tsx
        this.sortSelect = page.getByTestId('template-sort-select');

        // Template cards — from TemplateCard.tsx
        this.templateCards = page.getByTestId('template-card-action');
        this.templateCopyUrlButtons = page.getByTestId('template-card-copy-url');

        // Pagination — from NewTemplateslider.tsx
        this.pagination = page.getByRole('navigation');

        // No results
        this.noTemplatesFound = page.getByText('No templates found');
    }

    // --- Tab switching ---

    async selectAllTemplatesTab(): Promise<void> {
        await this.allTemplatesTab.click();
    }

    async selectMyTemplatesTab(): Promise<void> {
        await this.myTemplatesTab.click();
    }

    // --- Create ---

    async clickCreateNewTemplate(): Promise<void> {
        await this.createNewTemplateButton.click();
    }

    // --- Search ---

    async searchTemplates(query: string): Promise<void> {
        await this.searchInput.fill(query);
    }

    async clearSearch(): Promise<void> {
        await this.searchInput.clear();
    }

    async selectSearchOption(optionName: string): Promise<void> {
        await this.page.getByRole('option', { name: optionName }).click();
    }

    async clickShowMoreDepartments(): Promise<void> {
        await this.showMoreDepartments.click();
    }

    async clickShowMoreIndustries(): Promise<void> {
        await this.showMoreIndustries.click();
    }

    async removeFilterChip(chipLabel: string): Promise<void> {
        await this.page.getByRole('button', { name: chipLabel }).getByTestId('CancelIcon').click();
    }

    // --- Sort ---

    async selectSort(option: 'Sort by Time' | 'Sort by Popularity' | 'Approved' | 'Rejected' | 'Pending'): Promise<void> {
        await this.sortSelect.click();
        await this.page.getByRole('option', { name: option }).click();
    }

    // --- Template cards ---

    async clickTemplateCard(index: number = 0): Promise<void> {
        await this.templateCards.nth(index).click();
    }

    async installTemplate(index: number = 0): Promise<void> {
        const card = this.templateCards.nth(index);
        await card.hover();
        await card.getByText('Install Template').click();
    }

    async clickTemplateByTitle(title: string): Promise<void> {
        await this.page.getByText(title).click();
    }

    async copyTemplateUrl(index: number = 0): Promise<void> {
        await this.templateCopyUrlButtons.nth(index).click();
    }

    async getTemplateCardCount(): Promise<number> {
        return this.templateCards.count();
    }

    // --- Pagination ---

    async goToPage(pageNumber: number): Promise<void> {
        await this.pagination.getByRole('button', { name: String(pageNumber) }).click();
    }

    async goToNextPage(): Promise<void> {
        await this.pagination.getByLabel('Go to next page').click();
    }

    async goToPreviousPage(): Promise<void> {
        await this.pagination.getByLabel('Go to previous page').click();
    }

    // --- State checks ---

    async isLoaded(): Promise<boolean> {
        return this.allTemplatesTab.isVisible();
    }

    async hasNoResults(): Promise<boolean> {
        return this.noTemplatesFound.isVisible();
    }
}

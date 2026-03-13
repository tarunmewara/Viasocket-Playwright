import { Page, Locator } from '@playwright/test';

/**
 * Templates Page
 * Handles: template search, sort, department/industry filters
 */
export class TemplatesPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // template-search-autocomplete, template-sort-select
    // template-search-show-more-departments, template-search-show-more-industries
}

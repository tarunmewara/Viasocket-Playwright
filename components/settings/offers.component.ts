import { Page, Locator } from '@playwright/test';

/**
 * Offers Component
 * Handles: promo cards, partner discount cards and actions
 */
export class OffersComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // offers-promo-card, partner-discount-app-card
    // partner-discount-save-button, partner-discount-cancel-button
    // program-field-input, program-field-submit-button, program-field-cancel-button
}

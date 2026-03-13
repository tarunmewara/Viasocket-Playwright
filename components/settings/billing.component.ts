import { Page, Locator } from '@playwright/test';

/**
 * Billing Component
 * Handles: billing edit, plan selection, offers, change plan
 */
export class BillingComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // settings-billing-edit-trigger, settings-billing-edit-button
    // settings-all-plan-button, settings-offers-discounts-button
    // settings-change-plan-button, settings-plan-cancel-button
}

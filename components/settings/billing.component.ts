import { Page, Locator } from '@playwright/test';

/**
 * Billing Component
 * Handles: billing section in settings — edit triggers, plan selection, offers, change plan
 * Reference: SettingsPanel.tsx
 */
export class BillingComponent {
    readonly page: Page;

    // Edit triggers
    readonly workspaceEditTrigger: Locator;
    readonly workspaceEditButton: Locator;
    readonly billingEditTrigger: Locator;
    readonly billingEditButton: Locator;

    // Plan buttons
    readonly allPlanButton: Locator;
    readonly offersDiscountsButton: Locator;
    readonly changePlanButton: Locator;
    readonly planCancelButton: Locator;

    // Links
    readonly pricingFaqsLink: Locator;
    readonly fairUsagePolicyLink: Locator;
    readonly termsConditionsLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from SettingsPanel.tsx
        this.workspaceEditTrigger = page.getByTestId('settings-workspace-edit-trigger');
        this.workspaceEditButton = page.getByTestId('settings-workspace-edit-button');
        this.billingEditTrigger = page.getByTestId('settings-billing-edit-trigger');
        this.billingEditButton = page.getByTestId('settings-billing-edit-button');
        this.allPlanButton = page.getByTestId('settings-all-plan-button');
        this.offersDiscountsButton = page.getByTestId('settings-offers-discounts-button');
        this.changePlanButton = page.getByTestId('settings-change-plan-button');
        this.planCancelButton = page.getByTestId('settings-plan-cancel-button');
        this.pricingFaqsLink = page.getByTestId('settings-pricing-faqs-link');
        this.fairUsagePolicyLink = page.getByTestId('settings-fair-usage-policy-link');
        this.termsConditionsLink = page.getByTestId('settings-terms-conditions-link');
    }

    async openWorkspaceSettings(): Promise<void> {
        await this.workspaceEditTrigger.click();
    }

    async openBillingSettings(): Promise<void> {
        await this.billingEditTrigger.click();
    }

    async selectAllPlans(): Promise<void> {
        await this.allPlanButton.click();
    }

    async selectOffersDiscounts(): Promise<void> {
        await this.offersDiscountsButton.click();
    }

    async changePlan(): Promise<void> {
        await this.changePlanButton.click();
    }

    async cancelPlanChange(): Promise<void> {
        await this.planCancelButton.click();
    }

    async isChangePlanVisible(): Promise<boolean> {
        return this.changePlanButton.isVisible();
    }

    async isAllPlanVisible(): Promise<boolean> {
        return this.allPlanButton.isVisible();
    }
}

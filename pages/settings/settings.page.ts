import { Page, Locator } from '@playwright/test';
import { BillingComponent } from '../../components/settings/billing.component';
import { OffersComponent } from '../../components/settings/offers.component';
import { WorkspaceSettingsComponent } from '../../components/settings/workspace-settings.component';

/**
 * Settings Page
 * Composes: BillingComponent, OffersComponent, WorkspaceSettingsComponent
 * Page-unique: headings, billing add details, All Plans section
 */
export class SettingsPage {
    readonly page: Page;

    // Composed components
    readonly billing: BillingComponent;
    readonly offers: OffersComponent;
    readonly workspaceSettings: WorkspaceSettingsComponent;

    // Page-unique locators (not in any component)
    readonly workspaceSettingHeading: Locator;
    readonly billingHeading: Locator;
    readonly planDetailsHeading: Locator;
    readonly billingAddDetailsButton: Locator;
    readonly billingCycleToggle: Locator;
    readonly getStartedButtons: Locator;

    // Payment
    readonly paymentAddCardButton: Locator;
    readonly paymentBackToCardsButton: Locator;
    readonly paymentConfirmButton: Locator;
    readonly pricingDrawerCloseButton: Locator;

    // Notification
    readonly notificationConfigureButton: Locator;
    readonly notificationEnableButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Compose from components
        this.billing = new BillingComponent(page);
        this.offers = new OffersComponent(page);
        this.workspaceSettings = new WorkspaceSettingsComponent(page);

        // Page-unique locators
        this.workspaceSettingHeading = page.getByRole('heading', { name: 'Workspace setting' });
        this.billingHeading = page.getByRole('heading', { name: 'Billing details' });
        this.planDetailsHeading = page.getByRole('heading', { name: 'Plan details' });
        this.billingAddDetailsButton = page.getByTestId('billing-add-details-button');
        this.billingCycleToggle = page.getByTestId('plans-billing-cycle-toggle');
        this.getStartedButtons = page.getByTestId('plans-get-started-button');

        // Payment — from PaymentMethodsSection.tsx
        this.paymentAddCardButton = page.getByTestId('payment-add-card-button');
        this.paymentBackToCardsButton = page.getByTestId('payment-back-to-cards-button');
        this.paymentConfirmButton = page.getByTestId('payment-confirm-button');
        this.pricingDrawerCloseButton = page.getByTestId('pricing-drawer-close-button');

        // Notification — from NotificationComponent.tsx
        this.notificationConfigureButton = page.getByTestId('notification-configure-button');
        this.notificationEnableButton = page.getByTestId('notification-enable-button');
    }

    // --- Delegated: Workspace Settings drawer ---

    async openWorkspaceEditDrawer(): Promise<void> {
        await this.billing.openWorkspaceSettings();
    }

    // --- Delegated: Billing ---

    async openBillingEditDrawer(): Promise<void> {
        await this.billing.openBillingSettings();
    }

    async clickAddBillingDetails(): Promise<void> {
        await this.billingAddDetailsButton.click();
    }

    async selectAllPlanTab(): Promise<void> {
        await this.billing.selectAllPlans();
    }

    async selectOffersDiscountsTab(): Promise<void> {
        await this.billing.selectOffersDiscounts();
    }

    async clickChangePlan(): Promise<void> {
        await this.billing.changePlan();
    }

    async cancelPlanChange(): Promise<void> {
        await this.billing.cancelPlanChange();
    }

    // --- All Plans (page-unique) ---

    async toggleBillingCycle(): Promise<void> {
        await this.billingCycleToggle.click();
    }

    async clickGetStarted(index: number = 0): Promise<void> {
        await this.getStartedButtons.nth(index).click();
    }

    async getPlanCardCount(): Promise<number> {
        return this.getStartedButtons.count();
    }

    // --- State checks ---

    async isLoaded(): Promise<boolean> {
        return this.workspaceSettingHeading.isVisible();
    }

    async isAllPlanTabActive(): Promise<boolean> {
        const variant = await this.billing.allPlanButton.getAttribute('class');
        return variant?.includes('contained') ?? false;
    }

    async isOffersTabActive(): Promise<boolean> {
        const variant = await this.billing.offersDiscountsButton.getAttribute('class');
        return variant?.includes('contained') ?? false;
    }
}

import { Page, Locator } from '@playwright/test';

/**
 * Offers Component
 * Handles: promo cards, partner discounts, carousel, program field forms
 * Reference: OffersComponent.tsx, PartenerDiscount.tsx, ProgramFieldRenderer.tsx
 */
export class OffersComponent {
    readonly page: Page;

    // Promo cards & carousel (OffersComponent.tsx)
    readonly promoCard: Locator;
    readonly redeemDiscountButton: Locator;
    readonly carouselPrevButton: Locator;
    readonly carouselNextButton: Locator;

    // Partner discount (PartenerDiscount.tsx)
    readonly partnerDiscountAppCard: Locator;
    readonly partnerDiscountSaveButton: Locator;
    readonly partnerDiscountCancelButton: Locator;

    // Program field form (ProgramFieldRenderer.tsx)
    readonly programFieldInput: Locator;
    readonly programFieldSubmitButton: Locator;
    readonly programFieldCancelButton: Locator;
    readonly programFieldKnowMoreLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from OffersComponent.tsx
        this.promoCard = page.getByTestId('offers-promo-card');
        this.redeemDiscountButton = page.getByTestId('offers-redeem-discount-button');
        this.carouselPrevButton = page.getByTestId('offers-carousel-prev-button');
        this.carouselNextButton = page.getByTestId('offers-carousel-next-button');

        // data-testid locators from PartenerDiscount.tsx
        this.partnerDiscountAppCard = page.getByTestId('partner-discount-app-card');
        this.partnerDiscountSaveButton = page.getByTestId('partner-discount-save-button');
        this.partnerDiscountCancelButton = page.getByTestId('partner-discount-cancel-button');

        // data-testid locators from ProgramFieldRenderer.tsx
        this.programFieldInput = page.getByTestId('program-field-input');
        this.programFieldSubmitButton = page.getByTestId('program-field-submit-button');
        this.programFieldCancelButton = page.getByTestId('program-field-cancel-button');
        this.programFieldKnowMoreLink = page.getByTestId('program-field-know-more-link');
    }

    // --- Promo carousel ---

    async clickPromoCard(index: number): Promise<void> {
        await this.promoCard.nth(index).click();
    }

    async redeemPartnerDiscount(): Promise<void> {
        await this.redeemDiscountButton.click();
    }

    async scrollCarouselLeft(): Promise<void> {
        await this.carouselPrevButton.click();
    }

    async scrollCarouselRight(): Promise<void> {
        await this.carouselNextButton.click();
    }

    async getPromoCardCount(): Promise<number> {
        return this.promoCard.count();
    }

    // --- Partner discount ---

    async clickPartnerApp(index: number): Promise<void> {
        await this.partnerDiscountAppCard.nth(index).click();
    }

    async savePartnerDiscount(): Promise<void> {
        await this.partnerDiscountSaveButton.click();
    }

    async cancelPartnerDiscount(): Promise<void> {
        await this.partnerDiscountCancelButton.click();
    }

    // --- Program field form ---

    async fillProgramField(index: number, value: string): Promise<void> {
        await this.programFieldInput.nth(index).locator('input, textarea').first().fill(value);
    }

    async submitProgramField(): Promise<void> {
        await this.programFieldSubmitButton.click();
    }

    async cancelProgramField(): Promise<void> {
        await this.programFieldCancelButton.click();
    }

    async isVisible(): Promise<boolean> {
        return this.redeemDiscountButton.isVisible();
    }
}

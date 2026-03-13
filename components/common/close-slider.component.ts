import { Page, Locator } from '@playwright/test';

/**
 * Close Slider Component
 * Handles: slider back, close, and next button interactions
 * Reference: closeSlidersButtonV2.tsx
 */
export class CloseSliderComponent {
    readonly page: Page;

    readonly backButton: Locator;
    readonly closeButton: Locator;
    readonly nextButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from closeSlidersButtonV2.tsx
        this.backButton = page.getByTestId('slider-back-button');
        this.closeButton = page.getByTestId('slider-close-button');
        this.nextButton = page.getByTestId('slider-next-button');
    }

    async clickBack(): Promise<void> {
        await this.backButton.click();
    }

    async clickClose(): Promise<void> {
        await this.closeButton.click();
    }

    async clickNext(): Promise<void> {
        await this.nextButton.click();
    }

    async isBackVisible(): Promise<boolean> {
        return this.backButton.isVisible();
    }

    async isCloseVisible(): Promise<boolean> {
        return this.closeButton.isVisible();
    }

    async isNextVisible(): Promise<boolean> {
        return this.nextButton.isVisible();
    }
}

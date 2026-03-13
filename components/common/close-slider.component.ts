import { Page, Locator } from '@playwright/test';

/**
 * Close Slider Component
 * Handles: slider back/close/next buttons used across multiple pages
 */
export class CloseSliderComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // slider-back-button, slider-close-button, slider-next-button
}

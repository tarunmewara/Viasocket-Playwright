import { Page, Locator } from '@playwright/test';

/**
 * Add Step Component
 * Handles: Add step slider, search, and step selection
 * Reference: AddStepSlider.tsx, AddStepSearchView.tsx
 */
export class AddStepComponent {
    readonly page: Page;

    // Add step button
    readonly addStepButton: Locator;

    // Search input
    readonly searchInput: Locator;

    // Add step slider
    readonly addStepSlider: Locator;

    // Variable popover close button
    readonly variablePopoverCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addStepButton = page.getByTestId('add-step-button');
        this.searchInput = page.getByTestId('trigger-search-input');
        this.addStepSlider = page.getByTestId('add-step-slider');
        this.variablePopoverCloseButton = page.getByTestId('variable-popover-close-button');
    }

    async clickAddStep(): Promise<void> {
        await this.addStepButton.click();
    }

    async searchStep(text: string): Promise<void> {
        await this.searchInput.fill(text);
    }

    async selectStepByName(name: string): Promise<void> {
        await this.page.getByRole('option', { name }).click();
    }

    async selectStepByText(text: string): Promise<void> {
        await this.addStepSlider.getByText(text, { exact: true }).click();
    }

    async closeVariablePopover(): Promise<void> {
        // Popover is now handled by dismissOverlays() in multipath component
        await this.page.waitForTimeout(300);
    }
}

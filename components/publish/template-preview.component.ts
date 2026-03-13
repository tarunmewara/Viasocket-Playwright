import { Page, Locator } from '@playwright/test';

/**
 * Template Preview Component
 * Handles: zoom controls, category input, instructions, update and unpublish
 * Reference: TemplatePreviewPanel.tsx
 */
export class TemplatePreviewComponent {
    readonly page: Page;

    // Zoom controls
    readonly zoomInButton: Locator;
    readonly zoomOutButton: Locator;
    readonly resetZoomButton: Locator;

    // Form fields
    readonly categoryInput: Locator;
    readonly instructionsInput: Locator;

    // Actions
    readonly updateButton: Locator;
    readonly unpublishButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from TemplatePreviewPanel.tsx
        this.zoomInButton = page.getByTestId('template-preview-zoom-in-button');
        this.zoomOutButton = page.getByTestId('template-preview-zoom-out-button');
        this.resetZoomButton = page.getByTestId('template-preview-reset-zoom-button');
        this.categoryInput = page.getByTestId('template-preview-category-input');
        this.instructionsInput = page.getByTestId('template-preview-instructions-input');
        this.updateButton = page.getByTestId('template-preview-update-button');
        this.unpublishButton = page.getByTestId('template-preview-unpublish-button');
    }

    async zoomIn(): Promise<void> {
        await this.zoomInButton.click();
    }

    async zoomOut(): Promise<void> {
        await this.zoomOutButton.click();
    }

    async resetZoom(): Promise<void> {
        await this.resetZoomButton.click();
    }

    async fillCategory(category: string): Promise<void> {
        await this.categoryInput.locator('input').fill(category);
        await this.page.getByRole('option', { name: category }).first().click();
    }

    async fillInstructions(text: string): Promise<void> {
        await this.instructionsInput.locator('textarea').first().fill(text);
    }

    async update(): Promise<void> {
        await this.updateButton.click();
    }

    async unpublish(): Promise<void> {
        await this.unpublishButton.click();
    }

    async isUpdateDisabled(): Promise<boolean> {
        return this.updateButton.isDisabled();
    }

    async isVisible(): Promise<boolean> {
        return this.updateButton.isVisible();
    }
}

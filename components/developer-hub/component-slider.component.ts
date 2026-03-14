import { Page, Locator } from '@playwright/test';

/**
 * Component Slider (Developer Hub)
 * Handles: reusable component slider — add/remove params, save, test, delete,
 * search, rename, generate, API doc link, explore guide, FAQ
 * Reference: addComponentSlider.tsx, ReusableComponentsPage.tsx
 */
export class ComponentSliderComponent {
    readonly page: Page;

    readonly addParamButton: Locator;
    readonly removeParamButton: Locator;
    readonly closeButton: Locator;
    readonly deleteButton: Locator;
    readonly saveButton: Locator;
    readonly testButton: Locator;
    readonly faqLink: Locator;
    readonly apiDocLinkInput: Locator;
    readonly createNewButton: Locator;
    readonly exploreGuideLink: Locator;
    readonly generateButton: Locator;
    readonly generateDialogCancelButton: Locator;
    readonly generateDialogSubmitButton: Locator;
    readonly renameButton: Locator;
    readonly searchInput: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addParamButton = page.getByTestId('component-slider-add-param-button');
        this.removeParamButton = page.getByTestId('component-slider-remove-param-button');
        this.closeButton = page.getByTestId('component-slider-close-button');
        this.deleteButton = page.getByTestId('component-slider-delete-button');
        this.saveButton = page.getByTestId('component-slider-save-button');
        this.testButton = page.getByTestId('component-slider-test-button');
        this.faqLink = page.getByTestId('component-slider-faq-link');
        this.apiDocLinkInput = page.getByTestId('component-api-doc-link-input');
        this.createNewButton = page.getByTestId('component-create-new-button');
        this.exploreGuideLink = page.getByTestId('component-explore-guide-link');
        this.generateButton = page.getByTestId('component-generate-button');
        this.generateDialogCancelButton = page.getByTestId('component-generate-dialog-cancel-button');
        this.generateDialogSubmitButton = page.getByTestId('component-generate-dialog-submit-button');
        this.renameButton = page.getByTestId('component-rename-button');
        this.searchInput = page.getByTestId('component-search-input');
    }

    async addParam(): Promise<void> {
        await this.addParamButton.click();
    }

    async removeParam(): Promise<void> {
        await this.removeParamButton.click();
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async save(): Promise<void> {
        await this.saveButton.click();
    }

    async test(): Promise<void> {
        await this.testButton.click();
    }

    async delete(): Promise<void> {
        await this.deleteButton.click();
    }

    async createNew(): Promise<void> {
        await this.createNewButton.click();
    }

    async generate(): Promise<void> {
        await this.generateButton.click();
    }

    async confirmGenerate(): Promise<void> {
        await this.generateDialogSubmitButton.click();
    }

    async cancelGenerate(): Promise<void> {
        await this.generateDialogCancelButton.click();
    }

    async rename(): Promise<void> {
        await this.renameButton.click();
    }

    async search(query: string): Promise<void> {
        await this.searchInput.fill(query);
    }
}

import { Page, Locator } from '@playwright/test';

/**
 * Share Flow Modal
 * Handles: share dialog — close, copy link, create template, copy template link
 * Reference: FlowShareButton.tsx
 */
export class ShareFlowModal {
    readonly page: Page;

    readonly openButton: Locator;
    readonly closeButton: Locator;
    readonly closeButton2: Locator;
    readonly cancelButton: Locator;
    readonly copyLinkButton: Locator;
    readonly createTemplateButton: Locator;
    readonly copyTemplateLinkButton: Locator;
    readonly publishDescriptionInput: Locator;
    readonly reviewAiButton: Locator;
    readonly saveButton: Locator;
    readonly versionSelect: Locator;
    readonly visibilityGroup: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from FlowShareButton.tsx
        this.openButton = page.getByTestId('share-open-button');
        this.closeButton = page.getByTestId('share-dialog-close-button');
        this.closeButton2 = page.getByTestId('share-dialog-close-button-2');
        this.cancelButton = page.getByTestId('share-cancel-button');
        this.copyLinkButton = page.getByTestId('share-copy-link-button');
        this.createTemplateButton = page.getByTestId('share-create-template-button');
        this.copyTemplateLinkButton = page.getByTestId('share-copy-template-link-button');
        this.publishDescriptionInput = page.getByTestId('share-publish-description-input');
        this.reviewAiButton = page.getByTestId('share-review-ai-button');
        this.saveButton = page.getByTestId('share-save-button');
        this.versionSelect = page.getByTestId('share-version-select');
        this.visibilityGroup = page.getByTestId('share-visibility-group');
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async copyLink(): Promise<void> {
        await this.copyLinkButton.click();
    }

    async createTemplate(): Promise<void> {
        await this.createTemplateButton.click();
    }

    async copyTemplateLink(): Promise<void> {
        await this.copyTemplateLinkButton.click();
    }

    async isVisible(): Promise<boolean> {
        return this.closeButton.isVisible();
    }
}

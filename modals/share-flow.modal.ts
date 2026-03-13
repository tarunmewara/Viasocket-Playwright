import { Page, Locator } from '@playwright/test';

/**
 * Share Flow Modal
 * Handles: share dialog — close, copy link, create template, copy template link
 * Reference: FlowShareButton.tsx
 */
export class ShareFlowModal {
    readonly page: Page;

    readonly closeButton: Locator;
    readonly copyLinkButton: Locator;
    readonly createTemplateButton: Locator;
    readonly copyTemplateLinkButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from FlowShareButton.tsx
        this.closeButton = page.getByTestId('share-dialog-close-button');
        this.copyLinkButton = page.getByTestId('share-copy-link-button');
        this.createTemplateButton = page.getByTestId('share-create-template-button');
        this.copyTemplateLinkButton = page.getByTestId('share-copy-template-link-button');
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

import { Page, Locator } from '@playwright/test';

/**
 * Publish Controls Component
 * Handles: discard changes, go live, template publish, draft/published toggle
 * Reference: PublishAndEdit.tsx
 */
export class PublishControlsComponent {
    readonly page: Page;

    readonly discardChangesButton: Locator;
    readonly goLiveButton: Locator;
    readonly templateButton: Locator;
    readonly toggleDraftPublishedButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from PublishAndEdit.tsx
        this.discardChangesButton = page.getByTestId('publish-discard-changes-button');
        this.goLiveButton = page.getByTestId('publish-go-live-button');
        this.templateButton = page.getByTestId('publish-template-button');
        this.toggleDraftPublishedButton = page.getByTestId('publish-toggle-draft-published-button');
    }

    async discardChanges(): Promise<void> {
        await this.discardChangesButton.click();
    }

    async goLive(): Promise<void> {
        await this.goLiveButton.click();
    }

    async clickTemplate(): Promise<void> {
        await this.templateButton.click();
    }

    async toggleDraftPublished(): Promise<void> {
        await this.toggleDraftPublishedButton.click();
    }

    async isGoLiveVisible(): Promise<boolean> {
        return this.goLiveButton.isVisible();
    }

    async isGoLiveDisabled(): Promise<boolean> {
        return this.goLiveButton.isDisabled();
    }

    async isDiscardVisible(): Promise<boolean> {
        return this.discardChangesButton.isVisible();
    }

    async isTemplateVisible(): Promise<boolean> {
        return this.templateButton.isVisible();
    }

    async isToggleVisible(): Promise<boolean> {
        return this.toggleDraftPublishedButton.isVisible();
    }
}

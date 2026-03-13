import { Page, Locator } from '@playwright/test';

/**
 * Collection Page
 * Handles: collection listing, selection, context menu (rename, trash, pause/active)
 * Composes: CreateCollectionModal, RenameCollectionModal
 */
export class CollectionPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods
    // Create Collection text, collection row buttons, more menu
    // Move To Trash menuitem, Rename menuitem, Pause/Active menuitem
}

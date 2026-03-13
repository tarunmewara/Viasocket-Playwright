import { Page, Locator } from '@playwright/test';
import { RenameCollectionModal } from '../../modals/rename-collection.modal';

/**
 * Collection Page
 * Composes: RenameCollectionModal
 * Handles: collection sidebar listing, "All" button, collection items with status chips,
 * context menu (Rename, Pause, Active, Move To Trash), Create Collection trigger
 * Reference: CollectionList.tsx, FunctionsActionsButton
 */
export class CollectionPage {
    readonly page: Page;

    // --- Sidebar header ---
    readonly collectionsHeading: Locator;

    // --- "All" button ---
    readonly allButton: Locator;

    // --- Collection list items ---
    readonly collectionItems: Locator;

    // --- Create Collection ---
    readonly createCollectionButton: Locator;

    // --- Context menu (FunctionsActionsButton) ---
    readonly actionsMenuTrigger: Locator;
    readonly actionsMenuItem: Locator;

    // --- Rename dialog (composed) ---
    readonly renameDialogTitle: Locator;
    readonly renameModal: RenameCollectionModal;

    constructor(page: Page) {
        this.page = page;

        // Sidebar heading — from CollectionList.tsx
        this.collectionsHeading = page.getByText('Collections');

        // "All" collection button — from CollectionList.tsx
        this.allButton = page.getByTestId('collection-all-button');

        // Collection list items — from CollectionList.tsx
        this.collectionItems = page.getByTestId('collection-list-item');

        // Create Collection — from CollectionList.tsx
        this.createCollectionButton = page.getByTestId('collection-create-button');

        // Context menu — from FunctionsActionsButton
        this.actionsMenuTrigger = page.getByTestId('actions-menu-trigger');
        this.actionsMenuItem = page.getByTestId('actions-menu-item');

        // Rename dialog (composed)
        this.renameDialogTitle = page.getByRole('heading', { name: 'Rename Collection' });
        this.renameModal = new RenameCollectionModal(page);
    }

    // --- Navigation ---

    async clickAll(): Promise<void> {
        await this.allButton.click();
    }

    async selectCollectionByName(name: string): Promise<void> {
        await this.collectionItems.filter({ hasText: name }).click();
    }

    async selectCollectionByIndex(index: number): Promise<void> {
        await this.collectionItems.nth(index).click();
    }

    // --- Create ---

    async clickCreateCollection(): Promise<void> {
        await this.createCollectionButton.click();
    }

    // --- Context menu ---

    async openContextMenu(collectionName: string): Promise<void> {
        const item = this.collectionItems.filter({ hasText: collectionName });
        await item.hover();
        await item.getByTestId('actions-menu-trigger').click();
    }

    async openContextMenuByIndex(index: number): Promise<void> {
        const item = this.collectionItems.nth(index);
        await item.hover();
        await item.getByTestId('actions-menu-trigger').click();
    }

    async clickMenuOption(option: 'Rename' | 'Pause' | 'Active' | 'Move To Trash'): Promise<void> {
        await this.actionsMenuItem.filter({ hasText: option }).click();
    }

    // --- Rename dialog ---

    async renameCollection(newName: string): Promise<void> {
        await this.renameModal.renameCollection(newName);
    }

    async cancelRename(): Promise<void> {
        await this.renameModal.cancel();
    }

    // --- Convenience: context menu shortcuts ---

    async renameCollectionByName(collectionName: string, newName: string): Promise<void> {
        await this.openContextMenu(collectionName);
        await this.clickMenuOption('Rename');
        await this.renameCollection(newName);
    }

    async pauseCollection(collectionName: string): Promise<void> {
        await this.openContextMenu(collectionName);
        await this.clickMenuOption('Pause');
    }

    async activateCollection(collectionName: string): Promise<void> {
        await this.openContextMenu(collectionName);
        await this.clickMenuOption('Active');
    }

    async trashCollection(collectionName: string): Promise<void> {
        await this.openContextMenu(collectionName);
        await this.clickMenuOption('Move To Trash');
    }

    // --- State checks ---

    async getCollectionCount(): Promise<number> {
        return this.collectionItems.count();
    }

    async isCollectionSelected(collectionName: string): Promise<boolean> {
        const item = this.collectionItems.filter({ hasText: collectionName });
        const classes = await item.getAttribute('class');
        return classes?.includes('Mui-selected') ?? false;
    }

    async getCollectionStatus(collectionName: string): Promise<string | null> {
        const item = this.collectionItems.filter({ hasText: collectionName });
        const chip = item.locator('.MuiChip-root');
        if (await chip.isVisible()) {
            return chip.textContent();
        }
        return null;
    }

    async isLoaded(): Promise<boolean> {
        return this.collectionsHeading.isVisible();
    }
}

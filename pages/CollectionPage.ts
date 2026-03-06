import { Page, Locator } from '@playwright/test';

export class CollectionPage {
    private readonly page: Page;
    private readonly createCollectionBtn: Locator;
    private readonly moveToTrashMenuItem: Locator;
    private readonly renameMenuItem: Locator;
    private readonly pauseMenuItem: Locator;
    private readonly activeMenuItem: Locator;
    private readonly nameOfCollectionInput: Locator;
    private readonly createCollectionSubmitBtn: Locator;
    private readonly renameCollectionInput: Locator;
    private readonly renameSubmitBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createCollectionBtn = page.getByText('Create Collection');
        this.moveToTrashMenuItem = page.getByRole('menuitem', { name: 'Move To Trash' });
        this.renameMenuItem = page.getByRole('menuitem', { name: 'Rename' });
        this.pauseMenuItem = page.getByRole('menuitem', { name: 'Pause' });
        this.activeMenuItem = page.getByRole('menuitem', { name: 'Active' });
        this.nameOfCollectionInput = page.getByRole('textbox', { name: 'Name of Collection' });
        this.createCollectionSubmitBtn = page.getByRole('button', { name: 'Create Collection' });
        this.renameCollectionInput = page.getByRole('textbox', { name: 'Collection Name' });
        this.renameSubmitBtn = page.getByRole('button', { name: 'RENAME' });
    }

    async clickCreateCollection(): Promise<void> {
        await this.createCollectionBtn.click();
    }

    async selectCollectionByName(collectionName: string): Promise<void> {
        const collectionRow = this.page.getByRole('button', { name: collectionName });
        await collectionRow.first().click();
    }

    async openCollectionMenu(collectionName: string): Promise<void> {
        const collectionRow = this.page.getByRole('button', { name: collectionName });
        await collectionRow.getByLabel('more').first().click();
    }

    async moveToTrash(): Promise<void> {
        await this.moveToTrashMenuItem.click();
    }

    async clickSuggestion(suggestionName: string): Promise<void> {
        await this.page.getByRole('button', { name: suggestionName }).click();
    }

    async clickFirstSuggestion(): Promise<void> {
        // Locate the dialog and then the suggestions container
        const dialog = this.page.getByRole('dialog');
        const suggestionContainer = dialog.locator('div.flex.flex-wrap');
        // Click the first button (chip) inside the container
        await suggestionContainer.getByRole('button').first().click();
    }

    async fillCollectionName(name: string): Promise<void> {
        await this.nameOfCollectionInput.fill(name);
    }

    async submitCreateCollection(): Promise<void> {
        await this.createCollectionSubmitBtn.click();
    }

    async clickRename(): Promise<void> {
        await this.renameMenuItem.click();
    }

    async fillRenameCollectionName(name: string): Promise<void> {
        await this.renameCollectionInput.fill('');
        await this.renameCollectionInput.fill(name);
    }

    async submitRename(): Promise<void> {
        await this.renameSubmitBtn.click();
    }

    async getCollectionRow(collectionName: string): Promise<Locator> {
        return this.page.getByRole('button', { name: collectionName });
    }

    async togglePauseOrActive(): Promise<void> {
        if (await this.pauseMenuItem.isVisible()) {
            await this.pauseMenuItem.click();
        } else if (await this.activeMenuItem.isVisible()) {
            await this.activeMenuItem.click();
        } else {
            throw new Error('Neither Pause nor Active option found');
        }
    }
}

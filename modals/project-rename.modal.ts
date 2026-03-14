import { Page, Locator } from '@playwright/test';

/**
 * Project Rename Modal
 * Handles: renaming projects with confirm/cancel
 * Reference: project rename component
 */
export class ProjectRenameModal {
    readonly page: Page;

    readonly input: Locator;
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.input = page.getByTestId('project-rename-input');
        this.confirmButton = page.getByTestId('project-rename-confirm-button');
        this.cancelButton = page.getByTestId('project-rename-cancel-button');
    }

    async rename(newName: string): Promise<void> {
        await this.input.fill(newName);
        await this.confirmButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }
}

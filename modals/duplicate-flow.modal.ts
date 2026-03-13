import { Page, Locator } from '@playwright/test';

/**
 * Duplicate Flow Modal
 * Handles: duplicate, move script, move project, create template, create flow, cancel
 * Reference: duplicateFlowModal.tsx
 */
export class DuplicateFlowModal {
    readonly page: Page;

    // Action buttons (contextual — only one shows at a time)
    readonly duplicateConfirmButton: Locator;
    readonly moveScriptConfirmButton: Locator;
    readonly moveProjectConfirmButton: Locator;
    readonly createTemplateConfirmButton: Locator;
    readonly createFlowConfirmButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from duplicateFlowModal.tsx
        this.duplicateConfirmButton = page.getByTestId('duplicate-flow-confirm-button');
        this.moveScriptConfirmButton = page.getByTestId('move-script-confirm-button');
        this.moveProjectConfirmButton = page.getByTestId('move-project-confirm-button');
        this.createTemplateConfirmButton = page.getByTestId('create-template-confirm-button');
        this.createFlowConfirmButton = page.getByTestId('create-flow-confirm-button');
        this.cancelButton = page.getByTestId('duplicate-flow-cancel-button');
    }

    async confirmDuplicate(): Promise<void> {
        await this.duplicateConfirmButton.click();
    }

    async confirmMoveScript(): Promise<void> {
        await this.moveScriptConfirmButton.click();
    }

    async confirmMoveProject(): Promise<void> {
        await this.moveProjectConfirmButton.click();
    }

    async confirmCreateTemplate(): Promise<void> {
        await this.createTemplateConfirmButton.click();
    }

    async confirmCreateFlow(): Promise<void> {
        await this.createFlowConfirmButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async isVisible(): Promise<boolean> {
        return this.cancelButton.isVisible();
    }
}

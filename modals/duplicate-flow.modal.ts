import { Page, Locator } from '@playwright/test';

/**
 * Duplicate Flow Modal
 * Handles: duplicate, move script, move project, create template, create flow, cancel
 */
export class DuplicateFlowModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // duplicate-flow-confirm-button, move-script-confirm-button
    // move-project-confirm-button, create-template-confirm-button
    // create-flow-confirm-button, duplicate-flow-cancel-button
}

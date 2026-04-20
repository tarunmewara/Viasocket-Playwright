import { Page, Locator } from '@playwright/test';

/**
 * AI Agent Component
 * Handles: Call AI Agent (Instant) action configuration
 */
export class AIAgentComponent {
    readonly page: Page;

    // Query input
    readonly queryInput: Locator;

    // Test and save buttons
    readonly dryRunTestButton: Locator;
    readonly saveButton: Locator;

    // Variable popover close button
    readonly variablePopoverCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.queryInput = page.getByRole('textbox', { name: 'E.g., What is AI?' });
        this.dryRunTestButton = page.getByTestId('dry-run-test-button');
        this.saveButton = page.getByTestId('save-button');
        this.variablePopoverCloseButton = page.getByTestId('variable-popover-close-button');
    }

    async fillQuery(query: string): Promise<void> {
        await this.queryInput.click();
        await this.queryInput.fill(query);
    }

    async testAndSave(): Promise<void> {
        await this.dryRunTestButton.click();
        await this.saveButton.click();
    }
}

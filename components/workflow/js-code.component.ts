import { Page, Locator } from '@playwright/test';

/**
 * JS Code Component
 * Handles: JS Code step interactions — actions menu, done button, dry-run test
 * Reference: functionsActionsButton.tsx, StepSliderFooter.tsx, dryRunButton.tsx
 */
export class JSCodeComponent {
    readonly page: Page;

    // Actions menu (functionsActionsButton.tsx)
    readonly actionsMenuTrigger: Locator;
    readonly actionsMenuItem: Locator;

    // Step slider footer (StepSliderFooter.tsx)
    readonly doneButton: Locator;

    // Dry-run (dryRunButton.tsx)
    readonly testButton: Locator;

    // Dry-run response (dryRunSlider.tsx)
    readonly expandResponse: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators
        this.actionsMenuTrigger = page.getByTestId('actions-menu-trigger');
        this.actionsMenuItem = page.getByTestId('actions-menu-item');
        this.doneButton = page.getByTestId('step-slider-done-button');
        this.testButton = page.getByTestId('dry-run-step-test-button');
        this.expandResponse = page.getByTestId('dry-run-expand-response');
    }

    async openActionsMenu(): Promise<void> {
        await this.actionsMenuTrigger.click();
    }

    async selectAction(actionText: string): Promise<void> {
        await this.openActionsMenu();
        await this.actionsMenuItem.filter({ hasText: actionText }).click();
    }

    async clickDone(): Promise<void> {
        await this.doneButton.click();
    }

    async clickTest(): Promise<void> {
        await this.testButton.click();
    }

    async expandDryRunResponse(): Promise<void> {
        await this.expandResponse.click();
    }

    async isTestVisible(): Promise<boolean> {
        return this.testButton.isVisible();
    }

    async isDoneVisible(): Promise<boolean> {
        return this.doneButton.isVisible();
    }
}

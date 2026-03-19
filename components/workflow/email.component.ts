import { Page, Locator } from '@playwright/test';

/**
 * Email Component
 * Handles: email-to-flow trigger slider locators and actions
 * Reference: emailToFlowComponent.tsx, WhenStepNameComponent.tsx
 */
export class EmailComponent {
    readonly page: Page;

    // 'Set email trigger' button (data-testid='email-set-trigger-button')
    readonly setTriggerButton: Locator;

    // Payload tab (data-testid='email-payload-tab')
    readonly payloadTab: Locator;

    // Change button in trigger slider header (data-testid='when-change-trigger-button')
    readonly changeButton: Locator;

    // Help button — Typography with text "Help" (helpButton.tsx)
    readonly helpButton: Locator;

    // Copy button (data-testid='copy-button' — CopyButton.tsx)
    readonly copyButton: Locator;

    // Note card — Alert with "Note:" text (DynamicHelpComponent)
    readonly noteCard: Locator;

    // Loader — "No Response Yet" text with LinearProgress (DataFromWebhook.tsx)
    readonly dataLoader: Locator;

    // Pre-condition button — "IF" Fab (data-testid='cron-run-if-condition-button')
    readonly preConditionButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.setTriggerButton = page.getByTestId('email-set-trigger-button');
        this.payloadTab = page.getByTestId('email-payload-tab');
        this.changeButton = page.getByTestId('when-change-trigger-button');
        this.helpButton = page.getByText('Help', { exact: true });
        this.copyButton = page.getByTestId('copy-button');
        this.noteCard = page.getByText(/Note:.*context/i);
        this.dataLoader = page.getByText('No Response Yet, Still waiting for flow execution');
        this.preConditionButton = page.getByTestId('cron-run-if-condition-button');
    }
}

import { Page, Locator } from '@playwright/test';

/**
 * Webhook Component
 * Handles: webhook configuration fields in interface config
 * Reference: SetDisplayConfig.tsx
 */
export class WebhookComponent {
    readonly page: Page;

    // Interface config webhook fields (SetDisplayConfig.tsx)
    readonly hideWebhookCheckbox: Locator;
    readonly webhookUrlInput: Locator;
    readonly webhookStepFailUrlInput: Locator;

    // Trigger webhook locators (AddStepSearchView.tsx, webhookComponent.tsx)
    // data-testid='trigger-option' is shared for all trigger types — filter by text
    readonly triggerOptionWebhook: Locator;
    // data-testid='webhook-set-button' from webhookComponent.tsx line 285
    readonly setWebhookButton: Locator;

    // Stores the webhook URL captured during the setup test so it can be reused
    static capturedWebhookUrl: string = '';

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from SetDisplayConfig.tsx
        this.hideWebhookCheckbox = page.getByTestId('config-hide-webhook-checkbox');
        this.webhookUrlInput = page.getByTestId('config-webhook-url-input');
        this.webhookStepFailUrlInput = page.getByTestId('config-webhook-step-fail-url-input');

        // Trigger webhook locators
        this.triggerOptionWebhook = page.getByTestId('trigger-option').filter({ hasText: 'When a webhook is triggered' });
        this.setWebhookButton = page.getByTestId('webhook-set-button');
    }

    async toggleHideWebhook(): Promise<void> {
        await this.hideWebhookCheckbox.click();
    }

    async fillWebhookUrl(url: string): Promise<void> {
        await this.webhookUrlInput.locator('input').fill(url);
    }

    async fillStepFailWebhookUrl(url: string): Promise<void> {
        await this.webhookStepFailUrlInput.locator('input').fill(url);
    }

    async isHideWebhookVisible(): Promise<boolean> {
        return this.hideWebhookCheckbox.isVisible();
    }

    async isWebhookUrlVisible(): Promise<boolean> {
        return this.webhookUrlInput.isVisible();
    }

    /**
     * Click the webhook trigger option in the Add Step / Select Trigger panel.
     * Uses data-testid='trigger-option' filtered by text (AddStepSearchView.tsx line 415).
     */
    async selectWebhookTrigger(): Promise<void> {
        await this.triggerOptionWebhook.click();
    }

    /**
     * Capture the webhook URL displayed on the canvas Webhook node after trigger is set.
     * The URL (e.g. https://flow.sokt.io/func/...) is rendered as visible text — no testid.
     * Stores the result in WebhookComponent.capturedWebhookUrl for reuse across tests.
     */
    async captureAndStoreWebhookUrl(): Promise<string> {
        const urlLocator = this.page.locator('a, span, p').filter({ hasText: /\/func\// }).first();
        await urlLocator.waitFor({ state: 'visible', timeout: 15000 });
        const raw = (await urlLocator.textContent())?.trim().replace(/^["']|["']$/g, '') ?? '';
        WebhookComponent.capturedWebhookUrl = raw;
        return raw;
    }

    /**
     * Click the "Set webhook" button to save the webhook trigger.
     * data-testid='webhook-set-button' from webhookComponent.tsx line 285.
     * Only visible before the trigger is saved.
     */
    async setWebhook(): Promise<void> {
        await this.setWebhookButton.click();
        await this.setWebhookButton.waitFor({ state: 'hidden', timeout: 10000 });
    }
}

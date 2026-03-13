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

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from SetDisplayConfig.tsx
        this.hideWebhookCheckbox = page.getByTestId('config-hide-webhook-checkbox');
        this.webhookUrlInput = page.getByTestId('config-webhook-url-input');
        this.webhookStepFailUrlInput = page.getByTestId('config-webhook-step-fail-url-input');
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
}

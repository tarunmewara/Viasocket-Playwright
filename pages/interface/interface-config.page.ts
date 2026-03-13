import { Page, Locator } from '@playwright/test';

/**
 * Interface Config Page
 * Handles: embed/interface display configuration (toggles, text fields, webhooks, layout)
 */
export class InterfaceConfigPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // config-show-preview-button, config-show-enabled-checkbox
    // config-show-templates-checkbox, config-templates-heading-input
    // config-hide-apps-checkbox, config-hide-advanced-flow-checkbox
    // config-show-ask-ai-checkbox, config-hide-function-checkbox
    // config-hide-api-checkbox, config-hide-webhook-checkbox
    // config-chatbot-checkbox, config-is-mcp-checkbox
    // config-llm-referring-text-input, config-custom-title-input
    // config-custom-subtitle-input, config-help-doc-link-input
    // config-help-doc-title-input, config-display-position-group
    // config-height-unit-select, config-width-unit-select
    // config-webhook-url-input, config-webhook-step-fail-url-input
    // embed-config-save-changes-button
}

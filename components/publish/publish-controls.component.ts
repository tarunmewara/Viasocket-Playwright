import { Page, Locator } from '@playwright/test';

/**
 * Publish Controls Component
 * Handles: discard changes, go live, publish template, toggle draft/published
 */
export class PublishControlsComponent {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // publish-discard-changes-button, publish-go-live-button
    // publish-template-button, publish-toggle-draft-published-button
    // warning-panel-publish-button, alert-publish-close-button
}

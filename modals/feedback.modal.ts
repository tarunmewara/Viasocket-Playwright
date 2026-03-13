import { Page, Locator } from '@playwright/test';

/**
 * Feedback Modal
 * Handles: feedback type selection (idea/issue), text input, submit, close
 */
export class FeedbackModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // feedback-modal-close-button, feedback-type-idea, feedback-type-issue
    // feedback-text-input, feedback-submit-button
}

import { Page, Locator } from '@playwright/test';

/**
 * Feedback Modal
 * Handles: post-publish feedback — type selection (idea/issue), text input, submit, close
 * Reference: PublishFeedbackModal.tsx
 */
export class FeedbackModal {
    readonly page: Page;

    readonly closeButton: Locator;
    readonly ideaToggle: Locator;
    readonly issueToggle: Locator;
    readonly textInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from PublishFeedbackModal.tsx
        this.closeButton = page.getByTestId('feedback-modal-close-button');
        this.ideaToggle = page.getByTestId('feedback-type-idea');
        this.issueToggle = page.getByTestId('feedback-type-issue');
        this.textInput = page.getByTestId('feedback-text-input');
        this.submitButton = page.getByTestId('feedback-submit-button');
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async selectIdea(): Promise<void> {
        await this.ideaToggle.click();
    }

    async selectIssue(): Promise<void> {
        await this.issueToggle.click();
    }

    async fillFeedback(text: string): Promise<void> {
        await this.textInput.locator('textarea').first().fill(text);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async submitIdea(text: string): Promise<void> {
        await this.selectIdea();
        await this.fillFeedback(text);
        await this.submit();
    }

    async submitIssue(text: string): Promise<void> {
        await this.selectIssue();
        await this.fillFeedback(text);
        await this.submit();
    }

    async isVisible(): Promise<boolean> {
        return this.submitButton.isVisible();
    }

    async isSubmitDisabled(): Promise<boolean> {
        return this.submitButton.isDisabled();
    }
}

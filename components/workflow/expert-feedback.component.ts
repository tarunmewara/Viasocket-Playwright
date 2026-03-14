import { Page, Locator } from '@playwright/test';

/**
 * Expert Feedback Component
 * Handles: expert support, feedback thumbs up/down, comment submission
 * Reference: AssignExpertFeedback.tsx, AssignToExpert components
 */
export class ExpertFeedbackComponent {
    readonly page: Page;

    readonly createNewRequestButton: Locator;
    readonly closeButton: Locator;
    readonly commentInput: Locator;
    readonly submitButton: Locator;
    readonly thumbsDownButton: Locator;
    readonly thumbsUpButton: Locator;
    readonly supportButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.createNewRequestButton = page.getByTestId('expert-create-new-request-button');
        this.closeButton = page.getByTestId('expert-feedback-close-button');
        this.commentInput = page.getByTestId('expert-feedback-comment-input');
        this.submitButton = page.getByTestId('expert-feedback-submit-button');
        this.thumbsDownButton = page.getByTestId('expert-feedback-thumbs-down');
        this.thumbsUpButton = page.getByTestId('expert-feedback-thumbs-up');
        this.supportButton = page.getByTestId('expert-support-button');
    }

    async createNewRequest(): Promise<void> {
        await this.createNewRequestButton.click();
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async fillComment(text: string): Promise<void> {
        await this.commentInput.fill(text);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async thumbsUp(): Promise<void> {
        await this.thumbsUpButton.click();
    }

    async thumbsDown(): Promise<void> {
        await this.thumbsDownButton.click();
    }
}

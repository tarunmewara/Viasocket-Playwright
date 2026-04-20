import { Page, Locator } from '@playwright/test';

/**
 * Gmail Component
 * Handles: Gmail action configuration (Send Email With Attachments)
 */
export class GmailComponent {
    readonly page: Page;

    // Auth connection
    readonly authConnectionChip: Locator;

    // Email fields
    readonly toInput: Locator;
    readonly subjectInput: Locator;
    readonly messageBodyInput: Locator;

    // Message type dropdown
    readonly messageTypeButton: Locator;

    // Test and save buttons
    readonly dryRunTestButton: Locator;
    readonly saveButton: Locator;

    // Variable popover close button
    readonly variablePopoverCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.authConnectionChip = page.getByTestId('auth-connection-chip');
        this.toInput = page.getByRole('textbox', { name: 'E.g. recipient@example.com' });
        this.subjectInput = page.getByRole('textbox', { name: 'E.g. Subject of your email' });
        this.messageBodyInput = page.getByRole('textbox', { name: 'E.g. Write your email message' });
        this.messageTypeButton = page.getByRole('button', { name: 'Choose Message Type' });
        this.dryRunTestButton = page.getByTestId('dry-run-test-button');
        this.saveButton = page.getByTestId('save-button');
        this.variablePopoverCloseButton = page.getByTestId('variable-popover-close-button');
    }

    async selectAuth(index: number = 2): Promise<void> {
        await this.authConnectionChip.click();
        await this.page.getByRole('option').nth(index).click();
    }

    async fillTo(email: string): Promise<void> {
        await this.toInput.click();
        await this.toInput.fill(email);
    }

    async fillSubject(subject: string): Promise<void> {
        await this.subjectInput.click();
        await this.subjectInput.fill(subject);
    }

    async selectMessageType(type: string): Promise<void> {
        await this.messageTypeButton.click();
        await this.page.getByRole('option', { name: type }).click();
    }

    async fillMessageBody(message: string): Promise<void> {
        await this.messageBodyInput.click();
        await this.messageBodyInput.fill(message);
    }

    async testAndSave(): Promise<void> {
        await this.dryRunTestButton.click();
        await this.saveButton.click();
    }
}

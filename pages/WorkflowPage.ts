import { Page, Locator } from '@playwright/test';

export class WorkflowPage {
    private readonly page: Page;
    private readonly selectEventText: Locator;
    private readonly jsCodeActionBtn: Locator;
    private readonly codeSubActionBtn: Locator;
    private readonly codeEditorTextbox: Locator;
    private readonly testSaveGroup: Locator;
    private readonly testBtn: Locator;
    private readonly saveBtn: Locator;
    private readonly goLiveBtn: Locator;
    private readonly yesBtn: Locator;
    private readonly provideFeedbackBtn: Locator;
    private readonly feedbackTextbox: Locator;
    private readonly submitIdeaBtn: Locator;
    private readonly closeBtn: Locator;
    private readonly pauseWorkflowBtn: Locator;
    private readonly pauseTextBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.selectEventText = page.getByText('Select the event for your');
        this.jsCodeActionBtn = page.getByRole('option', { name: 'JS Code', exact: true });
        this.codeSubActionBtn = page.getByRole('button', { name: 'Code' });
        // Scope to the tightest container that holds both the "Code" heading button and the textbox itself
        this.codeEditorTextbox = page.locator('div')
            .filter({ has: page.getByRole('button', { name: 'Code', exact: true }) })
            .filter({ has: page.getByRole('textbox') })
            .last()
            .getByRole('textbox');
        this.testSaveGroup = page.getByText('TestSave');
        this.testBtn = page.getByRole('button', { name: 'Test' });
        this.saveBtn = page.getByRole('button', { name: 'Save' });
        this.goLiveBtn = page.getByRole('button', { name: 'Go live' });
        this.yesBtn = page.getByRole('button', { name: 'Yes' });
        this.provideFeedbackBtn = page.getByRole('button', { name: 'Provide Feedback' });
        this.feedbackTextbox = page.getByRole('textbox', { name: 'Your feedback helps us build' });
        this.submitIdeaBtn = page.getByRole('button', { name: 'Submit Idea' });
        this.closeBtn = page.getByRole('button', { name: 'Close' });
        this.pauseWorkflowBtn = page.locator('button').nth(3);
        this.pauseTextBtn = page.getByText('Pause');
    }

    async selectActionEvent(): Promise<void> {
        await this.selectEventText.click();
    }

    async selectJSCodeAction(): Promise<void> {
        await this.jsCodeActionBtn.click();
    }

    async selectCodeSubAction(): Promise<void> {
        await this.codeSubActionBtn.click();
    }

    async fillCodeEditor(code: string): Promise<void> {
        await this.codeEditorTextbox.click();
        await this.codeEditorTextbox.fill(code);
    }

    async clickTestSaveGroup(): Promise<void> {
        await this.testSaveGroup.click();
    }

    async clickTest(): Promise<void> {
        await this.testBtn.click();
    }

    async clickSave(): Promise<void> {
        await this.saveBtn.click();
    }

    async clickGoLive(): Promise<void> {
        await this.goLiveBtn.click();
    }

    async confirmGoLiveYes(): Promise<void> {
        await this.yesBtn.click();
    }

    async clickProvideFeedback(): Promise<void> {
        await this.provideFeedbackBtn.click();
    }

    async fillFeedback(text: string): Promise<void> {
        await this.feedbackTextbox.fill(text);
    }

    async submitIdea(): Promise<void> {
        await this.submitIdeaBtn.click();
    }

    async clickClose(): Promise<void> {
        await this.closeBtn.click();
    }

    async pauseWorkflow(): Promise<void> {
        await this.pauseWorkflowBtn.click();
        await this.pauseTextBtn.click();
    }
}

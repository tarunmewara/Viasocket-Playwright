import { Page, Locator } from '@playwright/test';
import { PublishControlsComponent } from '../../components/publish/publish-controls.component';
import { GoLiveConfirmModal } from '../../modals/go-live-confirm.modal';
import { FeedbackModal } from '../../modals/feedback.modal';
import { JSCodeComponent } from '../../components/workflow/js-code.component';

/**
 * Workflow Page
 * Composes: PublishControlsComponent, GoLiveConfirmModal, FeedbackModal, JSCodeComponent
 * Page-unique: flow title, pause/active toggle
 */
export class WorkflowPage {
    readonly page: Page;

    // Composed components / modals
    readonly publish: PublishControlsComponent;
    readonly goLiveConfirm: GoLiveConfirmModal;
    readonly feedback: FeedbackModal;
    readonly jscode: JSCodeComponent;

    // Page-unique locators
    readonly flowTitleInput: Locator;
    readonly pauseActiveToggle: Locator;

    // Dry run / test
    readonly dryRunTestButton: Locator;
    readonly dryRunTestFlowButton: Locator;
    readonly dryRunSkipDelayToggle: Locator;
    readonly dryRunExpandResponse: Locator;
    readonly dryRunStepTestButton: Locator;

    // Debug
    readonly debugByAiPerformButton: Locator;

    // Function slider
    readonly functionSliderTestButton: Locator;
    readonly functionSliderAiOptimizeButton: Locator;
    readonly functionSliderTestTransferButton: Locator;

    // Event / step
    readonly eventActionCard: Locator;
    readonly eventNextButton: Locator;
    readonly singleStepConfigureButton: Locator;

    // Warning / publish
    readonly warningPanelPublishButton: Locator;

    // JSON editor
    readonly jsonEditorChatgptLink: Locator;
    readonly jsonEditorExampleJsonLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Compose from components/modals
        this.publish = new PublishControlsComponent(page);
        this.goLiveConfirm = new GoLiveConfirmModal(page);
        this.feedback = new FeedbackModal(page);
        this.jscode = new JSCodeComponent(page);

        // Page-unique locators
        this.flowTitleInput = page.getByTestId('flow-title-input');
        this.pauseActiveToggle = page.getByTestId('flow-pause-active-toggle');

        // Dry run / test
        this.dryRunTestButton = page.getByTestId('dry-run-test-button');
        this.dryRunTestFlowButton = page.getByTestId('dry-run-test-flow-button');
        this.dryRunSkipDelayToggle = page.getByTestId('dry-run-skip-delay-toggle');
        this.dryRunExpandResponse = page.getByTestId('dry-run-expand-response');
        this.dryRunStepTestButton = page.getByTestId('dry-run-step-test-button');

        // Debug
        this.debugByAiPerformButton = page.getByTestId('debug-by-ai-perform-button');

        // Function slider
        this.functionSliderTestButton = page.getByTestId('function-slider-test-button');
        this.functionSliderAiOptimizeButton = page.getByTestId('function-slider-ai-optimize-button');
        this.functionSliderTestTransferButton = page.getByTestId('function-slider-test-transfer-button');

        // Event / step
        this.eventActionCard = page.getByTestId('event-action-card');
        this.eventNextButton = page.getByTestId('event-next-button');
        this.singleStepConfigureButton = page.getByTestId('single-step-configure-button');

        // Warning / publish
        this.warningPanelPublishButton = page.getByTestId('warning-panel-publish-button');

        // JSON editor
        this.jsonEditorChatgptLink = page.getByTestId('json-editor-chatgpt-link');
        this.jsonEditorExampleJsonLink = page.getByTestId('json-editor-example-json-link');
    }

    // --- Publish ---

    async clickGoLive(): Promise<void> {
        await this.publish.goLive();
    }

    async confirmGoLive(): Promise<void> {
        await this.goLiveConfirm.confirm();
    }

    async cancelGoLive(): Promise<void> {
        await this.goLiveConfirm.cancel();
    }

    async discardChanges(): Promise<void> {
        await this.publish.discardChanges();
    }

    async toggleDraftPublished(): Promise<void> {
        await this.publish.toggleDraftPublished();
    }

    // --- Feedback ---

    async submitFeedbackIdea(text: string): Promise<void> {
        await this.feedback.submitIdea(text);
    }

    async closeFeedback(): Promise<void> {
        await this.feedback.close();
    }

    // --- Step actions ---

    async openActionsMenu(): Promise<void> {
        await this.jscode.openActionsMenu();
    }

    async selectAction(actionText: string): Promise<void> {
        await this.jscode.selectAction(actionText);
    }

    async clickTest(): Promise<void> {
        await this.jscode.clickTest();
    }

    async clickDone(): Promise<void> {
        await this.jscode.clickDone();
    }

    // --- Flow title ---

    async setFlowTitle(title: string): Promise<void> {
        await this.flowTitleInput.locator('input').fill(title);
    }

    // --- Pause/Active ---

    async togglePauseActive(): Promise<void> {
        await this.pauseActiveToggle.click();
    }

    // --- State checks ---

    async isGoLiveVisible(): Promise<boolean> {
        return this.publish.isGoLiveVisible();
    }

    async isGoLiveDisabled(): Promise<boolean> {
        return this.publish.isGoLiveDisabled();
    }

    async isTestVisible(): Promise<boolean> {
        return this.jscode.isTestVisible();
    }
}

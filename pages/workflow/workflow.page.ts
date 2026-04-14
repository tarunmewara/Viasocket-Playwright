import { Page, Locator } from '@playwright/test';
import { PublishControlsComponent } from '../../components/publish/publish-controls.component';
import { GoLiveConfirmModal } from '../../modals/go-live-confirm.modal';
import { FeedbackModal } from '../../modals/feedback.modal';
import { JSCodeComponent } from '../../components/workflow/js-code.component';
import { HttpApiRequestComponent } from '../../components/workflow/http-api-request.component';
import { AskAIModal } from '../../modals/ask-ai.modal';
import { MultipathComponent } from '../../components/workflow/multipath.component';
import { DelayComponent } from '../../components/workflow/delay.component';
import { ThreeDotsMenuComponent } from '../../components/workflow/three-dots-menu.component';
import { AddStepComponent } from '../../components/workflow/add-step.component';
import { GmailComponent } from '../../components/workflow/gmail.component';
import { GoogleSheetsComponent } from '../../components/workflow/google-sheets.component';
import { AIAgentComponent } from '../../components/workflow/ai-agent.component';

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
    readonly httpApi: HttpApiRequestComponent;
    readonly askAI: AskAIModal;
    readonly multipath: MultipathComponent;
    readonly delay: DelayComponent;
    readonly threeDotsMenu: ThreeDotsMenuComponent;
    readonly addStep: AddStepComponent;
    readonly gmail: GmailComponent;
    readonly googleSheets: GoogleSheetsComponent;
    readonly aiAgent: AIAgentComponent;

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

    // Canvas elements (new flow / before trigger selected)
    readonly selectTriggerPrompt: Locator;      // SelectTrigger.tsx — data-testid='select-trigger-prompt'
    readonly goalStickyNote: Locator;           // FlowDescriptionStickyNote.tsx — data-testid='goal-sticky-note'

    // ZoomableFlowComponent.tsx elements
    readonly flowCanvasWrapper: Locator;        // data-testid='flow-canvas-wrapper'
    readonly flowCanvas: Locator;               // data-testid='flow-canvas'
    readonly flowZoomContainer: Locator;        // data-testid='flow-zoom-container'
    readonly flowControlsContainer: Locator;   // data-testid='flow-controls-container'
    readonly askAIButton: Locator;              // data-testid='ask-ai-button'
    readonly zoomControls: Locator;             // data-testid='zoom-controls' (ButtonGroup)
    readonly zoomFitButton: Locator;            // data-testid='zoom-fit-button'
    readonly zoomInButton: Locator;             // data-testid='zoom-in-button'
    readonly zoomOutButton: Locator;            // data-testid='zoom-out-button'

    // Step header — data-testid='step-change-button' (stepNameComponentV2.tsx)
    readonly stepChangeButton: Locator;

    // Change button in cron/trigger slider header (WhenStepNameComponent.tsx)
    readonly cronChangeButton: Locator;     // data-testid='when-change-trigger-button'

    // Webhook slider — Set webhook button (webhookComponent.tsx — data-testid='webhook-set-button')
    readonly setWebhookButton: Locator;

    // Trigger step nodes on canvas
    // CronComponent.tsx inFlow StepNode  → data-testid='inflow-node-cron'
    // InflowDisplayComponent.tsx StepNode → data-testid='inflow-node-{slugName}'
    readonly inflowCronNode: Locator;       // inflow-node-cron
    readonly inflowWebhookNode: Locator;    // inflow-node-webhook
    readonly inflowEmailNode: Locator;      // inflow-node-email
    readonly inflowTriggerNode: Locator;    // inflow-node-trigger (for plugin triggers)

    // Flow more options menu (flowPageMoreOptions.tsx)
    readonly flowMoreOptionsButton: Locator;    // data-testid='flow-more-options-button'
    readonly flowDeleteConfirmButton: Locator;  // data-testid='flow-delete-confirm-button'
    readonly flowDeleteCancelButton: Locator;   // data-testid='flow-delete-cancel-button'

    // Flow header buttons (flowJsonHeader.tsx)
    readonly flowHeaderRunIfButton: Locator;    // data-testid='flow-header-run-if-button'
    readonly saveButton: Locator;               // data-testid='save-button'

    // Advance config switches (webhookAndCronAdvanceConfigSlider.tsx, preCondition.tsx)
    readonly hitFlowIndividuallySwitch: Locator;  // data-testid='hit-flow-individually-switch'
    readonly preConditionSwitch: Locator;         // data-testid='pre-condition-switch'

    constructor(page: Page) {
        this.page = page;

        // Compose from components/modals
        this.publish = new PublishControlsComponent(page);
        this.goLiveConfirm = new GoLiveConfirmModal(page);
        this.feedback = new FeedbackModal(page);
        this.jscode = new JSCodeComponent(page);
        this.httpApi = new HttpApiRequestComponent(page);
        this.askAI = new AskAIModal(page);
        this.multipath = new MultipathComponent(page);
        this.delay = new DelayComponent(page);
        this.threeDotsMenu = new ThreeDotsMenuComponent(page);
        this.addStep = new AddStepComponent(page);
        this.gmail = new GmailComponent(page);
        this.googleSheets = new GoogleSheetsComponent(page);
        this.aiAgent = new AIAgentComponent(page);

        // Page-unique locators
        this.flowTitleInput = page.locator('#flow-title-textfield');
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

        // Canvas elements — data-testid locators
        this.selectTriggerPrompt = page.getByTestId('select-trigger-prompt');
        this.goalStickyNote = page.getByTestId('goal-sticky-note');

        // ZoomableFlowComponent locators
        this.flowCanvasWrapper = page.getByTestId('flow-canvas-wrapper');
        this.flowCanvas = page.getByTestId('flow-canvas');
        this.flowZoomContainer = page.getByTestId('flow-zoom-container');
        this.flowControlsContainer = page.getByTestId('flow-controls-container');
        this.askAIButton = page.getByTestId('ask-ai-button');
        this.zoomControls = page.getByTestId('zoom-controls');
        this.zoomFitButton = page.getByTestId('zoom-fit-button');
        this.zoomInButton = page.getByTestId('zoom-in-button');
        this.zoomOutButton = page.getByTestId('zoom-out-button');

        // Step header
        this.stepChangeButton = page.getByTestId('step-change-button');

        // Cron slider Change button
        this.cronChangeButton = page.getByTestId('when-change-trigger-button');

        // Webhook slider Set webhook button (data-testid='webhook-set-button' in webhookComponent.tsx)
        this.setWebhookButton = page.getByTestId('webhook-set-button');

        // Trigger step nodes on canvas
        this.inflowCronNode = page.getByTestId('inflow-node-cron');
        this.inflowWebhookNode = page.getByTestId('inflow-node-webhook');
        this.inflowEmailNode = page.getByTestId('inflow-node-email');
        this.inflowTriggerNode = page.getByTestId('inflow-node-trigger');

        // Flow more options menu
        this.flowMoreOptionsButton = page.getByTestId('flow-more-options-button');
        this.flowDeleteConfirmButton = page.getByTestId('flow-delete-confirm-button');
        this.flowDeleteCancelButton = page.getByTestId('flow-delete-cancel-button');

        // Flow header buttons
        this.flowHeaderRunIfButton = page.getByTestId('flow-header-run-if-button');
        this.saveButton = page.getByTestId('save-button');

        // Advance config switches
        this.hitFlowIndividuallySwitch = page.getByTestId('hit-flow-individually-switch');
        this.preConditionSwitch = page.getByTestId('pre-condition-switch');
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

    // --- Trigger / Step cards ---

    async clickTriggerCard(): Promise<void> {
        await this.eventActionCard.click();
    }

    async clickSingleStepConfigure(): Promise<void> {
        await this.singleStepConfigureButton.click();
    }

    async clickTriggerChangeButton(): Promise<void> {
        await this.cronChangeButton.click();
    }

    async confirmWebhookTrigger(): Promise<void> {
        await this.setWebhookButton.click();
    }

    // --- Flow title ---

    async setFlowTitle(title: string): Promise<void> {
        await this.flowTitleInput.fill(title);
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

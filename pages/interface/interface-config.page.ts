import { Page, Locator } from '@playwright/test';
import { WebhookComponent } from '../../components/workflow/webhook.component';

/**
 * Interface Config Page
 * Handles: embed/interface display configuration — display option checkboxes,
 * custom title/subtitle, help document, whitelist domains, display position,
 * dimensions, webhook URLs, preview drawer, save changes
 * Reference: SetDisplayConfig.tsx, EmbedConfigurationSaveChangesButton.tsx
 */
export class InterfaceConfigPage {
    readonly page: Page;

    // --- Header ---
    readonly configurationHeading: Locator;
    readonly showPreviewButton: Locator;

    // --- Display Options (checkboxes) ---
    readonly showEnabledCheckbox: Locator;
    readonly showTemplatesCheckbox: Locator;
    readonly templatesHeadingInput: Locator;
    readonly hideAppsCheckbox: Locator;
    readonly hideAdvancedFlowCheckbox: Locator;
    readonly showAskAiCheckbox: Locator;
    readonly hideFunctionCheckbox: Locator;
    readonly hideApiCheckbox: Locator;
    readonly chatbotCheckbox: Locator;
    readonly isMcpCheckbox: Locator;
    readonly llmReferringTextInput: Locator;

    // --- Customization ---
    readonly customTitleInput: Locator;
    readonly customSubtitleInput: Locator;

    // --- Help Document ---
    readonly helpDocLinkInput: Locator;
    readonly helpDocTitleInput: Locator;

    // --- Display Position ---
    readonly displayPositionGroup: Locator;

    // --- Dimensions ---
    readonly heightUnitSelect: Locator;
    readonly widthUnitSelect: Locator;

    // --- Webhooks (composed) ---
    readonly webhook: WebhookComponent;

    // --- Preview Drawer ---
    readonly previewCloseButton: Locator;

    // --- Interface filters ---
    readonly interfaceFilterCategoryCheckbox: Locator;
    readonly interfacePluginEventCheckbox: Locator;
    readonly interfaceServiceBox: Locator;

    // --- Save ---
    readonly saveChangesButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header — from SetDisplayConfig.tsx
        this.configurationHeading = page.getByRole('heading', { name: 'Configuration' });
        this.showPreviewButton = page.getByTestId('config-show-preview-button');

        // Display Options checkboxes — from SetDisplayConfig.tsx
        this.showEnabledCheckbox = page.getByTestId('config-show-enabled-checkbox');
        this.showTemplatesCheckbox = page.getByTestId('config-show-templates-checkbox');
        this.templatesHeadingInput = page.getByTestId('config-templates-heading-input');
        this.hideAppsCheckbox = page.getByTestId('config-hide-apps-checkbox');
        this.hideAdvancedFlowCheckbox = page.getByTestId('config-hide-advanced-flow-checkbox');
        this.showAskAiCheckbox = page.getByTestId('config-show-ask-ai-checkbox');
        this.hideFunctionCheckbox = page.getByTestId('config-hide-function-checkbox');
        this.hideApiCheckbox = page.getByTestId('config-hide-api-checkbox');
        this.chatbotCheckbox = page.getByTestId('config-chatbot-checkbox');
        this.isMcpCheckbox = page.getByTestId('config-is-mcp-checkbox');
        this.llmReferringTextInput = page.getByTestId('config-llm-referring-text-input');

        // Customization — from SetDisplayConfig.tsx
        this.customTitleInput = page.getByTestId('config-custom-title-input');
        this.customSubtitleInput = page.getByTestId('config-custom-subtitle-input');

        // Help Document — from SetDisplayConfig.tsx
        this.helpDocLinkInput = page.getByTestId('config-help-doc-link-input');
        this.helpDocTitleInput = page.getByTestId('config-help-doc-title-input');

        // Display Position — from SetDisplayConfig.tsx
        this.displayPositionGroup = page.getByTestId('config-display-position-group');

        // Dimensions — from SetDisplayConfig.tsx
        this.heightUnitSelect = page.getByTestId('config-height-unit-select');
        this.widthUnitSelect = page.getByTestId('config-width-unit-select');

        // Webhooks (composed)
        this.webhook = new WebhookComponent(page);

        // Preview Drawer — from SetDisplayConfig.tsx
        this.previewCloseButton = page.getByTestId('config-preview-close-button');

        // Interface filters — from SetDisplayConfig.tsx
        this.interfaceFilterCategoryCheckbox = page.getByTestId('interface-filter-category-checkbox');
        this.interfacePluginEventCheckbox = page.getByTestId('interface-plugin-event-checkbox');
        this.interfaceServiceBox = page.getByTestId('interface-service-box');

        // Save — from EmbedConfigurationSaveChangesButton.tsx
        this.saveChangesButton = page.getByTestId('embed-save-changes-button');
    }

    // --- Preview ---

    async openPreview(): Promise<void> {
        await this.showPreviewButton.click();
    }

    async closePreview(): Promise<void> {
        await this.previewCloseButton.click();
    }

    // --- Display Options toggles ---

    async toggleShowEnabled(checked: boolean): Promise<void> {
        const isChecked = await this.showEnabledCheckbox.isChecked();
        if (isChecked !== checked) await this.showEnabledCheckbox.click();
    }

    async toggleShowTemplates(checked: boolean): Promise<void> {
        const isChecked = await this.showTemplatesCheckbox.isChecked();
        if (isChecked !== checked) await this.showTemplatesCheckbox.click();
    }

    async fillTemplatesHeading(heading: string): Promise<void> {
        await this.templatesHeadingInput.locator('input').fill(heading);
        await this.templatesHeadingInput.locator('input').blur();
    }

    async toggleHideApps(checked: boolean): Promise<void> {
        const isChecked = await this.hideAppsCheckbox.isChecked();
        if (isChecked !== checked) await this.hideAppsCheckbox.click();
    }

    async toggleHideAdvancedFlow(checked: boolean): Promise<void> {
        const isChecked = await this.hideAdvancedFlowCheckbox.isChecked();
        if (isChecked !== checked) await this.hideAdvancedFlowCheckbox.click();
    }

    async toggleShowAskAi(checked: boolean): Promise<void> {
        const isChecked = await this.showAskAiCheckbox.isChecked();
        if (isChecked !== checked) await this.showAskAiCheckbox.click();
    }

    async toggleHideFunction(checked: boolean): Promise<void> {
        const isChecked = await this.hideFunctionCheckbox.isChecked();
        if (isChecked !== checked) await this.hideFunctionCheckbox.click();
    }

    async toggleHideApi(checked: boolean): Promise<void> {
        const isChecked = await this.hideApiCheckbox.isChecked();
        if (isChecked !== checked) await this.hideApiCheckbox.click();
    }

    async toggleHideWebhook(checked: boolean): Promise<void> {
        const isChecked = await this.webhook.hideWebhookCheckbox.isChecked();
        if (isChecked !== checked) await this.webhook.toggleHideWebhook();
    }

    async toggleChatbot(checked: boolean): Promise<void> {
        const isChecked = await this.chatbotCheckbox.isChecked();
        if (isChecked !== checked) await this.chatbotCheckbox.click();
    }

    async toggleIsMcp(checked: boolean): Promise<void> {
        const isChecked = await this.isMcpCheckbox.isChecked();
        if (isChecked !== checked) await this.isMcpCheckbox.click();
    }

    async fillLlmReferringText(text: string): Promise<void> {
        await this.llmReferringTextInput.locator('input').fill(text);
        await this.llmReferringTextInput.locator('input').blur();
    }

    // --- Customization ---

    async fillCustomTitle(title: string): Promise<void> {
        await this.customTitleInput.locator('input').fill(title);
        await this.customTitleInput.locator('input').blur();
    }

    async fillCustomSubtitle(subtitle: string): Promise<void> {
        await this.customSubtitleInput.locator('textarea').first().fill(subtitle);
        await this.customSubtitleInput.locator('textarea').first().blur();
    }

    // --- Help Document ---

    async fillHelpDocLink(url: string): Promise<void> {
        await this.helpDocLinkInput.locator('input').fill(url);
        await this.helpDocLinkInput.locator('input').blur();
    }

    async fillHelpDocTitle(title: string): Promise<void> {
        await this.helpDocTitleInput.locator('input').fill(title);
        await this.helpDocTitleInput.locator('input').blur();
    }

    // --- Display Position ---

    async selectDisplayPosition(
        position: 'all_space' | 'left_slider' | 'right_slider' | 'popover' | 'popup'
    ): Promise<void> {
        await this.displayPositionGroup.getByRole('radio', { name: this.getPositionLabel(position) }).click();
    }

    private getPositionLabel(position: string): string {
        const labels: Record<string, string> = {
            all_space: 'All Available space',
            left_slider: 'Left slider',
            right_slider: 'Right slider',
            popover: 'Pop over',
            popup: 'Popup',
        };
        return labels[position] || position;
    }

    // --- Dimensions ---

    async selectHeightUnit(unit: '%' | 'px'): Promise<void> {
        await this.heightUnitSelect.click();
        await this.page.getByRole('option', { name: unit }).click();
    }

    async selectWidthUnit(unit: '%' | 'px'): Promise<void> {
        await this.widthUnitSelect.click();
        await this.page.getByRole('option', { name: unit }).click();
    }

    // --- Webhooks (delegated) ---

    async fillWebhookUrl(url: string): Promise<void> {
        await this.webhook.fillWebhookUrl(url);
    }

    async fillWebhookStepFailUrl(url: string): Promise<void> {
        await this.webhook.fillStepFailWebhookUrl(url);
    }

    // --- Save ---

    async saveChanges(): Promise<void> {
        await this.saveChangesButton.click();
    }

    // --- State checks ---

    async isLoaded(): Promise<boolean> {
        return this.configurationHeading.isVisible();
    }

    async isSaveVisible(): Promise<boolean> {
        return this.saveChangesButton.isVisible();
    }
}

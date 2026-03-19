import { Page, Locator } from '@playwright/test';
import { CloseSliderComponent } from '../../components/common/close-slider.component';
import { ConditionComponent } from '../../components/workflow/condition.component';
import { CronComponent } from '../../components/workflow/cron.component';
import { EmailComponent } from '../../components/workflow/email.component';

/**
 * Triggers Page
 * Composes: CloseSliderComponent, ConditionComponent
 */
export class TriggersPage {
    readonly page: Page;

    // Composed components
    readonly slider: CloseSliderComponent;
    readonly condition: ConditionComponent;
    readonly cron: CronComponent;
    readonly email: EmailComponent;

    // Trigger selection
    // NOTE: MUI useAutocomplete (AddStepSlider.tsx) gives role='listbox' to the List
    // and role='option' to each ListItemButton via getOptionProps — no data-testid exists
    readonly triggerListItemButton: Locator;
    readonly triggerTypeRadioGroup: Locator;

    // Trigger search input (AddStepSlider.tsx — data-testid='trigger-search-input')
    readonly triggerSearchInput: Locator;

    // Individual trigger options (AddStepSlider.tsx — data-testid='trigger-option')
    readonly triggerOption: Locator;

    // Built-in tool options in action slider (AddStepSlider.tsx — data-testid='builtin-tool-option')
    readonly builtinToolOption: Locator;

    // Search bar back/navigation button (AddStepSlider.tsx — data-testid='slider-search-back-button')
    readonly sliderSearchBackButton: Locator;

    // --- Webhook trigger slider (webhookComponent.tsx) ---
    // webhook-set-button is on WorkflowPage (workflow.setWebhookButton)
    // 'Get data' button (data-testid='webhook-get-data-button')
    readonly webhookGetDataButton: Locator;
    // Tabs container (data-testid='webhook-tabs')
    readonly webhookTabs: Locator;
    // Payload tab (data-testid='webhook-payload-tab')
    readonly webhookPayloadTab: Locator;
    // Send Sample Data tab (data-testid='webhook-send-sample-tab')
    readonly webhookSendSampleTab: Locator;
    // Add Sample Payload button in inFlow mode (data-testid='webhook-add-sample-payload-button')
    readonly webhookAddSamplePayloadButton: Locator;

    // Email trigger locators are now on EmailComponent (triggers.email)

    // --- Plugin trigger action list (ActionsListAutocomplete.tsx) ---
    // Back arrow in plugin action list (data-testid='plugin-trigger-back-button')
    readonly pluginTriggerBackButton: Locator;
    // Search input in action list (data-testid='action-search-input')
    readonly actionSearchInput: Locator;
    // Each action/trigger item row (data-testid='trigger-action-item')
    readonly triggerActionItem: Locator;

    constructor(page: Page) {
        this.page = page;
        this.slider = new CloseSliderComponent(page);
        this.condition = new ConditionComponent(page);
        this.cron = new CronComponent(page);
        this.email = new EmailComponent(page);

        // Trigger options: MUI useAutocomplete sets role='listbox' on the List wrapper
        // and role='option' on each ListItemButton via getOptionProps (AddStepSlider.tsx)
        // FIX: previous getByTestId('trigger-list-item-button') was developer-hub only
        this.triggerListItemButton = page.getByRole('listbox').getByRole('option');
        this.triggerTypeRadioGroup = page.getByTestId('trigger-type-radio-group');

        this.triggerSearchInput = page.getByTestId('trigger-search-input');
        this.triggerOption = page.getByTestId('trigger-option');
        this.builtinToolOption = page.getByTestId('builtin-tool-option');
        this.sliderSearchBackButton = page.getByTestId('slider-search-back-button');

        // Webhook trigger
        this.webhookGetDataButton = page.getByTestId('webhook-get-data-button');
        this.webhookTabs = page.getByTestId('webhook-tabs');
        this.webhookPayloadTab = page.getByTestId('webhook-payload-tab');
        this.webhookSendSampleTab = page.getByTestId('webhook-send-sample-tab');
        this.webhookAddSamplePayloadButton = page.getByTestId('webhook-add-sample-payload-button');

        // Email trigger locators are on this.email (EmailComponent)

        // Plugin trigger action list
        this.pluginTriggerBackButton = page.getByTestId('plugin-trigger-back-button');
        this.actionSearchInput = page.getByTestId('action-search-input');
        this.triggerActionItem = page.getByTestId('trigger-action-item');
    }

    // --- Slider ---

    async clickBack(): Promise<void> {
        await this.slider.clickBack();
    }

    async closeSlider(): Promise<void> {
        await this.slider.clickClose();
    }

    async clickNext(): Promise<void> {
        await this.slider.clickNext();
    }

    // --- Trigger selection ---

    async selectWebhookTrigger(): Promise<void> {
        await this.triggerOption.filter({ hasText: /webhook/i }).click();
    }

    async selectCronTrigger(): Promise<void> {
        await this.triggerOption.filter({ hasText: /cron|schedule|automatically/i }).click();
    }

    async selectEmailTrigger(): Promise<void> {
        await this.triggerOption.filter({ hasText: /email/i }).click();
    }

    async selectTriggerByText(text: string): Promise<void> {
        await this.triggerOption.filter({ hasText: text }).click();
    }

    // --- Condition ---

    async addCondition(): Promise<void> {
        await this.condition.addCondition();
    }

    // --- State checks ---

    async isBackVisible(): Promise<boolean> {
        return this.slider.isBackVisible();
    }

    async isNextVisible(): Promise<boolean> {
        return this.slider.isNextVisible();
    }

    async isAddConditionVisible(): Promise<boolean> {
        return this.condition.isAddConditionVisible();
    }
}

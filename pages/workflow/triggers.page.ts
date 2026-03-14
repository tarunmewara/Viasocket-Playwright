import { Page, Locator } from '@playwright/test';
import { CloseSliderComponent } from '../../components/common/close-slider.component';
import { ConditionComponent } from '../../components/workflow/condition.component';
import { CronComponent } from '../../components/workflow/cron.component';

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

    constructor(page: Page) {
        this.page = page;
        this.slider = new CloseSliderComponent(page);
        this.condition = new ConditionComponent(page);
        this.cron = new CronComponent(page);

        // Trigger options: MUI useAutocomplete sets role='listbox' on the List wrapper
        // and role='option' on each ListItemButton via getOptionProps (AddStepSlider.tsx)
        // FIX: previous getByTestId('trigger-list-item-button') was developer-hub only
        this.triggerListItemButton = page.getByRole('listbox').getByRole('option');
        this.triggerTypeRadioGroup = page.getByTestId('trigger-type-radio-group');

        this.triggerSearchInput = page.getByTestId('trigger-search-input');
        this.triggerOption = page.getByTestId('trigger-option');
        this.builtinToolOption = page.getByTestId('builtin-tool-option');
        this.sliderSearchBackButton = page.getByTestId('slider-search-back-button');
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

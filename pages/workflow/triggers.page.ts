import { Page } from '@playwright/test';
import { CloseSliderComponent } from '../../components/common/close-slider.component';
import { ConditionComponent } from '../../components/workflow/condition.component';

/**
 * Triggers Page
 * Composes: CloseSliderComponent, ConditionComponent
 */
export class TriggersPage {
    readonly page: Page;

    // Composed components
    readonly slider: CloseSliderComponent;
    readonly condition: ConditionComponent;

    constructor(page: Page) {
        this.page = page;
        this.slider = new CloseSliderComponent(page);
        this.condition = new ConditionComponent(page);
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

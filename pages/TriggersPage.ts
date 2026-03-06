import { Page, Locator } from '@playwright/test';

export class TriggersPage {
    private readonly page: Page;
    private readonly selectTriggerDiv: Locator;
    private readonly selectTriggerText: Locator;
    private readonly webhookTriggerBtn: Locator;
    private readonly hideFullscreenBtn: Locator;
    private readonly runFlowIfText: Locator;
    private readonly enableRunFlowIfSwitch: Locator;
    private readonly conditionTextbox: Locator;
    private readonly conditionPlaceholder: Locator;
    private readonly backdropRoot: Locator;
    private readonly testBtn: Locator;
    private readonly saveBtn: Locator;
    private readonly cronTriggerBtn: Locator;
    private readonly cronTriggerBtnIntervals: Locator;
    private readonly cronExpressionTextbox: Locator;
    private readonly setCronBtn: Locator;
    private readonly searchTriggerTextbox: Locator;
    private readonly chooseSpreadsheetCombo: Locator;
    private readonly chooseSheetCombo: Locator;
    private readonly noRadioBtn: Locator;
    private readonly getDataBtn: Locator;
    private readonly genericSwitch: Locator;

    constructor(page: Page) {
        this.page = page;
        this.selectTriggerDiv = page.locator('div').filter({ hasText: /^Select TriggerSelect the event that starts your flow$/ }).nth(1);
        this.selectTriggerText = page.getByText('Select Trigger');
        this.webhookTriggerBtn = page
            .getByRole('listbox')
            .getByRole('option', { name: 'When a webhook is triggered' });
        this.hideFullscreenBtn = page.locator('button.fullscreen-hide');
        this.runFlowIfText = page.getByText('Run Flow If');
        this.enableRunFlowIfSwitch = page.getByRole('switch', { name: 'Enable to add condition' });
        this.conditionTextbox = page.getByRole('textbox', { name: 'Ask AI to define when this' });
        this.conditionPlaceholder = page.getByPlaceholder('Ask AI to define when this');
        this.backdropRoot = page.locator('.MuiBackdrop-root');
        this.testBtn = page.getByRole('button', { name: /test/i });
        this.saveBtn = page.getByRole('button', { name: 'Save' });
        this.cronTriggerBtn = page.getByRole('button', { name: 'Run automatically at defined' });
        this.cronTriggerBtnIntervals = page.getByRole('button', { name: 'Run automatically at defined intervals' });
        this.cronExpressionTextbox = page.getByRole('textbox', { name: 'Daily 2 pm except weekend and' });
        this.setCronBtn = page.getByRole('button', { name: 'Set Cron' });
        this.searchTriggerTextbox = page.getByRole('combobox', { name: 'Search Trigger' });
        this.chooseSpreadsheetCombo = page.getByRole('combobox', { name: 'Choose spreadsheet' });
        this.chooseSheetCombo = page.getByRole('combobox', { name: 'Choose Sheet' });
        this.noRadioBtn = page.getByRole('radio', { name: 'No' });
        this.getDataBtn = page.getByRole('button', { name: 'Get data' });
        this.genericSwitch = page.getByRole('switch');
    }

    async clickSelectTriggerDiv(): Promise<void> {
        await this.selectTriggerDiv.click();
    }

    async clickSelectTriggerText(): Promise<void> {
        await this.selectTriggerText.click();
    }

    async selectWebhookTrigger(): Promise<void> {
        await this.webhookTriggerBtn.click();
    }

    async hideFullscreen(): Promise<void> {
        await this.hideFullscreenBtn.click();
    }

    async clickRunFlowIf(): Promise<void> {
        await this.runFlowIfText.click();
    }

    async enableRunFlowIf(): Promise<void> {
        await this.enableRunFlowIfSwitch.check();
    }

    async fillCondition(condition: string): Promise<void> {
        await this.conditionTextbox.click();
        await this.conditionPlaceholder.fill(condition);
    }

    async clickBackdrop(): Promise<void> {
        const closeBtn = this.page.getByRole('button').filter({ hasText: /^$/ });

        if (await closeBtn.first().isVisible()) {
            await closeBtn.first().click();
        }
    }

    async clickTest(): Promise<void> {
        await this.page.getByText('Test', { exact: true }).click();
    }

    async clickSave(): Promise<void> {
        await this.saveBtn.click();
    }

    async selectCronTrigger(): Promise<void> {
        if (await this.cronTriggerBtn.isVisible()) {
            await this.cronTriggerBtn.click();
        } else {
            await this.cronTriggerBtnIntervals.click();
        }
    }

    async fillCronExpression(expr: string): Promise<void> {
        await this.cronExpressionTextbox.fill(expr);
    }

    async clickSetCron(): Promise<void> {
        await this.setCronBtn.click();
    }

    async clickCronResult(text: string): Promise<void> {
        await this.page.locator('div').filter({ hasText: new RegExp('^' + text + '$', 'i') }).nth(2).click();
    }

    async clickGetData(): Promise<void> {
        await this.getDataBtn.click();
    }

    async searchTrigger(query: string): Promise<void> {
        await this.searchTriggerTextbox.fill(query);
    }

    async selectPlugin(name: string): Promise<void> {
        const pluginBtn = this.page.getByRole('button', { name, exact: true });
        if (await pluginBtn.isVisible()) {
            await pluginBtn.click();
        } else {
            await this.page.getByText(name, { exact: true }).click();
        }
    }

    async selectPluginEvent(eventName: string): Promise<void> {
        // From raw script: await page.getByLabel('New or Updated Spreadsheet').getByText('New or Updated Spreadsheet Row').click();
        // Or simply:
        await this.page.getByText(eventName, { exact: true }).click();
    }

    async clickChooseSpreadsheet(): Promise<void> {
        await this.chooseSpreadsheetCombo.click();
    }

    async clickChooseSheet(): Promise<void> {
        await this.chooseSheetCombo.click();
    }

    async selectSpreadsheet(name: string): Promise<void> {
        await this.page.getByText(name).click();
    }

    async selectSheet(name: string): Promise<void> {
        await this.page.getByText(name).click();
    }

    async checkNoRadio(): Promise<void> {
        await this.noRadioBtn.check();
    }

    async selectRunFlowIfTrigger(name: string): Promise<void> {
        await this.page.getByText(name).click();
    }

    async clickSwitch(): Promise<void> {
        await this.genericSwitch.click();
    }
}

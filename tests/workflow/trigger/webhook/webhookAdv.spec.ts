import { test, expect } from '../../../../fixtures/base.fixture';

test.describe('Webhook Advance Config', () => {
    let workflowUrl: string;

    // Create workflow once before all tests and extract full workflow URL
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
        const page = await context.newPage();
        
        try {
            await page.goto('/projects/58104');
            await page.getByTestId('project-slider-create-flow-btn').click();
            
            await page.locator('#flow-title-textfield').click();
            await page.locator('#flow-title-textfield').fill('webhook_advance_config_testcases');
            await page.locator('#flow-title-textfield').press('Tab');
            
            await page.getByTestId('trigger-option').filter({ hasText: /webhook/i }).first().click();
            
            // Wait for navigation and extract full workflow URL path
            // URL format: https://dev-flow.viasocket.com/projects/58104/proj58104/workflow/scriq07xTiMA/draft?...
            await page.waitForURL(/\/workflow\/[a-zA-Z0-9]+/);
            
            const url = page.url();
            // Extract path from: /projects/58104/proj58104/workflow/scriq07xTiMA/draft
            const match = url.match(/(\/projects\/\d+\/proj\d+\/workflow\/[a-zA-Z0-9]+)/);
            if (match && match[1]) {
                workflowUrl = `${match[1]}`;
                console.log(`Created workflow with URL: ${workflowUrl}`);
            } else {
                throw new Error('Failed to extract workflow URL from page URL');
            }
        } finally {
            await context.close();
        }
    });

    // Add delay after each test to avoid rate limit errors (1015)
    test.afterEach(async () => {
        await new Promise(res => setTimeout(res, 1000));
    });

    test('open webhook advance config', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
    });

    test('advance config go back button works', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.advanceConfigGoBackButton.click();
    });

    test('select JS Code option in advance config', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
    });

    test('variable popover close button works', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
    });

    test('ask AI functionality in advance config', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
        await triggers.aiDescriptionInput.click();
        await triggers.aiDescriptionInput.fill('return array of object');
        await page.getByRole('button', { name: 'Ask AI' }).nth(1).click();
    });

    test('ask AI modal close button works', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
        await triggers.aiDescriptionInput.fill('return array of object');
        await page.getByRole('button', { name: 'Ask AI' }).nth(1).click();
        await workflow.askAI.close();
    });

    test('dry run step test button is visible', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
        await expect(workflow.dryRunStepTestButton).toBeVisible();
    });

    test('dry run step test button click works', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
        await workflow.dryRunStepTestButton.click();
    });

    test('save button is visible', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
        await expect(workflow.saveButton).toBeVisible();
    });

    test('save button click works', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
        await workflow.saveButton.click();
    });

    test('hit flow individually switch toggle works', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
        await workflow.hitFlowIndividuallySwitch.check();
        await workflow.hitFlowIndividuallySwitch.uncheck();
    });

    test('hit flow individually switch is visible', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
        await expect(workflow.hitFlowIndividuallySwitch).toBeVisible();
    });

    test('hit flow individually switch click works', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.webhookGetDataButton.click();
        await triggers.builtinToolJsCodeOption.click();
        await triggers.variablePopoverCloseButton.click();
        await workflow.hitFlowIndividuallySwitch.click();
    });

    test('flow header run if button is visible', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.slider.clickClose();
        await expect(workflow.flowHeaderRunIfButton).toBeVisible();
    });

    test('flow header run if button click works', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.slider.clickClose();
        await workflow.flowHeaderRunIfButton.click();
    });

    test('run if condition toggle works', async ({ page, workflow, triggers }) => {
        await page.goto(`${workflowUrl}/draft`);
        await workflow.inflowWebhookNode.click();
        await triggers.slider.clickClose();
        await workflow.flowHeaderRunIfButton.click();
        await workflow.preConditionSwitch.check();
        await workflow.preConditionSwitch.uncheck();
    });
});

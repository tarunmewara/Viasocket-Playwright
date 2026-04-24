import { test, expect } from '../../fixtures/base.fixture';
import * as fs from 'fs';
import * as path from 'path';

const WORKFLOW_URL_FILE = path.join(__dirname, '.sales-workflow-url.txt');

function saveWorkflowUrl(url: string) {
    fs.writeFileSync(WORKFLOW_URL_FILE, url, 'utf-8');
}

function getWorkflowUrl(): string | undefined {
    if (fs.existsSync(WORKFLOW_URL_FILE)) {
        return fs.readFileSync(WORKFLOW_URL_FILE, 'utf-8').trim();
    }
    return undefined;
}

test.describe('Sales Generator Workflow - Modular Build Approach (POM)', () => {

    test.beforeEach(async ({ workspace, collection, page }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await collection.selectCollectionByIndex(0);
    });

    test('TC-SALES-01-P1: Create workflow with Cron trigger and API Call', async ({ 
        dashboard, 
        triggers, 
        workflow,
        page 
    }) => {
        test.setTimeout(180000);
        
        await dashboard.clickCreateNewFlow();
        
        // Configure Cron trigger
        await triggers.selectCronTrigger();
        await triggers.cron.fillStatement('9 0 * * *');
        await page.getByRole('option').first().click();
        
        // Add API Call step
        await workflow.addStep.clickAddStep();
        await workflow.addStep.selectStepByName('API Call');
        
        // Configure API Call
        await workflow.httpApi.apiEditorAccordionBtn.click();
        await workflow.httpApi.urlInput.fill('https://viasocket-test.free.beeceptor.com/orders');
        
        
        await workflow.httpApi.methodDropdown.click();
        await page.getByRole('option', { name: 'GET' }).click();
        
        await page.waitForTimeout(500);
        await workflow.httpApi.testButton.click();
        await workflow.saveButton.click();
        
        const workflowUrl = page.url();
        saveWorkflowUrl(workflowUrl);
        console.log('Workflow URL created:', workflowUrl);
    
    });

    test('TC-SALES-01-P2: Add JS Code step to process sales data', async ({ 
        workflow,
        page 
    }) => {
        test.setTimeout(180000);
        
        const workflowUrl = getWorkflowUrl();
        if (!workflowUrl) {
            throw new Error('Workflow URL not found. Please run TC-SALES-01-P1 first.');
        }
        
        await page.goto(workflowUrl);
        await workflow.threeDotsMenu.menuButton.click();
        await workflow.threeDotsMenu.testFlowOption.click();
        
        // Add JS Code step
        await workflow.addStep.clickAddStep();
        await workflow.addStep.selectStepByName('JS Code');
    
        
        const jsCode = `const response = context.res.API_Call;

if (!response || response.status !== "success") {
  throw new Error("Sales API failed");
}

const sales = response.data || [];

if (sales.length === 0) {
  return {
    totalSales: 0,
    totalOrders: 0,
    refundedAmount: 0,
    netRevenue: 0,
    isEmpty: true
  };
}

let totalSales = 0;
let refundedAmount = 0;
let totalOrders = sales.length;

sales.forEach(order => {
  if (order.status === "completed") {
    totalSales += order.amount;
  } else if (order.status === "refunded") {
    refundedAmount += order.amount;
  }
});

const netRevenue = totalSales - refundedAmount;

return {
  totalSales,
  totalOrders,
  refundedAmount,
  netRevenue,
  isEmpty: false,
  rawData: sales
};`;
        
        await page.getByRole('button', { name: 'Code' }).click();
        await workflow.jscode.codeEditorTextbox.click();
        await workflow.jscode.codeEditorTextbox.fill(jsCode);
        
        await workflow.jscode.testButton.click();
        await page.getByRole('button', { name: 'Test' }).click();
        await workflow.jscode.inputVariablesCloseBtn.click();
        await expect(workflow.saveButton).toBeVisible();
        await workflow.saveButton.click();
        
    });

    test('TC-SALES-01-P3: Add Multiple Paths and Gmail action', async ({ 
        workflow,
        page 
    }) => {
        test.setTimeout(180000);
        
        const workflowUrl = getWorkflowUrl();
        if (!workflowUrl) {
            throw new Error('Workflow URL not found. Please run TC-SALES-01-P1 first.');
        }
        
        await page.goto(workflowUrl);
        await workflow.threeDotsMenu.menuButton.click();
        await workflow.threeDotsMenu.testFlowOption.click();
        
        // Add Multiple Paths
        await workflow.addStep.clickAddStep();
        await page.getByRole('option', { name: 'Multiple Paths (If Conditions)' }).waitFor({ state: 'visible', timeout: 10000 });
        await page.getByRole('option', { name: 'Multiple Paths (If Conditions)' }).click();
        
        await workflow.multipath.fillCondition('if JS_Code.isEmpty is true');
        await page.waitForTimeout(1000);

        await workflow.saveButton.click();
        
        // Add Gmail to "if true" path
        await page.getByText('Add or drag step here').first().click();
        await workflow.addStep.searchStep('gmail');
        await page.getByText('Gmail', { exact: true }).click();
        await workflow.addStep.selectStepByText('Send Email With Attachments');
        
        await workflow.gmail.selectAuth(2);
        
        await page.getByRole('textbox', { name: 'E.g. recipient@example.com' }).click();
        await page.keyboard.type('sc@viasocket.com ', { delay: 50 });
        
        await page.getByRole('textbox', { name: 'E.g. Subject of your email' }).click();
        await page.keyboard.type('automation testing TC-SALES-01 ', { delay: 50 });
        
        await workflow.gmail.selectMessageType('Plain');
        
        await page.getByRole('textbox', { name: 'E.g. Write your email message' }).click();
        await page.keyboard.type('no sales', { delay: 50 });
        
        await workflow.gmail.dryRunTestButton.click();
        await expect(workflow.saveButton).toBeVisible();
        await workflow.saveButton.click();
        
    });

    test('TC-SALES-01-P4: Add AI Agent to else path', async ({ 
        workflow,
        page 
    }) => {
        test.setTimeout(180000);
        
        const workflowUrl = getWorkflowUrl();
        if (!workflowUrl) {
            throw new Error('Workflow URL not found. Please run TC-SALES-01-P1 first.');
        }
        
        await page.goto(workflowUrl);
        await workflow.threeDotsMenu.menuButton.click();
        await workflow.threeDotsMenu.testFlowOption.click();
        
        // Add AI Agent to else path
        await page.getByText('Add or drag step here').last().click();
        await workflow.addStep.selectStepByName('Call AI Agent (Instant)');
        
        await page.getByRole('textbox', { name: 'E.g., What is AI?' }).click();
        await page.keyboard.type('give me one insight based on the sales report\n', { delay: 50 });
        await workflow.aiAgent.dryRunTestButton.click();
        await expect(workflow.saveButton).toBeVisible();
        await workflow.saveButton.click();
        
    });

    test('TC-SALES-01-P5: Add Google Sheets action to log sales data', async ({ 
        workflow,
        page 
    }) => {
        test.setTimeout(180000);
        
        const workflowUrl = getWorkflowUrl();
        if (!workflowUrl) {
            throw new Error('Workflow URL not found. Please run TC-SALES-01-P1 first.');
        }
        
        await page.goto(workflowUrl);
        await workflow.threeDotsMenu.menuButton.click();
        await workflow.threeDotsMenu.testFlowOption.click();
        
        // Add Google Sheets
        await workflow.addStep.clickAddStep();
        await workflow.addStep.searchStep('google sheet');
        await page.getByTestId('add-step-slider').getByText('Google Sheets').click();
        await workflow.addStep.selectStepByText('Add Row To Sheet');
        
        await workflow.googleSheets.selectAuth(2);
        await workflow.googleSheets.selectSpreadsheet(0);
        await workflow.googleSheets.selectSheet(0);
        await workflow.googleSheets.enableHeaderRow();
        
        await workflow.googleSheets.selectColumns([
            'Total Orders (Column B)',
            'Total Sales (Column C)',
            'Refund (Column D)',
            'net Revenue (Column E)',
            'insights (Column F)'
        ]);
        
        await workflow.googleSheets.dryRunTestButton.click();
        
        // Map column values using new mapping pattern
        await page.getByTestId('custom-autosuggest-column_name.Total_Orders').locator('path').nth(1).click({ force: true });
        await page.getByRole('menuitem', { name: 'JS_Code {..}' }).hover();
        await page.getByText('totalOrders').click();
        
        await page.getByTestId('mentions-input-column_name.Total_Sales').click();
        await page.getByTestId('custom-autosuggest-column_name.Total_Sales').locator('path').nth(4).click({ force: true });
        await page.getByRole('menuitem', { name: 'JS_Code {..}' }).hover();
        await page.getByText('totalSales').click();
        
        await page.getByTestId('custom-autosuggest-column_name.Refund').locator('path').nth(1).click({ force: true });
        await page.getByRole('menuitem', { name: 'JS_Code {..}' }).hover();
        await page.getByText('refundedAmount').click();
        
        await page.getByTestId('mentions-input-column_name.net_Revenue').click();
        await page.getByTestId('custom-autosuggest-column_name.net_Revenue').locator('path').nth(4).click({ force: true });
        await page.getByRole('menuitem', { name: 'JS_Code {..}' }).hover();
        await page.getByText('netRevenue').click();
        
        await page.getByTestId('custom-autosuggest-column_name.insights').locator('path').first().click({ force: true });
        await page.getByText('Call_AI_Agent_Instantly').hover();
        await page.getByText('content').click();
        
        await page.getByTestId('dry-run-test-button').click();
        await page.getByRole('button', { name: 'Test' }).click();
        await page.getByTestId('input-variables-close-btn').click();
        await expect(workflow.saveButton).toBeVisible();
        await workflow.saveButton.click();
        
        await page.getByTestId('flow-more-options-button').click();
        await page.getByText('Move To Trash').click();
        await page.getByTestId('flow-delete-confirm-button').click();
        
        console.log('Final Workflow URL:', page.url());
    });
});

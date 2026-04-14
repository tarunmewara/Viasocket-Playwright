import { test, expect } from '../../../fixtures/base.fixture';
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
        await workflow.addStep.closeVariablePopover();
        
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
        await workflow.addStep.closeVariablePopover();
        
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
        
        await workflow.jscode.codeAccordionBtn.click();
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
        await workflow.addStep.closeVariablePopover();
        await workflow.saveButton.click();
        
        // Add Gmail to "if true" path
        await page.getByText('Add or drag step here').first().click();
        await workflow.addStep.searchStep('gmail');
        await page.getByText('Gmail', { exact: true }).click();
        await workflow.addStep.selectStepByText('Send Email With Attachments');
        
        await workflow.gmail.selectAuth(2);
        await workflow.gmail.fillTo('shubhamdkdnetflix@gmail.com');
        await workflow.gmail.fillSubject('there is no sales today');
        await workflow.gmail.selectMessageType('Plain');
        await workflow.gmail.fillMessageBody('no sales');
        
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
        
        await workflow.aiAgent.fillQuery('give me one insight based on the sales report\n');
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
        await page.getByText('Google Sheets', { exact: true }).click();
        await workflow.addStep.selectStepByText('Add New Row To Sheet');
        
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
        
        // Map column values
        await workflow.googleSheets.mapColumnValue('Total_Orders--B', 'js_code', 'totalorders');
        await workflow.googleSheets.mapColumnValue('Total_Sales--C', 'js_code', 'totalsales');
        await workflow.googleSheets.mapColumnValue('Refund--D', 'js_code', 'refundedamount');
        await workflow.googleSheets.mapColumnValue('net_Revenue--E', 'js_code', 'netrevenue');
        
        // Map insights from AI Agent
        await page.getByTestId('mentions-input-column_name.insights').click();
        await page.getByTestId('tree-item-call_ai_agent_instantly').locator('svg').first().click();
        await page.getByTestId('tree-item-content').getByTestId('tree-item-insert-button').click();
        await workflow.addStep.closeVariablePopover();
        
        await workflow.googleSheets.dryRunTestButton.click();
        await workflow.googleSheets.inputVariablesCloseBtn.click();
        await expect(workflow.saveButton).toBeVisible();
        await workflow.saveButton.click();
        
        await page.getByTestId('flow-more-options-button').click();
        await page.getByText('Move To Trash').click();
        await page.getByTestId('flow-delete-confirm-button').click();
        
        console.log('Final Workflow URL:', page.url());
    });
});

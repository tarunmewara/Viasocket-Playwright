import { test, expect } from '../../fixtures/base.fixture';

test.describe('Workflow Tests', () => {

    test.beforeEach(async ({ workspace, dashboard }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.clickCreateNewFlow();
    });

    test('Give name to workflow', async ({ workflow }) => {
        const flowName = 'Test Automation Flow';

        await workflow.flowTitleInput.click();
        await workflow.flowTitleInput.fill(flowName);
        await workflow.flowTitleInput.press('Tab');

        await expect(workflow.flowTitleInput).toHaveValue(flowName);
    });

    test('Visibility - new flow page with add trigger slider open', async ({ workflow, triggers, flowOptions }) => {

        // --- Navbar: left side ---
        await expect(flowOptions.navbar.breadcrumbHomeLink).toBeVisible();
        await expect(workflow.flowTitleInput).toBeVisible();

        // --- Navbar: right side ---
        await expect(flowOptions.navbar.flowDocumentButton).toBeVisible();
        await expect(flowOptions.navbar.moreOptionsButton).toBeVisible();

        // --- Add Trigger Slider: search bar ---
        await expect(triggers.triggerSearchInput).toBeVisible();

        // --- Add Trigger Slider: 3 trigger options (webhook, cron, email to flow) ---
        await expect(triggers.triggerOption.filter({ hasText: /webhook/i }).first()).toBeVisible();
        await expect(triggers.triggerOption.filter({ hasText: /cron|automatically/i }).first()).toBeVisible();
        await expect(triggers.triggerOption.filter({ hasText: /email/i }).first()).toBeVisible();

        // --- Canvas: Goal sticky note ---
        await expect(workflow.goalStickyNote).toBeVisible();

        // --- Canvas: "When do you want to run the automation?" prompt ---
        await expect(workflow.selectTriggerPrompt).toBeVisible();

        // --- Canvas: Ask AI button ---
        await expect(workflow.askAIButton).toBeVisible();

        // --- Canvas: flow resizers (zoom controls ButtonGroup) ---
        await expect(workflow.zoomControls).toBeVisible();
    });

});

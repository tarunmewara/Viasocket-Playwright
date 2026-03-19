import { test, expect } from '../../fixtures/base.fixture';

test.describe('Ask AI Modal Tests', () => {

    test.beforeEach(async ({ workspace, dashboard, workflow }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await dashboard.clickCreateNewFlow();

        // Wait for the canvas & Ask AI button — confirms the flow page loaded
        await expect(workflow.askAIButton).toBeVisible({ timeout: 15000 });

        // Open the Ask AI modal via URL chatId parameter (no full reload)
        await workflow.askAI.openModal();
    });

    test.describe('Modal Structure', () => {

        test('TC-ASKAI-01: Ask AI tab is visible', async ({ workflow }) => {
            await expect(workflow.askAI.askAITab).toBeVisible();
        });

        test('TC-ASKAI-02: Assign to Expert tab is visible', async ({ workflow }) => {
            await expect(workflow.askAI.assignExpertTab).toBeVisible();
        });

        test('TC-ASKAI-03: Close button is visible', async ({ workflow }) => {
            await expect(workflow.askAI.closeButton).toBeVisible();
        });
    });

    test.describe('Ask AI Tab', () => {

        test('TC-ASKAI-04: Ask AI tab is selected by default', async ({ workflow }) => {
            const isSelected = await workflow.askAI.isAskAITabSelected();
            expect(isSelected).toBe(true);
        });

        test('TC-ASKAI-05: Ask AI empty state text displays when chat has not started', async ({ workflow }) => {
            await expect(workflow.askAI.askAIEmptyStateText).toBeVisible();
        });
    });

    test.describe('Assign to Expert Tab', () => {

        test('TC-ASKAI-06: Switch to Assign to Expert tab selects it', async ({ workflow }) => {
            await workflow.askAI.switchToAssignExpertTab();
            const isSelected = await workflow.askAI.isExpertTabSelected();
            expect(isSelected).toBe(true);
        });

        test('TC-ASKAI-07: Expert empty state text displays when chat has not started', async ({ workflow }) => {
            await workflow.askAI.switchToAssignExpertTab();
            await expect(workflow.askAI.expertEmptyStateTitle).toBeVisible({ timeout: 5000 });
            await expect(workflow.askAI.expertEmptyStateSubtitle).toBeVisible();
        });
    });

    test.describe('Tab Switching', () => {

        test('TC-ASKAI-08: Switch from Ask AI to Expert and back', async ({ workflow }) => {
            // Switch to Expert tab
            await workflow.askAI.switchToAssignExpertTab();
            const expertSelected = await workflow.askAI.isExpertTabSelected();
            expect(expertSelected).toBe(true);

            // Switch back to Ask AI tab
            await workflow.askAI.switchToAskAITab();
            const askAISelected = await workflow.askAI.isAskAITabSelected();
            expect(askAISelected).toBe(true);
        });
    });

    test.describe('Close Modal', () => {

        test('TC-ASKAI-09: Close button closes the modal', async ({ workflow }) => {
            await workflow.askAI.close();
            await expect(workflow.askAI.askAITab).not.toBeVisible({ timeout: 5000 });
        });

        test('TC-ASKAI-10: Escape key closes the modal', async ({ workflow }) => {
            await workflow.askAI.closeViaEscape();
            await expect(workflow.askAI.askAITab).not.toBeVisible({ timeout: 5000 });
        });

        test('TC-ASKAI-13: Close removes all modal elements from DOM', async ({ workflow }) => {
            await workflow.askAI.close();
            await expect(workflow.askAI.askAITab).not.toBeVisible({ timeout: 5000 });
            await expect(workflow.askAI.assignExpertTab).not.toBeVisible();
            await expect(workflow.askAI.closeButton).not.toBeVisible();
            await expect(workflow.askAI.askAIEmptyStateText).not.toBeVisible();
        });
    });

    test.describe('Ask AI Button Visibility', () => {

        test('TC-ASKAI-11: Ask AI button hides when modal is open', async ({ workflow }) => {
            await expect(workflow.askAIButton).not.toBeVisible();
        });

        test('TC-ASKAI-12: Ask AI button reappears after modal close', async ({ workflow }) => {
            await workflow.askAI.close();
            await expect(workflow.askAIButton).toBeVisible({ timeout: 5000 });
        });
    });

    test.describe('Cross-Tab Content Exclusivity', () => {

        test('TC-ASKAI-14: Expert empty state not visible on Ask AI tab', async ({ workflow }) => {
            await expect(workflow.askAI.expertEmptyStateTitle).not.toBeVisible();
            await expect(workflow.askAI.expertEmptyStateSubtitle).not.toBeVisible();
        });

        test('TC-ASKAI-15: Ask AI empty state not visible on Expert tab', async ({ workflow }) => {
            await workflow.askAI.switchToAssignExpertTab();
            await expect(workflow.askAI.askAIEmptyStateText).not.toBeVisible();
        });
    });

    test.describe('Reopen After Close', () => {

        test('TC-ASKAI-16: Reopen after close resets to Ask AI tab', async ({ workflow }) => {
            await workflow.askAI.close();
            await expect(workflow.askAI.askAITab).not.toBeVisible({ timeout: 5000 });
            await workflow.askAI.openModal();
            const isSelected = await workflow.askAI.isAskAITabSelected();
            expect(isSelected).toBe(true);
        });

        test('TC-ASKAI-17: Close from Expert tab and reopen resets to Ask AI', async ({ workflow }) => {
            await workflow.askAI.switchToAssignExpertTab();
            const expertSelected = await workflow.askAI.isExpertTabSelected();
            expect(expertSelected).toBe(true);

            await workflow.askAI.close();
            await expect(workflow.askAI.askAITab).not.toBeVisible({ timeout: 5000 });
            await workflow.askAI.openModal();
            const askAISelected = await workflow.askAI.isAskAITabSelected();
            expect(askAISelected).toBe(true);
        });
    });

    test.describe('Tab Mutual Exclusivity', () => {

        test('TC-ASKAI-18: When Expert tab selected, Ask AI tab is deselected', async ({ workflow }) => {
            await workflow.askAI.switchToAssignExpertTab();
            const askAISelected = await workflow.askAI.isAskAITabSelected();
            const expertSelected = await workflow.askAI.isExpertTabSelected();
            expect(askAISelected).toBe(false);
            expect(expertSelected).toBe(true);
        });

        test('TC-ASKAI-19: Close button accessible on Expert tab', async ({ workflow }) => {
            await workflow.askAI.switchToAssignExpertTab();
            await expect(workflow.askAI.closeButton).toBeVisible();
        });
    });

    test.describe('Tab Label Content', () => {

        test('TC-ASKAI-20: Tab labels show correct text', async ({ workflow }) => {
            await expect(workflow.askAI.askAITab).toContainText('Ask AI');
            await expect(workflow.askAI.assignExpertTab).toContainText('Assign to Expert');
        });
    });

    test.describe('AI Chat Interaction', () => {

        test('TC-ASKAI-21: Chat input field is visible on Ask AI tab', async ({ workflow }) => {
            await expect(workflow.askAI.chatInput).toBeVisible();
        });

        test('TC-ASKAI-22: Send a prompt and user message appears in chat', async ({ workflow }) => {
            const prompt = 'Add a webhook trigger to this flow';
            await workflow.askAI.sendPrompt(prompt);
            const userMsg = workflow.askAI.getUserMessage(prompt);
            await expect(userMsg).toBeVisible({ timeout: 15000 });
        });

        test('TC-ASKAI-23: Sent message renders as a user message card', async ({ workflow }) => {
            const prompt = 'Create a new API action step';
            await workflow.askAI.sendPrompt(prompt);
            // The user card should display with the exact text
            const userMsg = workflow.askAI.getUserMessage(prompt);
            await expect(userMsg).toBeVisible({ timeout: 10000 });
            // The card should contain a Typography with the prompt text
            await expect(userMsg.locator('p')).toContainText(prompt);
        });

        test('TC-ASKAI-24: Empty state text disappears after sending a prompt', async ({ workflow }) => {
            await expect(workflow.askAI.askAIEmptyStateText).toBeVisible();
            await workflow.askAI.sendPrompt('Create a JS code step');
            await expect(workflow.askAI.askAIEmptyStateText).not.toBeVisible({ timeout: 15000 });
        });

        test('TC-ASKAI-25: AI responds after sending a prompt', async ({ workflow }) => {
            await workflow.askAI.sendPrompt('Add a webhook trigger to this flow');
            // Wait for AI response element (loading may flash too quickly to catch)
            const aiResponse = workflow.askAI.getAiResponse(1);
            await expect(aiResponse).toBeVisible({ timeout: 60000 });
        });

        test('TC-ASKAI-26: Chat input clears after sending a prompt', async ({ workflow }) => {
            await workflow.askAI.sendPrompt('Add a webhook trigger');
            await expect(workflow.askAI.chatInput).toHaveValue('', { timeout: 15000 });
        });
    });

    test.describe('Expert Tab Chat Interaction', () => {

        test('TC-ASKAI-27: Expert chat input field is visible on Expert tab', async ({ workflow }) => {
            await workflow.askAI.switchToAssignExpertTab();
            await expect(workflow.askAI.expertChatInput).toBeVisible();
        });

        test('TC-ASKAI-28: Send a prompt on Expert tab and user message appears', async ({ workflow }) => {
            await workflow.askAI.switchToAssignExpertTab();
            const prompt = 'Help me configure my API integration';
            await workflow.askAI.sendExpertPrompt(prompt);
            const userMsg = workflow.askAI.getUserMessage(prompt);
            await expect(userMsg).toBeVisible({ timeout: 15000 });
        });

        test('TC-ASKAI-29: Expert empty state disappears after sending a prompt', async ({ workflow }) => {
            await workflow.askAI.switchToAssignExpertTab();
            await expect(workflow.askAI.expertEmptyStateTitle).toBeVisible({ timeout: 5000 });
            await workflow.askAI.sendExpertPrompt('I need help with my workflow');
            await expect(workflow.askAI.expertEmptyStateTitle).not.toBeVisible({ timeout: 15000 });
        });
    });
});

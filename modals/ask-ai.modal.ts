import { Page, Locator } from '@playwright/test';

/**
 * Ask AI Modal
 * Handles: Ask AI chatbot panel, Assign to Expert tab, empty states
 * Reference: AskAIModal.tsx
 *
 * Available data-testid selectors (3):
 *   ask-ai-modal-ask-ai-tab, ask-ai-modal-assign-expert-tab, ask-ai-modal-close-button
 */
export class AskAIModal {
    readonly page: Page;

    // Interactive elements (data-testid)
    readonly askAITab: Locator;
    readonly assignExpertTab: Locator;
    readonly closeButton: Locator;

    // Content verification (text-based locators)
    readonly askAIEmptyStateText: Locator;
    readonly expertEmptyStateTitle: Locator;
    readonly expertEmptyStateSubtitle: Locator;

    // Chat interaction locators
    readonly chatInput: Locator;
    readonly expertChatInput: Locator;
    readonly aiLoadingText: Locator;

    constructor(page: Page) {
        this.page = page;

        // Interactive elements with data-testid
        this.askAITab = page.getByTestId('ask-ai-modal-ask-ai-tab');
        this.assignExpertTab = page.getByTestId('ask-ai-modal-assign-expert-tab');
        this.closeButton = page.getByTestId('ask-ai-modal-close-button');

        // Text-based locators for content verification
        this.askAIEmptyStateText = page.getByText('How can I help you build your flow?');
        this.expertEmptyStateTitle = page.getByText('Need expert help?');
        this.expertEmptyStateSubtitle = page.getByText('Our experts are ready to assist you with your requirement');

        // Chat interaction locators
        this.chatInput = page.getByPlaceholder('Ask AI');
        this.expertChatInput = page.getByPlaceholder('Assign Task to Expert');
        this.aiLoadingText = page.getByText('Talking with AI');
    }

    // --- Actions ---

    async openModal(): Promise<void> {
        // Set chatId search param via JS to avoid a full page reload.
        // React Router picks up the change through the popstate event.
        await this.page.evaluate(() => {
            const url = new URL(window.location.href);
            const pathParts = url.pathname.split('/');
            const wfIdx = pathParts.indexOf('workflow');
            const scriptId = wfIdx !== -1 ? pathParts[wfIdx + 1] : '';
            url.searchParams.set('chatId', scriptId || 'open');
            window.history.pushState({}, '', url.toString());
            window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
        });
        await this.askAITab.waitFor({ state: 'visible', timeout: 15000 });
    }

    async openModalViaButton(): Promise<void> {
        const askAIButton = this.page.getByTestId('ask-ai-button');
        await askAIButton.waitFor({ state: 'visible', timeout: 10000 });
        await askAIButton.click();
        await this.askAITab.waitFor({ state: 'visible', timeout: 10000 });
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async closeViaEscape(): Promise<void> {
        await this.page.keyboard.press('Escape');
    }

    async isModalVisible(): Promise<boolean> {
        return this.askAITab.isVisible();
    }

    async switchToAskAITab(): Promise<void> {
        await this.askAITab.click();
    }

    async switchToAssignExpertTab(): Promise<void> {
        await this.assignExpertTab.click();
    }

    // --- Chat interaction ---

    async sendPrompt(message: string): Promise<void> {
        await this.chatInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.chatInput.click();
        await this.chatInput.fill(message);
        await this.page.keyboard.press('Enter');
    }

    async sendExpertPrompt(message: string): Promise<void> {
        await this.expertChatInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.expertChatInput.click();
        await this.expertChatInput.fill(message);
        await this.page.keyboard.press('Enter');
    }

    getUserMessage(text: string): Locator {
        return this.page.locator('.self-end').filter({ hasText: text });
    }

    getAiResponse(index: number): Locator {
        return this.page.locator(`#chat-message-${index}`);
    }

    // --- State checks ---

    async isAskAITabSelected(): Promise<boolean> {
        const ariaSelected = await this.askAITab.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async isExpertTabSelected(): Promise<boolean> {
        const ariaSelected = await this.assignExpertTab.getAttribute('aria-selected');
        return ariaSelected === 'true';
    }

    async isAssignExpertTabDisabled(): Promise<boolean> {
        const disabled = await this.assignExpertTab.getAttribute('aria-disabled');
        return disabled === 'true';
    }
}

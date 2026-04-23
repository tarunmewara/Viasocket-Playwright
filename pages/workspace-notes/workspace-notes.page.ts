import { Page, Locator, FrameLocator, expect } from '@playwright/test';

/**
 * Workspace Notes Page
 * Handles: workspace notes/document page — heading, description, DocStar container
 * Reference: WorkspaceDocument.tsx
 *
 * DOM structure (from live page):
 *   #workspace-docstar-container
 *     └─ #iframe-parent-techdoc-container
 *         └─ iframe#iframe-component-techdocEmbed (src: techdoc.walkover.in/embed_route)
 */
export class WorkspaceNotesPage {
    readonly page: Page;

    // Page elements
    readonly heading: Locator;
    readonly description: Locator;
    readonly docstarContainer: Locator;
    readonly docstarIframe: Locator;
    readonly docstarFrame: FrameLocator;

    constructor(page: Page) {
        this.page = page;

        // WorkspaceDocument.tsx — Typography elements
        this.heading = page.getByRole('heading', { name: 'Workspace Notes' });
        this.description = page.getByText('Use your workspace document to store notes');
        this.docstarContainer = page.locator('#workspace-docstar-container');
        this.docstarIframe = page.locator('#iframe-component-techdocEmbed');
        this.docstarFrame = page.frameLocator('#iframe-component-techdocEmbed');
    }

    /**
     * Returns the DocStar editor's editable area inside the iframe.
     */
    getEditorLocator(): Locator {
        return this.page.locator('#iframe-component-techdocEmbed').contentFrame().locator('#tiptap-editor');
    }

    async writeNote(text: string): Promise<void> {
        const editor = this.getEditorLocator();
        await editor.click();
        await this.page.keyboard.type(text);

        // Wait for text to be rendered in the TipTap editor
        const expectedLength = text.length;
        await expect(async () => {
            const currentText = await editor.textContent() || '';
            expect(currentText.length).toBeGreaterThanOrEqual(expectedLength * 0.9);
        }).toPass({ timeout: 10000 });
    }

    async clearNote(): Promise<void> {
        const editor = this.getEditorLocator();
        await editor.click();
        await this.page.locator('#iframe-component-techdocEmbed').contentFrame().locator('.tiptap').press('ControlOrMeta+a');
        await this.page.keyboard.press('Backspace');
    }

    async getEditorText(): Promise<string> {
        const editor = this.getEditorLocator();
        return (await editor.textContent()) ?? '';
    }

    async isHeadingVisible(): Promise<boolean> {
        return this.heading.isVisible();
    }

    async isDescriptionVisible(): Promise<boolean> {
        return this.description.isVisible();
    }

    async isDocstarContainerVisible(): Promise<boolean> {
        return this.docstarContainer.isVisible();
    }
}

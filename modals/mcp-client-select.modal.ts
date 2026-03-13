import { Page, Locator } from '@playwright/test';

/**
 * MCP Client Select Modal
 * Handles: MCP client selection dialog — search and close
 * Reference: MCPConnectSettings.tsx
 */
export class MCPClientSelectModal {
    readonly page: Page;

    readonly closeButton: Locator;
    readonly searchInput: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from MCPConnectSettings.tsx
        this.closeButton = page.getByTestId('mcp-client-dialog-close-button');
        this.searchInput = page.getByTestId('mcp-client-search-input');
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async search(query: string): Promise<void> {
        await this.searchInput.locator('input').fill(query);
    }

    async clearSearch(): Promise<void> {
        await this.searchInput.locator('input').fill('');
    }

    async isVisible(): Promise<boolean> {
        return this.closeButton.isVisible();
    }
}

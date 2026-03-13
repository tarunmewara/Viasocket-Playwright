import { Page, Locator } from '@playwright/test';

/**
 * MCP Client Select Modal
 * Handles: MCP client selection dialog (search, close)
 */
export class MCPClientSelectModal {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // TODO: Add locators and methods from data-testid:
    // mcp-client-dialog-close-button, mcp-client-search-input
}

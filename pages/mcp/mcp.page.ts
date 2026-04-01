import { Page, Locator } from '@playwright/test';

/**
 * MCP Page
 * Handles: MCP landing page (steps, Existing MCPs table, Create New),
 * Selected MCP page (sidebar, Configure/Connect tabs, client selector dialog,
 * URL visibility toggle, MCP name editing)
 * Reference: MCPPage.tsx, SelectedMCPPage.tsx, MCPEmbed.tsx,
 *            MCPConnectSettings.tsx, CreateNewMCPButton.tsx, CopyButton.tsx
 */
export class MCPPage {
    readonly page: Page;

    // --- Landing page (MCPPage.tsx) ---

    // Headings
    readonly mainHeading: Locator;
    readonly existingMCPsHeading: Locator;

    // Mushroom Card (replaces old step cards)
    readonly mushroomCard: Locator;
    readonly mushroomCardHeading: Locator;
    readonly mushroomCardChip: Locator;

    // Get Started button (opens Mushroom external URL)
    readonly getStartedButton: Locator;

    // Existing MCPs DataGrid
    readonly mcpDataGrid: Locator;

    // Copy buttons (generic, used in URL column and config JSON)
    readonly copyButton: Locator;

    // --- Selected MCP page (SelectedMCPPage.tsx) ---

    // Sidebar
    readonly backButton: Locator;
    readonly yourMCPsHeading: Locator;
    readonly sidebarCreateNewButton: Locator;
    readonly mcpListItems: Locator;
    readonly goToEmbedLink: Locator;

    // MCP name editing (MCPEmbed.tsx)
    readonly mcpNameDisplay: Locator;
    readonly mcpNameTextField: Locator;
    readonly mcpNameEditButton: Locator;

    // --- Connect tab (MCPConnectSettings.tsx) ---

    // Tabs (Configure / Connect)
    readonly configureTab: Locator;
    readonly connectTab: Locator;

    // Client selector
    readonly selectClientButton: Locator;

    // URL visibility toggle
    readonly toggleUrlVisibilityButton: Locator;

    // Client dialog
    readonly clientDialogCloseButton: Locator;
    readonly clientSearchInput: Locator;

    constructor(page: Page) {
        this.page = page;

        // Landing page headings
        this.mainHeading = page.getByRole('heading', { name: 'viaSocket MCP' });
        this.existingMCPsHeading = page.getByRole('heading', { name: 'Existing MCPs' });

        // Mushroom Card (replaces old step cards)
        this.mushroomCard = page.locator('.MuiCard-root').filter({ hasText: 'Create MCP Servers with Mushroom' });
        this.mushroomCardHeading = page.getByRole('heading', { name: 'Create MCP Servers with Mushroom' });
        this.mushroomCardChip = page.getByText('NEW PRODUCT');

        // Landing page actions (Get Started now opens external Mushroom URL)
        this.getStartedButton = page.getByRole('button', { name: 'GET STARTED' });

        // DataGrid
        this.mcpDataGrid = page.locator('.MuiDataGrid-root');

        // Copy button — from CopyButton.tsx
        this.copyButton = page.getByTestId('copy-button');

        // Selected MCP sidebar
        this.backButton = page.getByTestId('mcp-back-button');
        this.yourMCPsHeading = page.getByRole('heading', { name: 'Your MCPs' });
        this.sidebarCreateNewButton = page.getByTestId('mcp-sidebar-create-new-button');
        this.mcpListItems = page.getByTestId('mcp-sidebar-item');
        this.goToEmbedLink = page.getByRole('link', { name: /Go to embed/i });

        // MCP name editing
        this.mcpNameDisplay = page.getByTestId('mcp-name-display');
        this.mcpNameTextField = page.getByTestId('mcp-name-textfield');
        this.mcpNameEditButton = page.getByTestId('mcp-name-edit-button');

        // Configure / Connect tabs
        this.configureTab = page.getByRole('tab', { name: 'Configure' });
        this.connectTab = page.getByRole('tab', { name: 'Connect' });

        // Connect tab — data-testid locators from MCPConnectSettings.tsx
        this.selectClientButton = page.getByTestId('mcp-select-client-button');
        this.toggleUrlVisibilityButton = page.getByTestId('mcp-toggle-url-visibility-button');
        this.clientDialogCloseButton = page.getByTestId('mcp-client-dialog-close-button');
        this.clientSearchInput = page.getByTestId('mcp-client-search-input');
    }

    // --- Navigation ---

    async navigateFromSidebar(): Promise<void> {
        await this.page.getByTestId('project-sidebar-mcp-server-btn').first().click();
    }

    // --- Landing page methods ---

    async clickGetStarted(): Promise<void> {
        await this.getStartedButton.click();
    }

    async clickMCPRow(mcpName: string): Promise<void> {
        await this.mcpDataGrid.getByText(mcpName).click();
    }

    async copyMCPUrl(index: number = 0): Promise<void> {
        await this.copyButton.nth(index).click();
    }

    // --- Selected MCP sidebar methods ---

    async clickBackButton(): Promise<void> {
        await this.backButton.click();
    }

    async clickSidebarCreateNew(): Promise<void> {
        await this.sidebarCreateNewButton.click();
    }

    async clickGoToEmbed(): Promise<void> {
        await this.goToEmbedLink.click();
    }

    async selectMCPByName(name: string): Promise<void> {
        await this.page.getByRole('button', { name }).click();
    }

    // --- MCP name editing ---

    async editMCPName(newName: string): Promise<void> {
        await this.mcpNameDisplay.click();
        await this.mcpNameTextField.fill(newName);
        await this.mcpNameTextField.press('Enter');
    }

    // --- Configure / Connect tabs ---

    async switchToConfigureTab(): Promise<void> {
        await this.configureTab.click();
    }

    async switchToConnectTab(): Promise<void> {
        await this.connectTab.click();
    }

    // --- Connect tab: client selector ---

    async openClientSelector(): Promise<void> {
        await this.selectClientButton.click();
    }

    async searchClient(query: string): Promise<void> {
        await this.clientSearchInput.locator('input').fill(query);
    }

    async selectClientByName(clientName: string): Promise<void> {
        await this.page.getByRole('heading', { name: clientName }).first().click();
    }

    async closeClientDialog(): Promise<void> {
        await this.clientDialogCloseButton.click();
    }

    // --- Connect tab: URL visibility ---

    async toggleUrlVisibility(): Promise<void> {
        await this.toggleUrlVisibilityButton.click();
    }

    async showUrl(): Promise<void> {
        const text = await this.toggleUrlVisibilityButton.textContent();
        if (text?.trim() === 'Show') {
            await this.toggleUrlVisibilityButton.click();
        }
    }

    async hideUrl(): Promise<void> {
        const text = await this.toggleUrlVisibilityButton.textContent();
        if (text?.trim() === 'Hide') {
            await this.toggleUrlVisibilityButton.click();
        }
    }

    // --- State checks ---

    async isLoaded(): Promise<boolean> {
        return this.mainHeading.isVisible();
    }

    async hasExistingMCPs(): Promise<boolean> {
        return this.existingMCPsHeading.isVisible();
    }

    async isSelectedMCPPage(): Promise<boolean> {
        return this.yourMCPsHeading.isVisible();
    }
}

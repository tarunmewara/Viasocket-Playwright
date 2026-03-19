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

    // Step cards
    readonly stepOneCard: Locator;
    readonly stepTwoCard: Locator;
    readonly stepThreeCard: Locator;
    readonly learnMoreLink: Locator;

    // Get Started (no existing MCPs)
    readonly getStartedButton: Locator;

    // Existing MCPs DataGrid
    readonly mcpDataGrid: Locator;

    // Create New button (on landing page when MCPs exist)
    readonly createNewButton: Locator;

    // Generate Secure URL button (on new MCP form)
    readonly generateSecureUrlButton: Locator;

    // Copy buttons (generic, used in URL column and config JSON)
    readonly copyButton: Locator;

    // --- Selected MCP page (SelectedMCPPage.tsx) ---

    // Sidebar
    readonly yourMCPsHeading: Locator;
    readonly sidebarCreateNewButton: Locator;
    readonly mcpListItems: Locator;

    // MCP name editing (MCPEmbed.tsx)
    readonly mcpNameDisplay: Locator;
    readonly mcpNameTextField: Locator;

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

        // Step cards (by subtitle text)
        this.stepOneCard = page.getByText('Get Your MCP Endpoint');
        this.stepTwoCard = page.getByText('Choose Your Actions');
        this.stepThreeCard = page.getByRole('heading', { name: 'Connect Your AI Assistant' });
        this.learnMoreLink = page.getByRole('link', { name: 'Learn More' });

        // Landing page actions
        this.getStartedButton = page.getByRole('button', { name: 'Get Started' });
        this.createNewButton = page.getByRole('button', { name: 'Create New' }).and(page.locator(':not([data-testid])'));
        this.generateSecureUrlButton = page.getByRole('button', { name: 'Generate Secure URL' });

        // DataGrid
        this.mcpDataGrid = page.locator('.MuiDataGrid-root');

        // Copy button — from CopyButton.tsx
        this.copyButton = page.getByTestId('copy-button');

        // Selected MCP sidebar
        this.yourMCPsHeading = page.getByRole('heading', { name: 'Your MCPs' });
        this.sidebarCreateNewButton = page.getByRole('link', { name: 'Create New' });
        this.mcpListItems = page.getByRole('button').filter({ has: page.locator('.MuiListItemText-root') });

        // MCP name editing
        this.mcpNameDisplay = page.getByRole('heading', { level: 4 });
        this.mcpNameTextField = page.locator('#mcp-name-textfield');

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

    async clickCreateNew(): Promise<void> {
        await this.createNewButton.click();
    }

    async clickGenerateSecureUrl(): Promise<void> {
        await this.generateSecureUrlButton.click();
    }

    async clickLearnMore(): Promise<void> {
        await this.learnMoreLink.click();
    }

    async clickMCPRow(mcpName: string): Promise<void> {
        await this.mcpDataGrid.getByText(mcpName).click();
    }

    async copyMCPUrl(index: number = 0): Promise<void> {
        await this.copyButton.nth(index).click();
    }

    // --- Selected MCP sidebar methods ---

    async clickSidebarCreateNew(): Promise<void> {
        await this.sidebarCreateNewButton.click();
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

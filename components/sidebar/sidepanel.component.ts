import { Page, Locator } from '@playwright/test';

/**
 * Sidepanel Component
 * Handles: global sidebar navigation (Home, Search, Metrics, Connections, MCP Server,
 * AI Agents, Memory, Templates, Workspace Notes, Support, Lifetime Free Access,
 * Experts are live, Recent Automations, CREATE NEW FLOW)
 * Reference: ProjectSliderOptionsAndButtons.tsx, ListGroupedComponent.tsx
 */
export class SidepanelComponent {
    readonly page: Page;

    // Create New Flow button
    readonly createNewFlowButton: Locator;

    // Navigation items (by visible text inside ListItemButton)
    readonly homeLink: Locator;
    readonly searchLink: Locator;
    readonly metricsLink: Locator;
    readonly connectionsLink: Locator;
    readonly mcpServerLink: Locator;
    readonly aiAgentsLink: Locator;
    readonly memoryLink: Locator;
    readonly templatesLink: Locator;
    readonly workspaceNotesLink: Locator;
    readonly supportLink: Locator;

    // Bottom section items
    readonly lifetimeFreeAccessLink: Locator;
    readonly expertsLiveLink: Locator;
    readonly recentAutomationsLink: Locator;

    // Sidebar controls
    readonly sliderToggleButton: Locator;
    readonly advancedMenuButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid based locators
        this.createNewFlowButton = page.getByTestId('project-slider-create-flow-btn');
        this.metricsLink = page.getByTestId('project-sidebar-metrics-btn');
        this.mcpServerLink = page.getByTestId('project-sidebar-mcp-server-btn').first();
        this.aiAgentsLink = page.getByTestId('project-sidebar-ai-agents-btn');
        this.memoryLink = page.getByTestId('project-sidebar-memory-btn');
        this.workspaceNotesLink = page.getByTestId('project-sidebar-workspace-notes-btn');
        this.supportLink = page.getByTestId('project-sidebar-support-btn');
        this.lifetimeFreeAccessLink = page.getByTestId('project-sidebar-lifetime-free-btn');
        this.recentAutomationsLink = page.getByTestId('project-sidebar-recent-automations-btn');
        this.sliderToggleButton = page.getByTestId('project-slider-toggle-button');
        this.advancedMenuButton = page.getByTestId('project-slider-advanced-menu-button');

        // No data-testid in source for these items; use role + exact text (most stable without testid)
        this.homeLink = page.getByRole('link', { name: 'Home', exact: true });
        this.searchLink = page.getByRole('button', { name: /Search \(/ });
        this.connectionsLink = page.getByRole('link', { name: 'Connections', exact: true });
        this.templatesLink = page.getByRole('link', { name: 'Templates', exact: true });
        this.expertsLiveLink = page.getByRole('link', { name: 'Experts are live', exact: true });
    }

    async clickCreateNewFlow(): Promise<void> {
        await this.createNewFlowButton.click();
    }

    async navigateToHome(): Promise<void> {
        await this.homeLink.click();
    }

    async openSearchPanel(): Promise<void> {
        await this.searchLink.click();
    }

    async navigateToMetrics(): Promise<void> {
        await this.metricsLink.click();
    }

    async navigateToConnections(): Promise<void> {
        await this.connectionsLink.click();
    }

    async navigateToMCPServer(): Promise<void> {
        await this.mcpServerLink.click();
    }

    async navigateToAIAgents(): Promise<void> {
        await this.aiAgentsLink.click();
    }

    async navigateToMemory(): Promise<void> {
        await this.memoryLink.click();
    }

    async navigateToTemplates(): Promise<void> {
        await this.templatesLink.click();
    }

    async navigateToWorkspaceNotes(): Promise<void> {
        await this.workspaceNotesLink.click();
    }

    async navigateToSupport(): Promise<void> {
        await this.supportLink.click();
    }

    async clickLifetimeFreeAccess(): Promise<void> {
        await this.lifetimeFreeAccessLink.click();
    }

    async clickExpertsLive(): Promise<void> {
        await this.expertsLiveLink.click();
    }

    async toggleRecentAutomations(): Promise<void> {
        await this.recentAutomationsLink.click();
    }

    async toggleSidebar(): Promise<void> {
        await this.sliderToggleButton.click();
    }

    async isSidebarItemVisible(itemName: string): Promise<boolean> {
        return this.page.getByRole('button', { name: itemName }).isVisible();
    }
}

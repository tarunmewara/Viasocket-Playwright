import { Page, Locator } from '@playwright/test';
import { AnalyticsComponent } from '../../components/dashboard/analytics.component';
import { RenameCollectionModal } from '../../modals/rename-collection.modal';

/**
 * Dashboard Page
 * Composes: AnalyticsComponent, RenameCollectionModal
 * Page-unique: navbar actions, flow cards, collection sidebar, gallery
 */
export class DashboardPage {
    readonly page: Page;

    // Composed components / modals
    readonly analytics: AnalyticsComponent;
    readonly renameCollectionModal: RenameCollectionModal;

    // Navbar actions
    readonly walletButton: Locator;
    readonly searchButton: Locator;
    readonly backButton: Locator;
    readonly hamburgerMenuButton: Locator;
    readonly navbarAccountButton: Locator;
    readonly navbarLogoutButton: Locator;

    // Search panel (SearchPanel.tsx)
    readonly searchPanelInput: Locator;
    readonly searchPanelCloseButton: Locator;

    // Headings
    readonly metricsHeading: Locator;

    // Flow / Automation list
    readonly flowCard: Locator;
    readonly flowCardLocationLink: Locator;
    readonly recentWorkflowItem: Locator;

    // Collection sidebar
    readonly collectionAllButton: Locator;
    readonly collectionCreateButton: Locator;
    readonly collectionListItem: Locator;
    readonly createNewCollectionButton: Locator;

    // Create New Flow
    readonly createNewFlowButton: Locator;

    // Gallery
    readonly galleryScrollLeftButton: Locator;
    readonly galleryScrollRightButton: Locator;
    readonly galleryCard: Locator;

    constructor(page: Page) {
        this.page = page;

        // Compose from components/modals
        this.analytics = new AnalyticsComponent(page);
        this.renameCollectionModal = new RenameCollectionModal(page);

        // data-testid locators from NewDashboardNavbar.tsx
        this.walletButton = page.getByTestId('dashboard-wallet-button');
        this.searchButton = page.getByTestId('dashboard-search-button');
        this.backButton = page.getByTestId('dashboard-back-button');
        this.hamburgerMenuButton = page.getByTestId('hamburger-menu-button');
        this.navbarAccountButton = page.getByTestId('navbar-account-button');
        this.navbarLogoutButton = page.getByTestId('navbar-logout-button');

        // Flow cards & recent workflows
        this.flowCard = page.getByTestId('flow-card');
        this.flowCardLocationLink = page.getByTestId('flow-card-location-link');
        this.recentWorkflowItem = page.getByTestId('recent-workflow-item');

        // Collections
        this.collectionAllButton = page.getByTestId('collection-all-button');
        this.collectionCreateButton = page.getByTestId('collection-create-button');
        this.collectionListItem = page.getByTestId('collection-list-item');
        this.createNewCollectionButton = page.getByTestId('create-new-collection-button');

        // Create New Flow
        this.createNewFlowButton = page.getByTestId('project-slider-create-flow-btn');

        // Gallery
        this.galleryScrollLeftButton = page.getByTestId('gallery-scroll-left-button');
        this.galleryScrollRightButton = page.getByTestId('gallery-scroll-right-button');
        this.galleryCard = page.getByTestId('gallery-card');

        // Search panel (SearchPanel.tsx)
        this.searchPanelInput = page.getByTestId('search-panel-input').locator('input');
        this.searchPanelCloseButton = page.getByTestId('search-panel-close-button');

        // Heading
        this.metricsHeading = page.getByRole('heading', { name: 'Metrics' });
    }

    async clickWallet(): Promise<void> {
        await this.walletButton.click();
    }

    async openSearchPanel(): Promise<void> {
        await this.searchButton.click();
    }

    async searchFlows(query: string): Promise<void> {
        await this.searchPanelInput.fill(query);
    }

    async closeSearchPanel(): Promise<void> {
        await this.searchPanelCloseButton.click();
    }

    async selectSearchResult(index: number = 0): Promise<void> {
        await this.page.getByTestId('search-flow-result').nth(index).click();
    }

    async goBack(): Promise<void> {
        await this.backButton.click();
    }

    async clickFlowCard(index: number = 0): Promise<void> {
        await this.flowCard.nth(index).click();
    }

    async clickRecentWorkflow(index: number = 0): Promise<void> {
        await this.recentWorkflowItem.nth(index).click();
    }

    async createCollection(): Promise<void> {
        await this.collectionCreateButton.click();
    }

    async selectCollection(index: number = 0): Promise<void> {
        await this.collectionListItem.nth(index).click();
    }

    async renameCollection(newName: string): Promise<void> {
        await this.renameCollectionModal.renameCollection(newName);
    }

    async cancelCollectionRename(): Promise<void> {
        await this.renameCollectionModal.cancel();
    }

    // --- Navigation ---

    async navigateToProject(projectId: string): Promise<void> {
        await this.page.goto(`/projects/${projectId}`);
    }

    // --- Create New Flow ---

    async clickCreateNewFlow(): Promise<void> {
        await this.createNewFlowButton.click();
    }

    // --- Filter tabs (delegated) ---

    async selectFilter(
        filter: 'all' | 'active' | 'draft' | 'failed' | 'paused' | 'trash'
    ): Promise<void> {
        await this.analytics.selectFilter(filter);
    }

    async selectAllWorkflows(): Promise<void> {
        await this.analytics.selectFilter('all');
    }

    async selectLive(): Promise<void> {
        await this.analytics.selectFilter('active');
    }

    async selectDrafted(): Promise<void> {
        await this.analytics.selectFilter('draft');
    }

    async selectError(): Promise<void> {
        await this.analytics.selectFilter('failed');
    }

    async selectPaused(): Promise<void> {
        await this.analytics.selectFilter('paused');
    }

    async selectTrashed(): Promise<void> {
        await this.analytics.selectFilter('trash');
    }

    // --- Analytics time period (delegated) ---

    async selectTimePeriod(period: 'today' | 'last7days'): Promise<void> {
        await this.analytics.selectTimePeriod(period);
    }

    async selectToday(): Promise<void> {
        await this.analytics.selectToday();
    }

    async selectLast7Days(): Promise<void> {
        await this.analytics.selectLast7Days();
    }

    // --- Analytics metrics (read-only) ---

    async getRunsCount(): Promise<string | null> {
        return this.page.getByText(/^Runs:/).textContent();
    }

    async getSuccessPercent(): Promise<string | null> {
        return this.page.getByText(/^Success:/).textContent();
    }

    async getFailurePercent(): Promise<string | null> {
        return this.page.getByText(/^Failure:/).textContent();
    }

    async getFlowCardCount(): Promise<number> {
        return this.flowCard.count();
    }

    async scrollGalleryLeft(): Promise<void> {
        await this.galleryScrollLeftButton.click();
    }

    async scrollGalleryRight(): Promise<void> {
        await this.galleryScrollRightButton.click();
    }
}

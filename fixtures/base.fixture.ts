import { test as base } from '@playwright/test';

// Page objects
import { DashboardPage } from '../pages/dashboard/dashboard.page';
import { WorkspacePage } from '../pages/dashboard/workspace.page';
import { WorkflowPage } from '../pages/workflow/workflow.page';
import { TriggersPage } from '../pages/workflow/triggers.page';
import { LogsPage } from '../pages/workflow/logs.page';
import { FlowOptionsPage } from '../pages/workflow/flow-options.page';
import { CollectionPage } from '../pages/collection/collection.page';
import { ConnectionsPage } from '../pages/connections/connections.page';
import { SettingsPage } from '../pages/settings/settings.page';
import { TemplatesPage } from '../pages/templates/templates.page';
import { TransferPage } from '../pages/transfer/transfer.page';
import { InterfaceConfigPage } from '../pages/interface/interface-config.page';
import { MCPPage } from '../pages/mcp/mcp.page';
import { MetricsPage } from '../pages/metrics/metrics.page';
import { OAuthPage } from '../pages/oauth/oauth.page';

// Define the types for our custom fixtures
type MyFixtures = {
    dashboard: DashboardPage;
    workspace: WorkspacePage;
    workflow: WorkflowPage;
    triggers: TriggersPage;
    logs: LogsPage;
    flowOptions: FlowOptionsPage;
    collection: CollectionPage;
    connections: ConnectionsPage;
    settings: SettingsPage;
    templates: TemplatesPage;
    transfer: TransferPage;
    interfaceConfig: InterfaceConfigPage;
    mcp: MCPPage;
    metrics: MetricsPage;
    oauth: OAuthPage;
};

// Extend the base test with our custom fixtures
export const test = base.extend<MyFixtures>({
    dashboard: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    workspace: async ({ page }, use) => {
        await use(new WorkspacePage(page));
    },
    workflow: async ({ page }, use) => {
        await use(new WorkflowPage(page));
    },
    triggers: async ({ page }, use) => {
        await use(new TriggersPage(page));
    },
    logs: async ({ page }, use) => {
        await use(new LogsPage(page));
    },
    flowOptions: async ({ page }, use) => {
        await use(new FlowOptionsPage(page));
    },
    collection: async ({ page }, use) => {
        await use(new CollectionPage(page));
    },
    connections: async ({ page }, use) => {
        await use(new ConnectionsPage(page));
    },
    settings: async ({ page }, use) => {
        await use(new SettingsPage(page));
    },
    templates: async ({ page }, use) => {
        await use(new TemplatesPage(page));
    },
    transfer: async ({ page }, use) => {
        await use(new TransferPage(page));
    },
    interfaceConfig: async ({ page }, use) => {
        await use(new InterfaceConfigPage(page));
    },
    mcp: async ({ page }, use) => {
        await use(new MCPPage(page));
    },
    metrics: async ({ page }, use) => {
        await use(new MetricsPage(page));
    },
    oauth: async ({ page }, use) => {
        await use(new OAuthPage(page));
    },
});

export { expect } from '@playwright/test';

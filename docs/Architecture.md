# Viasocket Playwright Test Framework Architecture

## Executive Summary

This is a **production-ready, enterprise-grade Playwright testing framework** designed for the Viasocket platform. The architecture follows the **Page Object Model (POM)** pattern with enhanced modularity, reusability, and maintainability.

---

## Architecture Validation

### Strengths of Current Structure

| Aspect | Status | Notes |
|--------|--------|-------|
| **POM Pattern** | Strong | Well-organized page objects in domain folders |
| **Fixture-based DI** | Good | Centralized dependency injection via `base.fixture.ts` |
| **Component Modularity** | Good | UI fragments properly separated (JSCode, Webhook, Logs) |
| **Test Organization** | Adequate | Tests separated from page objects |
| **Auth Setup** | Good | Proper authentication with token bypass support |

### Critical Gaps Addressed

| Issue | Impact | Solution Implemented |
|-------|--------|---------------------|
| No BasePage abstraction | High | Created `BasePage` with shared wait patterns |
| Hardcoded selectors | Medium | Centralized selectors in `constants/selectors.ts` |
| Hardcoded test data | Medium | Created `TestDataUtils` with generators |
| No API helpers | Medium | Created `ApiHelpers` for test setup/teardown |
| Inconsistent test patterns | High | Updated all tests to use fixture pattern |
| Missing error handling | Medium | Added `safeClick`, `safeFill` with visibility checks |

---

## Directory Structure

```
Viasocket-Playwright/
├── auth/                              # Authentication setup
│   └── global-setup.ts                # Playwright globalSetup — handles login & session persistence
│
├── components/                        # Reusable UI component abstractions
│   ├── common/                        # Shared components
│   │   ├── close-slider.component.ts  # Slider back/close/next buttons
│   │   └── copy-button.component.ts   # Copy-to-clipboard button
│   ├── connections/                   # Connection panel components
│   │   ├── connection-drawer.component.ts    # Connection detail drawer
│   │   ├── auth-level-selector.component.ts  # Access level selector (org/collection/flow)
│   │   └── service-drawer.component.ts       # Service-level connection drawer
│   ├── dashboard/                     # Dashboard components
│   │   ├── support-drawer.component.ts       # Support drawer (contact, live chat)
│   │   └── analytics.component.ts            # Analytics time period, filter tabs
│   ├── logs/                          # Logs components
│   │   └── logs-filter.component.ts   # Filter, rerun, date pickers
│   ├── navbar/                        # Top navigation bar
│   │   ├── workflow-navbar.component.ts      # View tabs, refresh, resume, flow title
│   │   └── flow-breadcrumb.component.ts      # Breadcrumb navigation (home, project)
│   ├── publish/                       # Publish components
│   │   ├── publish-controls.component.ts     # Discard, go live, toggle draft/published
│   │   └── template-preview.component.ts     # Zoom, category, instructions, update/unpublish
│   ├── settings/                      # Settings components
│   │   ├── workspace-settings.component.ts   # Workspace name/timezone/industry/domain
│   │   ├── billing.component.ts              # Billing plans, change plan
│   │   └── offers.component.ts               # Promo cards, partner discounts
│   ├── sidebar/                       # Global sidebar navigation
│   │   └── sidepanel.component.ts     # Home, Search, Connections, MCP, Settings links
│   ├── transfer/                      # Data transfer components
│   │   ├── transfer-review.component.ts      # Review data, pagination, refresh
│   │   └── transfer-status.component.ts      # Status, stop, transfer again
│   └── workflow/                      # Workflow-specific components
│       ├── js-code.component.ts       # JS Code action, code editor
│       ├── webhook.component.ts       # Webhook trigger selection
│       ├── cron.component.ts          # Cron trigger configuration
│       ├── condition.component.ts     # "Run Flow If" condition toggle/input
│       └── logs-viewer.component.ts   # Log accordion, expand/collapse, return to flow
│
├── modals/                            # Modal dialog abstractions (14 modals)
│   ├── create-collection.modal.ts     # Create collection (name, suggestions, submit)
│   ├── rename-collection.modal.ts     # Rename collection (input, RENAME button)
│   ├── create-org.modal.ts            # Create organization (workspace name, industry, domain)
│   ├── delete-flow.modal.ts           # Delete flow confirmation
│   ├── duplicate-flow.modal.ts        # Duplicate/move/create flow/template
│   ├── share-flow.modal.ts            # Share flow (copy link, create template)
│   ├── publish-confirm.modal.ts       # Publish confirmation
│   ├── feedback.modal.ts              # Feedback (idea/issue, text, submit)
│   ├── go-live-confirm.modal.ts       # Go live confirmation (Yes)
│   ├── stop-transfer.modal.ts         # Stop transfer confirmation
│   ├── delete-auth.modal.ts           # Delete auth/connection confirmation
│   ├── auth-success.modal.ts          # Auth success popup (done, edit title)
│   ├── leave-workspace.modal.ts       # Leave workspace confirmation
│   ├── mcp-client-select.modal.ts     # MCP client selection dialog
│   └── update-connection.modal.ts     # Update connection (reason, send request)
│
├── pages/                             # Page Object classes (organized by feature)
│   ├── collection/
│   │   └── collection.page.ts         # Collection listing, context menu
│   ├── connections/
│   │   └── connections.page.ts        # Connection listing, add, toggle view
│   ├── dashboard/
│   │   ├── dashboard.page.ts          # Org selection, flow cards, wallet, search
│   │   └── workspace.page.ts          # Workspace CRUD, switch, profile menu
│   ├── interface/
│   │   └── interface-config.page.ts   # Embed display config (23 toggles/inputs)
│   ├── mcp/
│   │   └── mcp.page.ts               # MCP server client selection
│   ├── oauth/
│   │   └── oauth.page.ts             # OAuth integrations, URI management
│   ├── settings/
│   │   └── settings.page.ts          # Workspace settings, billing, offers
│   ├── templates/
│   │   └── templates.page.ts         # Template search, sort, filters
│   ├── transfer/
│   │   └── transfer.page.ts          # Data transfer orchestration
│   └── workflow/
│       ├── workflow.page.ts           # Flow builder (actions, test, save, go live)
│       ├── triggers.page.ts           # Trigger selection (webhook, cron, plugin)
│       ├── logs.page.ts               # Logs page (filter, rerun, pause/active)
│       └── flow-options.page.ts       # Flow more options menu
│
├── fixtures/                          # Playwright custom fixtures
│   └── base.fixture.ts               # Extended test object with shared page objects
│
├── utils/                             # Shared utility functions
│   ├── navigation.ts                  # URL navigation helpers
│   └── test-data.ts                   # Random generators, test data helpers
│
├── tests/                             # Test spec files organized by feature
│   ├── workflow/                      # Workflow & trigger tests
│   │   ├── triggers.spec.ts
│   │   ├── workflow.spec.ts
│   │   ├── logs.spec.ts
│   │   ├── publish.spec.ts
│   │   └── flow-options.spec.ts
│   ├── collection/
│   │   └── collection.spec.ts
│   ├── workspace/
│   │   └── workspace.spec.ts
│   ├── settings/
│   │   └── settings.spec.ts
│   ├── connections/
│   │   └── connections.spec.ts
│   ├── transfer/
│   │   └── transfer.spec.ts
│   └── interface/
│       └── interface-config.spec.ts
│
├── docs/                              # Documentation
│   ├── Architecture.md                # ← This file
│   └── Ai-INSTRUCTION.md             # AI codegen rules & fixture reference
│
├── playwright.config.ts               # Playwright configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies
└── .env                               # Environment variables (not committed)
```

---

## Key Design Patterns

### 1. BasePage Pattern

All pages extend `BasePage` for shared functionality:

```typescript
export abstract class BasePage {
    protected readonly page: Page;
    protected readonly defaultTimeout: number = 10000;

    protected async safeClick(locator: Locator): Promise<void>
    protected async safeFill(locator: Locator, value: string): Promise<void>
    protected async waitForLoadingComplete(): Promise<void>
    protected async waitForNetworkIdle(): Promise<void>
    protected async assertVisible(locator: Locator): Promise<void>
}
```

### 2. Fixture Dependency Injection

```typescript
// tests/example.spec.ts
import { test, expect } from '../fixtures/base.fixture';

test('create flow', async ({ dashboard, triggers, workflow }) => {
    await dashboard.navigateToOrg();
    await dashboard.selectOrganization();
    // Page objects auto-instantiated via fixtures
});
```

### 3. Component Pattern (for complex UI)

```typescript
// pages/workflow/WorkflowPage.ts
export class WorkflowPage extends BasePage {
    public readonly jscode: JSCodeComponent;  // Exposed for method chaining
    public readonly logs: LogsComponent;
}

// Usage in test:
await workflow.jscode.selectAction();
await workflow.jscode.writejscode('return true');
```

### 4. Constants-Driven Selectors

```typescript
// constants/selectors.ts
export const TRIGGER_SELECTORS = {
    WEBHOOK_OPTION: '[role="option"]:has-text("When a webhook is triggered")',
    CRON_BTN: 'button:has-text("Run automatically at defined")',
} as const;
```

---

## Usage Patterns

### Basic Test Pattern

```typescript
import { test, expect } from '../fixtures/base.fixture';
import { TestDataUtils } from '../utils/testData.utils';

test.describe('Collection Tests', () => {
    test.beforeEach(async ({ dashboard }) => {
        await dashboard.navigateToOrg();
        await dashboard.selectOrganization();
    });

    test('create collection with unique name', async ({ collection }) => {
        const name = TestDataUtils.collectionName();
        await collection.clickCreateCollection();
        await collection.fillCollectionName(name);
        await collection.submitCreateCollection();
        // Assertions...
    });
});
```

### API Setup Pattern (for test data)

```typescript
test('create flow via UI after API setup', async ({ api, dashboard, workflow }) => {
    // Setup via API
    const collection = await api.createCollection('Test Collection');
    const flow = await api.createFlow('Test Flow', collection.id);
    
    // Navigate and verify via UI
    await dashboard.navigateToOrg();
    // ... test flow
    
    // Cleanup via API
    await api.deleteFlow(flow.id);
    await api.deleteCollection(collection.id);
});
```

---

## Reusability Guidelines

### Creating New Page Objects

```typescript
import { BasePage } from '../base/BasePage';
import { NEW_FEATURE_SELECTORS } from '../../constants/selectors';

export class NewFeaturePage extends BasePage {
    private readonly someElement: Locator;

    constructor(page: Page) {
        super(page);
        this.someElement = page.locator(NEW_FEATURE_SELECTORS.SOME_ELEMENT);
    }

    async doSomething(): Promise<void> {
        await this.safeClick(this.someElement);
        await this.waitForLoadingComplete();
    }
}
```

### Adding to Fixtures

```typescript
// fixtures/base.fixture.ts
type MyFixtures = {
    // ... existing fixtures
    newFeature: NewFeaturePage;
};

export const test = base.extend<MyFixtures>({
    // ... existing fixtures
    newFeature: async ({ page }, use) => {
        await use(new NewFeaturePage(page));
    },
});
```

---

## Best Practices

1. **Always extend BasePage** - Never create standalone page classes
2. **Use safeClick/safeFill** - Never use raw `click()` or `fill()`
3. **Wait after actions** - Call `waitForLoadingComplete()` after save/submit
4. **Use TestDataUtils** - Never hardcode test data
5. **Use constants** - Never hardcode selectors or strings
6. **Component pattern** - Break complex UIs into components
7. **API for setup** - Use `api` fixture for test data setup when possible

---

## Coverage Assessment

### Current Coverage (mapped from `socket-flow-UI` data-testid)

| Module | Page Object | data-testid Count | Status |
|--------|-------------|-------------------|--------|
| Authentication | `ConnectionsPage` | ~20 | Full — CRUD, auth levels, service drawer, delete |
| Dashboard | `DashboardPage` | ~18 | Full — org cards, analytics, filter tabs, support, create org |
| Workspaces | `WorkspacePage` | ~15 | Full — CRUD, profile menu, beta toggle, rename, logout |
| Collections | `CollectionPage` | ~6 | Full — create, rename, trash, pause/active |
| Sidepanel | `SidepanelPage` | ~8 | Full — navigation links |
| Flow Builder | `WorkflowPage` | ~12 | Full — navbar, breadcrumb, assign expert, slider controls |
| Triggers | `TriggersPage` | ~10 | Full — webhook, cron, conditions |
| Logs | `LogsPage` | ~16 | Full — filter, rerun, date range, expand/collapse |
| Flow Options | `FlowOptionsPage` | ~10 | Full — delete, duplicate, move, share |
| Publish | `PublishPage` | ~14 | Full — go live, discard, template preview, feedback |
| Interface Config | `InterfaceConfigPage` | ~23 | Full — embed display toggles, webhooks, layout |
| Transfer | `TransferPage` | ~13 | Full — review, status, stop/resume, pagination |
| Settings | `SettingsPage` | ~14 | Full — workspace settings, billing, offers, partners |
| Templates | `TemplatesPage` | ~4 | Full — search, sort, filter |
| MCP | `MCPPage` | ~4 | Full — client selection, URL visibility |
| Components | `JSCode`, `Webhook`, `Logs` | N/A | Composed into parent pages |

### Recommended Additions

1. **More Action Types**: Email, Transform, Filter, Delay components (add as `components/`)
2. **OAuth/Integration Page**: `oauthConfig.tsx` has data-testids — add `OAuthPage` when needed
3. **Developer Hub**: `developerHub/` has extensive data-testids — add when DH testing begins
4. **Error Handling Tests**: Validation, error messages
5. **Data-Driven Tests**: Parameterized test cases
6. **Visual Regression**: Screenshot comparisons

---

## Validation Checklist

- [x] All pages extend `BasePage`
- [x] All page objects use `data-testid` locators (`page.getByTestId()`)
- [x] All page objects use `safeClick`/`safeFill` patterns
- [x] All 17 fixtures registered in `base.fixture.ts`
- [x] `TestDataUtils` provides data generators
- [x] `ApiHelpers` available for API operations
- [x] Consistent method naming (camelCase, async)
- [x] Proper TypeScript types throughout
- [x] `tsconfig.json` includes all source directories
- [x] All `socket-flow-UI` interactive pages with `data-testid` mapped to POM
- [x] `AI_INSTRUCTIONS.md` fixtures table updated
- [x] No unused imports across page objects

---

## Conclusion

This architecture is **enterprise-ready** and ensures:

- **Maintainability**: Single source of truth for selectors and patterns
- **Reusability**: Shared base class and utilities
- **Modularity**: Component pattern for complex UIs
- **Scalability**: Clear structure for adding new features
- **Testability**: DI via fixtures, API helpers for setup

The framework is ready to support comprehensive test coverage for the entire Viasocket platform.

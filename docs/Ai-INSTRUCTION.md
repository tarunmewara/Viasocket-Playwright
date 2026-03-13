# AI Instructions — Playwright Test Generation

---

## Strict AI Rules

- **Never guess.** If intent, constraints, or compatibility with the system are unclear, ask questions before acting.
- **Never write raw selectors in test files.** All selectors belong in POM classes.
- **Always use existing POM methods** if one exists for the action. Check page/modal/component classes first if you dont find then make it from the socket-flow-UI code.
- **Never use `page.waitForTimeout()`.** Use `expect().toBeVisible()` or `waitFor()` instead.
- **Prefer `data-testid`** over any other locator strategy.
- **Do not invent new selectors** unless no existing POM method or locator covers the element.
- **Never import from `@playwright/test`** directly. Always import from `fixtures/base.fixture`.
- **Never hardcode** agent names, workspace names, or org IDs. Use `process.env.*`.
- **If the request conflicts with these rules, pause and ask** before proceeding.
- **never change code in socket-flow-UI**
- **Always update `Architecture.md`** immediately if any changes are made to the project folder structure or POM hierarchy.

---

## 2. Codegen to POM Conversion

The developer provides raw Playwright Codegen output. Convert it to fixture-based POM style.

**Codegen input:**

```typescript
import { test, expect } from "@playwright/test";
test.use({ storageState: "auth.json" });
test("test", async ({ page }) => {
  await page.goto("https://flow.viasocket.com/");
  await page.getByRole("cell", { name: "My Agent" }).click();
  await page.goto("https://flow.viasocket.com/");
  await page.getByRole("button", { name: "Create New Flow" }).click();
  await page.getByText("Webhook").click();
  await page.getByRole("button", { name: "JS Code" }).click();
  await page.locator(".cm-content").fill("return true");
  await page.getByRole("button", { name: "Save" }).click();
});
```

**Converted output:**

```typescript
import { test, expect } from "../../fixtures/base.fixture";

test("TC-FLOW-01: Create a flow with JS Code action", async ({
  dashboard,
  triggers,
  workflow,
}) => {
  await dashboard.navigateToOrg();
  await dashboard.selectOrganization();
  await dashboard.clickCreateNewFlow();
  await triggers.webhook.select();
  await workflow.jscode.selectAction();
  await workflow.jscode.writejscode("return true");
  await workflow.clickSave();
});
```

**Conversion rules:**

1. `import from '@playwright/test'` &rarr; `import from 'fixtures/base.fixture'`
2. Remove `test.use({ storageState })` &mdash; fixture handles auth
3. `async ({ page })` &rarr; `async ({ dashboard, sidepanel, triggers, workflow })`
4. `page.goto(url)` &rarr; `dashboard.navigateToOrg()` or appropriate POM method
5. Inline selectors &rarr; POM method calls
6. Hardcoded names &rarr; `process.env.*`
7. Add `TC-<FEATURE>-<##>:` test name
8. If no POM method exists, **create one** in the appropriate class

---

## 3. Test File Template

```typescript
import { test, expect } from "<relative-path>/fixtures/base.fixture";

test.beforeEach(async ({ dashboard }) => {
  await dashboard.navigateToOrg();
  await dashboard.selectOrganization();
});

test.describe("Feature Area - Workflow Type", () => {
  test("TC-FEAT-01: Description of what is verified", async ({
    dashboard,
    triggers,
    workflow,
  }) => {
    await dashboard.clickCreateNewFlow();
    await triggers.webhook.select();
    await workflow.jscode.selectAction();
    await workflow.jscode.writejscode("return true");
    await workflow.clickSave();
    // Add assertions
  });
});
```

**Rules:**

- Import from `fixtures/base.fixture` only
- Group tests in `test.describe` blocks
- Use `test.beforeEach` for shared navigation
- Use `test.afterEach` for cleanup that must run even on failure
- Declare test data as `const` at top of file using `process.env.*`
- One assertion focus per test

---

## 4. Available Fixtures

| Fixture           | Type                  | Use for                                              |
| ----------------- | --------------------- | ---------------------------------------------------- |
| `dashboard`       | `DashboardPage`       | Org selection, create flow, analytics, support        |
| `workflow`        | `WorkflowPage`        | Actions, testing, saving, going live, navbar, breadcrumb |
| `triggers`        | `TriggersPage`        | Selecting and configuring triggers                    |
| `workspace`       | `WorkspacePage`       | Workspace CRUD, profile menu, beta toggle             |
| `collection`      | `CollectionPage`      | Collections management                                |
| `logs`            | `LogsPage`            | Log filtering, rerun, expand/collapse, date range     |
| `flowOptions`     | `FlowOptionsPage`     | Delete, duplicate, move, share flow                   |
| `publish`         | `PublishPage`         | Go live, discard, template preview, feedback modal    |
| `interfaceConfig` | `InterfaceConfigPage` | Embed/interface display configuration                 |
| `transfer`        | `TransferPage`        | Data transfer review, status, stop/resume             |
| `settings`        | `SettingsPage`        | Workspace settings, billing, offers, partner discounts|
| `sidepanel`       | `SidepanelPage`       | Navigation (Home, Search, Connections, etc.)          |
| `templates`       | `TemplatesPage`       | Template search, sort, filter                         |
| `mcp`             | `MCPPage`             | MCP server client selection and configuration         |
| `connections`     | `ConnectionsPage`     | Connection CRUD, auth levels, service drawer          |
| `page`            | `Page`                | Raw Playwright page (low-level assertions only)       |
| `context`         | `BrowserContext`       | Multi-tab tests                                       |

---

## 5. POM Interaction Rules

### Navigation

```
dashboard.navigateToOrg()
  -> dashboard.selectOrganization()
    -> dashboard.clickCreateNewFlow() -> TriggersPage
      -> triggers.webhook.select()    -> WorkflowPage
        -> workflow.jscode.selectAction()
        -> workflow.jscode.writejscode(code)
        -> workflow.clickSave()
        -> workflow.clickGoLive()
```

### Access Rules

- **Triggers:** `triggers.webhook.select()`, `triggers.hideFullscreen()`
- **Workflow:** `workflow.jscode.selectAction()`, `workflow.jscode.writejscode()`, `workflow.clickSave()`, `workflow.clickGoLive()`
- **Modals:** Handled within POM methods (e.g., `workflow.confirmGoLiveYes()`)
- Never call `page.goto()` directly (use `dashboard.navigateToOrg()`)
- Never instantiate page objects manually

### POM Method Naming

| Action         | Pattern                         | Example                             |
| -------------- | ------------------------------- | ----------------------------------- |
| Click          | `click<Element>()`              | `clickSave()`                       |
| Fill           | `fill<Field>(value)`            | `fillPrompt(role, goal, inst)`      |
| Select         | `select<Thing>(value)`          | `selectServiceProvider('Openai')`   |
| Toggle         | `check/uncheck/toggle<Thing>()` | `toggleGuardrails()`                |
| Get value      | `get<Field>Value()`             | `getRoleValue()`                    |
| Assert visible | `expect<Thing>Visible()`        | `expectRoleVisible()`               |
| Assert hidden  | `expect<Thing>NotVisible()`     | `expectAgentSetupGuideNotVisible()` |
| Open           | `open<Section>()`               | `openInstructionsSection()`         |
| Delete         | `delete<Thing>(id)`             | `deleteAgentByName(name)`           |

---

## 11. Reference Example

```typescript
import { test, expect } from "../../../fixtures/base.fixture";

test.describe("Workflow - Happy Path", () => {
  test.beforeEach(async ({ dashboard }) => {
    await dashboard.navigateToOrg();
    await dashboard.selectOrganization();
  });

  test("TC-WF-01: Create and Go Live", async ({
    dashboard,
    triggers,
    workflow,
  }) => {
    await dashboard.clickCreateNewFlow();
    await triggers.webhook.select();
    await triggers.hideFullscreen();

    await workflow.jscode.selectAction();
    await workflow.jscode.writejscode("return true");
    await workflow.clickSave();
    await workflow.clickGoLive();
    await workflow.confirmGoLiveYes();

    // Assertions follow...
  });
});
```

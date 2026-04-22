# Playwright Setup & Commands Guide

---

## Prerequisites

- **Node.js** v18+ installed
- **npm** or **yarn** package manager

---

## 1. Installation

```bash
# Navigate to the Playwright project
cd Viasocket-Playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## 2. Authentication Bypass (Storage State)

This project **skips the login UI entirely** by reusing a saved browser session (cookies, localStorage, sessionStorage). Playwright loads this session before every test so tests start already authenticated.

### How It Works

1. **`playwright.config.ts`** reads the storage state path from the `.env` file (falls back to `playwright/.auth/user.json`):

   ```typescript
   const storageState = process.env.STORAGE_STATE ?? 'playwright/.auth/user.json';
   ```

2. The `use.storageState` option injects this saved session into every browser context automatically:

   ```typescript
   use: {
       baseURL: 'https://flow.viasocket.com',
       storageState,
   },
   ```

3. Every test launches with the browser already logged in — **no login page interaction needed**.

### How to Generate `user.json` (One-Time Setup)

You need to capture the authenticated session once and save it to `playwright/.auth/user.json`.

#### Option A — Using Playwright Codegen (Recommended)

```bash
# 1. Launch codegen — a browser window opens
npx playwright codegen https://flow.viasocket.com

# 2. Log in manually in the browser window

# 3. Once logged in, open the browser DevTools console and run:
#    copy(JSON.stringify({ cookies: await cookieStore.getAll(), origins: [] }))

# OR use Playwright CLI to save storage state directly:
npx playwright open https://flow.viasocket.com --save-storage=playwright/.auth/user.json
```

#### Option B — Using Browser DevTools

1. Open `https://flow.viasocket.com` in Chrome and log in normally.
2. Open DevTools → **Application** tab.
3. Copy all **Cookies** and **Local Storage** entries.
4. Create `playwright/.auth/user.json` matching this structure:

```json
{
  "cookies": [
    {
      "name": "cookie_name",
      "value": "cookie_value",
      "domain": ".viasocket.com",
      "path": "/",
      "expires": -1,
      "httpOnly": false,
      "secure": true,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "https://flow.viasocket.com",
      "localStorage": [
        { "name": "key", "value": "value" }
      ]
    }
  ]
}
```

#### Option C — Using a Script

```bash
# Launch a persistent browser, log in manually, then Playwright saves state on close
npx playwright open https://flow.viasocket.com/org --save-storage=playwright/.auth/user.json
```

### Setting Up the `.env` File

Create a `.env` file in the project root (`Viasocket-Playwright/.env`):

```env
# Auth bypass — path to saved browser session
STORAGE_STATE=playwright/.auth/user.json

# Test environment variables
ORG_ID=<your-org-id>
WORKSPACE_NAME=<your-workspace-name>
AGENT_NAME=<your-agent-name>
```

> **Security Note:** Both `.env` and `playwright/.auth/user.json` are gitignored. Never commit session data or secrets.

### Session Expiry

- If tests start failing with auth errors, your session has likely expired.
- **Re-generate `user.json`** using any of the methods above.
- Tip: Use a long-lived session or service account for CI.

---

## 3. Commands Reference

### Run All Tests

```bash
npx playwright test
```

### Run a Specific Test File

```bash
npx playwright test tests/workflow/workflow.spec.ts
```

### Run Tests by File Name Pattern

```bash
npx playwright test workflow
npx playwright test collection
```

### Run a Single Test by Title

```bash
npx playwright test -g "TC-FLOW-01"
```

### Run Tests in a Specific Folder

```bash
npx playwright test tests/workflow/
```

---

### Headed Mode (See the Browser)

```bash
npx playwright test --headed
```

### Debug Mode (Step Through with Inspector)

```bash
npx playwright test --debug
```

This opens the **Playwright Inspector** — you can step through each action, see selectors, and inspect the page live.

### Debug a Specific Test

```bash
npx playwright test tests/workflow/workflow.spec.ts --debug
```

### UI Mode (Interactive Test Runner)

```bash
npx playwright test --ui
```

Opens an interactive GUI where you can browse, run, and watch tests with time-travel debugging.

---

### Trace Viewer (Post-Mortem Debugging)

Enable tracing in `playwright.config.ts`:

```typescript
use: {
    trace: 'on',          // 'on' | 'off' | 'on-first-retry' | 'retain-on-failure'
}
```

Then view the trace after a test run:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

---

### HTML Report

```bash
# Run tests (report is generated automatically)
npx playwright test

# Open the HTML report
npx playwright show-report
```

---

### Parallel / Worker Control

```bash
# Run with a specific number of workers
npx playwright test --workers=4

# Run tests serially (1 worker)
npx playwright test --workers=1
```

---

### Retry Failed Tests

```bash
npx playwright test --retries=2
```

---

### Run with Screenshots / Video / Trace Enabled

```bash
# Screenshots on failure
npx playwright test --screenshot=on

# Video recording
npx playwright test --video=on

# Full trace
npx playwright test --trace=on
```

---

### Codegen (Record New Tests)

```bash
# Record interactions against the live site (with saved auth)
npx playwright codegen https://flow.viasocket.com --load-storage=playwright/.auth/user.json
```

This opens a browser **already logged in** and records your actions as Playwright code.

---

## 4. Quick Command Cheat Sheet

| Command | What It Does |
|---|---|
| `npx playwright test` | Run all tests (headless) |
| `npx playwright test --headed` | Run all tests with visible browser |
| `npx playwright test --debug` | Run with Playwright Inspector |
| `npx playwright test --ui` | Open interactive UI mode |
| `npx playwright test <file>` | Run a specific test file |
| `npx playwright test -g "<title>"` | Run test matching title |
| `npx playwright test --workers=1` | Run tests serially |
| `npx playwright test --retries=2` | Retry failed tests up to 2 times |
| `npx playwright test --trace=on` | Run with trace recording |
| `npx playwright show-report` | Open the HTML test report |
| `npx playwright show-trace <path>` | View a recorded trace file |
| `npx playwright codegen <url>` | Record a new test via browser |
| `npx playwright codegen <url> --load-storage=playwright/.auth/user.json` | Record with auth session loaded |
| `npx playwright open <url> --save-storage=playwright/.auth/user.json` | Save auth session from browser |
| `npx playwright install` | Install/update Playwright browsers |

---

## 5. Troubleshooting

| Problem | Solution |
|---|---|
| Tests fail with 401 / redirect to login | Session expired — re-generate `user.json` |
| `storageState` file not found | Ensure `playwright/.auth/user.json` exists and `.env` path is correct |
| Browser not installed | Run `npx playwright install` |
| Tests timeout | Increase `timeout` in `playwright.config.ts` (currently 60s) |
| Port conflicts on CI | Use `--workers=1` to reduce parallel load |
| Flaky element interactions | Use `expect(locator).toBeVisible()` before acting — never use `waitForTimeout` |

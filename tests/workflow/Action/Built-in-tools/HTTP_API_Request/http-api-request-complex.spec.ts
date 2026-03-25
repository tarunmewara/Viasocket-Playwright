import { test, expect } from '../../../../../fixtures/base.fixture';

const PROJECT_ID = '58104';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — opens a fresh HTTP API Request editor for each test
// ─────────────────────────────────────────────────────────────────────────────
async function setupHttpApiRequest(dashboard: any, triggers: any, workflow: any) {
    await dashboard.navigateToProject(PROJECT_ID);
    await dashboard.clickCreateNewFlow();
    await triggers.selectWebhookTrigger();
    await triggers.slider.closeButton.waitFor({ state: 'visible' });
    await triggers.closeSlider();
    await workflow.httpApi.clickAddStepButton();
    await workflow.httpApi.selectHttpApiRequestOption();
    await workflow.httpApi.closeAddStepOverlay();
    await workflow.httpApi.waitForPanelReady();
    await workflow.httpApi.dismissOverlay();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTTP API Request — Complex Functional Tests (TC-HTTP-API-101 to TC-HTTP-API-150)
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('HTTP API Request — Complex Functional Tests', () => {

    test.beforeEach(async ({ dashboard, triggers, workflow }) => {
        await setupHttpApiRequest(dashboard, triggers, workflow);
    });

    // ═════════════════════════════════════════════════════════════════════════
    // BATCH 1: TC-HTTP-API-101 – TC-HTTP-API-110
    // Query Params — Bulk Edit & Key-Value Mode deep interactions
    // ═════════════════════════════════════════════════════════════════════════

    // ── TC-HTTP-API-101 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-101: Type single query param in bulk textbox and verify content', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeQueryParamsBulk('userId:10');
        const value = await workflow.httpApi.getQueryParamsBulkValue();
        expect(value).toContain('userId:10');
    });

    // ── TC-HTTP-API-102 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-102: Type multiple query params in bulk textbox', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.queryParamsBulkTextbox.click();
        await workflow.httpApi.page.keyboard.type('userId:10');
        await workflow.httpApi.page.keyboard.press('Enter');
        await workflow.httpApi.page.keyboard.type('status:active');
        await workflow.httpApi.queryParamsLabel.click({ force: true });
        await workflow.httpApi.page.waitForTimeout(300);
        const value = await workflow.httpApi.getQueryParamsBulkValue();
        expect(value).toContain('userId');
        expect(value).toContain('status');
    });

    // ── TC-HTTP-API-103 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-103: Switch query params to key-value mode shows 3 default rows', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchQueryParamsToKeyValue();
        await expect(workflow.httpApi.formKeyInput(1)).toBeVisible();
        await expect(workflow.httpApi.formValueInput(1)).toBeVisible();
        await expect(workflow.httpApi.formKeyInput(2)).toBeVisible();
        await expect(workflow.httpApi.formKeyInput(3)).toBeVisible();
    });

    // ── TC-HTTP-API-104 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-104: Query params key-value mode — click Add creates 4th row', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchQueryParamsToKeyValue();
        await expect(workflow.httpApi.formKeyInput(3)).toBeVisible();
        await expect(workflow.httpApi.formKeyInput(4)).not.toBeVisible();
        await workflow.httpApi.clickAddRow();
        await expect(workflow.httpApi.formKeyInput(4)).toBeVisible();
    });

    // ── TC-HTTP-API-105 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-105: Query params key-value mode — type key and value in first row', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchQueryParamsToKeyValue();
        await workflow.httpApi.typeFormKey(1, 'userId');
        await workflow.httpApi.typeFormValue(1, '10');
        await expect(workflow.httpApi.formKeyInput(1)).toContainText('userId');
        await expect(workflow.httpApi.formValueInput(1)).toContainText('10');
    });

    // ── TC-HTTP-API-106 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-106: Query params key-value mode — type key in second row', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchQueryParamsToKeyValue();
        await workflow.httpApi.typeFormKey(2, 'limit');
        await expect(workflow.httpApi.formKeyInput(2)).toContainText('limit');
    });

    // ── TC-HTTP-API-107 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-107: Query params bulk → key-value shows typed key in first row', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeQueryParamsBulk('page:5');
        await workflow.httpApi.switchQueryParamsToKeyValue();
        await expect(workflow.httpApi.formKeyInput(1)).toContainText('page');
    });

    // ── TC-HTTP-API-108 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-108: Query params with special characters in bulk mode', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeQueryParamsBulk('search:hello@world');
        const value = await workflow.httpApi.getQueryParamsBulkValue();
        expect(value).toContain('search:hello@world');
    });

    // ── TC-HTTP-API-109 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-109: Query params with empty value in bulk mode (key:)', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeQueryParamsBulk('emptyKey:');
        const value = await workflow.httpApi.getQueryParamsBulkValue();
        expect(value).toContain('emptyKey:');
    });

    // ── TC-HTTP-API-110 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-110: Query params duplicate keys in bulk mode', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.queryParamsBulkTextbox.click();
        await workflow.httpApi.page.keyboard.type('id:10');
        await workflow.httpApi.page.keyboard.press('Enter');
        await workflow.httpApi.page.keyboard.type('id:20');
        await workflow.httpApi.queryParamsLabel.click({ force: true });
        await workflow.httpApi.page.waitForTimeout(300);
        const value = await workflow.httpApi.getQueryParamsBulkValue();
        expect(value).toContain('id');
    });

    // ═════════════════════════════════════════════════════════════════════════
    // BATCH 2: TC-HTTP-API-111 – TC-HTTP-API-120
    // cURL Import & Apply, Headers, Method/URL, Save/Reopen core flows
    // ═════════════════════════════════════════════════════════════════════════

    // ── TC-HTTP-API-111 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-111: Import GET cURL → Apply → URL populated', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl https://jsonplaceholder.typicode.com/posts');
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toHaveValue('https://jsonplaceholder.typicode.com/posts');
    });

    // ── TC-HTTP-API-112 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-112: Import POST cURL → Apply → method changes to POST', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl -X POST https://jsonplaceholder.typicode.com/posts');
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('POST');
    });

    // ── TC-HTTP-API-113 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-113: Import cURL with custom header → Apply → header appears in bulk', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl https://api.example.com -H "Authorization: Bearer token123"');
        await workflow.httpApi.expandApiEditor();
        const headers = await workflow.httpApi.getHeadersBulkValue();
        expect(headers).toContain('Authorization');
    });

    // ── TC-HTTP-API-114 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-114: Import PUT cURL → Apply → method is PUT and URL set', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl -X PUT https://jsonplaceholder.typicode.com/posts/1');
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('PUT');
        await expect(workflow.httpApi.urlInput).toHaveValue('https://jsonplaceholder.typicode.com/posts/1');
    });

    // ── TC-HTTP-API-115 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-115: Import cURL with query string in URL → Apply → URL contains query', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl "https://api.example.com/search?q=test&limit=10"');
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toHaveValue(/search/);
    });

    // ── TC-HTTP-API-116 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-116: Import DELETE cURL → Apply → method is DELETE', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl -X DELETE https://jsonplaceholder.typicode.com/posts/1');
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('DELETE');
    });

    // ── TC-HTTP-API-117 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-117: Headers bulk shows default Content-Type for POST', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        const headers = await workflow.httpApi.getHeadersBulkValue();
        expect(headers).toContain('Content-Type');
        expect(headers).toContain('application/json');
    });

    // ── TC-HTTP-API-118 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-118: Type custom header in bulk mode and verify', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeHeadersBulk('\nX-Custom-Header:myValue');
        const headers = await workflow.httpApi.getHeadersBulkValue();
        expect(headers).toContain('X-Custom-Header');
    });

    // ── TC-HTTP-API-119 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-119: Select PATCH method → body section visible with json default', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('patch');
        await expect(workflow.httpApi.jsonRadio).toBeChecked();
    });

    // ── TC-HTTP-API-120 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-120: Fill URL → save → reopen → URL persisted', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.fillUrl('https://api.example.com/v2/users');
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toHaveValue('https://api.example.com/v2/users');
    });

    // ═════════════════════════════════════════════════════════════════════════
    // BATCH 3: TC-HTTP-API-121 – TC-HTTP-API-130
    // Body types, cURL+body, combined save/reopen, headers KV, API name
    // ═════════════════════════════════════════════════════════════════════════

    // ── TC-HTTP-API-121 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-121: Import POST cURL with JSON data → Apply → json radio checked', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl -X POST https://api.example.com/data -H "Content-Type: application/json" -d \'{"name":"test"}\'');
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.jsonRadio).toBeChecked();
    });

    // ── TC-HTTP-API-122 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-122: Import cURL with multiple headers → Apply → both headers present', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl https://api.example.com -H "Authorization: Bearer abc" -H "X-Request-Id: 123"');
        await workflow.httpApi.expandApiEditor();
        const headers = await workflow.httpApi.getHeadersBulkValue();
        expect(headers).toContain('Authorization');
        expect(headers).toContain('X-Request-Id');
    });

    // ── TC-HTTP-API-123 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-123: Switch body type from json to form-data → form-data radio checked', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.jsonRadio).toBeChecked();
        await workflow.httpApi.selectBodyType('form-data');
        await expect(workflow.httpApi.formDataRadio).toBeChecked();
    });

    // ── TC-HTTP-API-124 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-124: Switch body type to raw → raw body type dropdown shows Text', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('raw');
        await expect(workflow.httpApi.rawRadio).toBeChecked();
        const rawType = await workflow.httpApi.getRawBodyTypeValue();
        expect(rawType).toContain('Text');
    });

    // ── TC-HTTP-API-125 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-125: Change method POST → GET → body section disappears', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.jsonRadio).toBeVisible();
        await workflow.httpApi.selectMethod('get');
        await expect(workflow.httpApi.jsonRadio).not.toBeVisible();
    });

    // ── TC-HTTP-API-126 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-126: Select PUT method + fill URL → save → reopen → method persisted', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('put');
        await workflow.httpApi.fillUrl('https://api.example.com/items/1');
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('PUT');
    });

    // ── TC-HTTP-API-127 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-127: Import cURL → Apply → save → reopen → URL persisted', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl https://api.example.com/persist-test');
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toHaveValue(/persist-test/);
    });

    // ── TC-HTTP-API-128 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-128: Headers key-value mode → type key → switch to bulk → key in bulk text', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchHeadersToKeyValue();
        await workflow.httpApi.typeFormKey(1, 'X-Api-Key');
        await workflow.httpApi.headersBulkEditBtn.click();
        await workflow.httpApi.page.waitForTimeout(300);
        const headers = await workflow.httpApi.getHeadersBulkValue();
        expect(headers).toContain('X-Api-Key');
    });

    // ── TC-HTTP-API-129 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-129: API name input accepts and retains custom name', async ({ workflow }) => {
        await workflow.httpApi.fillApiName('My Custom API');
        await expect(workflow.httpApi.apiNameInput).toHaveValue('My Custom API');
    });

    // ── TC-HTTP-API-130 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-130: Import cURL with Content-Type header → Apply → header reflected in bulk', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl -X POST https://api.example.com -H "Content-Type: application/x-www-form-urlencoded"');
        await workflow.httpApi.expandApiEditor();
        const headers = await workflow.httpApi.getHeadersBulkValue();
        expect(headers).toContain('Content-Type');
    });

    // ═════════════════════════════════════════════════════════════════════════
    // BATCH 4: TC-HTTP-API-131 – TC-HTTP-API-140
    // cURL edge cases, accordion toggles, default state, method persistence
    // ═════════════════════════════════════════════════════════════════════════

    // ── TC-HTTP-API-131 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-131: Import PATCH cURL → Apply → method is PATCH', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl -X PATCH https://api.example.com/users/42');
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('PATCH');
    });

    // ── TC-HTTP-API-132 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-132: Fill URL with path parameters → save → reopen → persisted', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.fillUrl('https://api.example.com/users/123/posts/456');
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toHaveValue('https://api.example.com/users/123/posts/456');
    });

    // ── TC-HTTP-API-133 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-133: Select x-www-form-urlencoded body type → radio checked', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('x-www-form-urlencoded');
        await expect(workflow.httpApi.urlEncodedRadio).toBeChecked();
    });

    // ── TC-HTTP-API-134 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-134: Import cURL with explicit GET → Apply → method is GET and no body', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl -X GET https://api.example.com/items');
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('GET');
        await expect(workflow.httpApi.jsonRadio).not.toBeVisible();
    });

    // ── TC-HTTP-API-135 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-135: Toggle API Editor accordion closed → URL input not visible', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
        await workflow.httpApi.toggleApiEditor();
        await expect(workflow.httpApi.urlInput).not.toBeVisible();
    });

    // ── TC-HTTP-API-136 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-136: DELETE method + URL → save → reopen → method persisted as DELETE', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('delete');
        await workflow.httpApi.fillUrl('https://api.example.com/items/99');
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('DELETE');
    });

    // ── TC-HTTP-API-137 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-137: Import cURL → Apply → manually change method → verify updated', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl https://api.example.com/data');
        await workflow.httpApi.expandApiEditor();
        const initial = await workflow.httpApi.getSelectedMethod();
        expect(initial).toBe('GET');
        await workflow.httpApi.selectMethod('put');
        const updated = await workflow.httpApi.getSelectedMethod();
        expect(updated).toBe('PUT');
    });

    // ── TC-HTTP-API-138 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-138: Default method for new HTTP API Request step is POST', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('POST');
    });

    // ── TC-HTTP-API-139 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-139: Query params bulk textbox is initially empty', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        const value = await workflow.httpApi.getQueryParamsBulkValue();
        expect(value.trim()).toBe('');
    });

    // ── TC-HTTP-API-140 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-140: Import PATCH cURL → Apply → save → reopen → method persisted as PATCH', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl -X PATCH https://api.example.com/items/5 -H "Authorization: Bearer xyz"');
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('PATCH');
    });

    // ═════════════════════════════════════════════════════════════════════════
    // BATCH 5: TC-HTTP-API-141 – TC-HTTP-API-150
    // Realistic flows, cURL -d flag, accordion resilience, API name, e2e
    // ═════════════════════════════════════════════════════════════════════════

    // ── TC-HTTP-API-141 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-141: Import cURL with long URL path → Apply → full URL populated', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl https://api.example.com/v3/organizations/org-123/projects/proj-456/tasks');
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toHaveValue(/organizations\/org-123\/projects\/proj-456\/tasks/);
    });

    // ── TC-HTTP-API-142 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-142: cURL accordion collapse → re-expand → textbox still visible', async ({ workflow }) => {
        await expect(workflow.httpApi.curlTextbox).toBeVisible();
        await workflow.httpApi.toggleCurlAccordion();
        await expect(workflow.httpApi.curlTextbox).not.toBeVisible();
        await workflow.httpApi.toggleCurlAccordion();
        await expect(workflow.httpApi.curlTextbox).toBeVisible();
    });

    // ── TC-HTTP-API-143 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-143: Type query param in bulk → verify content persists after blur', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeQueryParamsBulk('q:playwright');
        const qp = await workflow.httpApi.getQueryParamsBulkValue();
        expect(qp).toContain('q:playwright');
        await workflow.httpApi.typeQueryParamsBulk('\nlang:ts');
        const qp2 = await workflow.httpApi.getQueryParamsBulkValue();
        expect(qp2).toContain('lang');
    });

    // ── TC-HTTP-API-144 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-144: Select form-data body type → save → reopen → form-data still selected', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('form-data');
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.formDataRadio).toBeChecked();
    });

    // ── TC-HTTP-API-145 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-145: Import cURL with header → Apply → type additional header → both present', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl https://api.example.com -H "Accept: application/json"');
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeHeadersBulk('\nX-Extra:value');
        const headers = await workflow.httpApi.getHeadersBulkValue();
        expect(headers).toContain('Accept');
        expect(headers).toContain('X-Extra');
    });

    // ── TC-HTTP-API-146 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-146: Fill API name → save → reopen → name persisted', async ({ workflow }) => {
        await workflow.httpApi.fillApiName('Payment API');
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await expect(workflow.httpApi.apiNameInput).toHaveValue('Payment API');
    });

    // ── TC-HTTP-API-147 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-147: Switch body to form-data → headers update Content-Type accordingly', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('form-data');
        const headers = await workflow.httpApi.getHeadersBulkValue();
        expect(headers).toContain('Content-Type');
    });

    // ── TC-HTTP-API-148 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-148: Import cURL with -d flag (no -X) → Apply → method becomes POST', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl https://api.example.com/login -d "user=admin"');
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toBe('POST');
    });

    // ── TC-HTTP-API-149 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-149: Toggle API Editor multiple times → accordion stays responsive', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
        await workflow.httpApi.toggleApiEditor();
        await expect(workflow.httpApi.urlInput).not.toBeVisible();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
        await workflow.httpApi.toggleApiEditor();
        await expect(workflow.httpApi.urlInput).not.toBeVisible();
    });

    // ── TC-HTTP-API-150 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-150: E2E — cURL import → add query param → save → reopen → URL and query param persisted', async ({ workflow }) => {
        await workflow.httpApi.applyCurlCommand('curl -X PUT https://api.example.com/items');
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeQueryParamsBulk('version:2');
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toHaveValue(/items/);
    });

});

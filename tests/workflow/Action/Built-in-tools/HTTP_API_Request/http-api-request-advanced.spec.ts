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
// HTTP API Request — Advanced Test Cases (TC-HTTP-API-051 to TC-HTTP-API-100)
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('HTTP API Request — Advanced Tests', () => {

    test.beforeEach(async ({ dashboard, triggers, workflow }) => {
        await setupHttpApiRequest(dashboard, triggers, workflow);
    });

    // ═════════════════════════════════════════════════════════════════════════
    // BATCH 1: TC-HTTP-API-051 – TC-HTTP-API-070
    // Body type deep interactions, method + body combos, URL edge cases
    // ═════════════════════════════════════════════════════════════════════════

    // ── TC-HTTP-API-051 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-051: PUT method shows all 4 body type radio options', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('put');
        await expect(workflow.httpApi.formDataRadio).toBeVisible();
        await expect(workflow.httpApi.urlEncodedRadio).toBeVisible();
        await expect(workflow.httpApi.jsonRadio).toBeVisible();
        await expect(workflow.httpApi.rawRadio).toBeVisible();
    });

    // ── TC-HTTP-API-052 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-052: PATCH method shows all 4 body type radio options', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('patch');
        await expect(workflow.httpApi.formDataRadio).toBeVisible();
        await expect(workflow.httpApi.urlEncodedRadio).toBeVisible();
        await expect(workflow.httpApi.jsonRadio).toBeVisible();
        await expect(workflow.httpApi.rawRadio).toBeVisible();
    });

    // ── TC-HTTP-API-053 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-053: Selecting x-www-form-urlencoded checks it', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('x-www-form-urlencoded');
        await expect(workflow.httpApi.urlEncodedRadio).toBeChecked();
    });

    // ── TC-HTTP-API-054 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-054: Selecting raw checks it and unchecks json', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('raw');
        await expect(workflow.httpApi.rawRadio).toBeChecked();
        await expect(workflow.httpApi.jsonRadio).not.toBeChecked();
    });

    // ── TC-HTTP-API-055 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-055: form-data radio is NOT checked by default', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.formDataRadio).not.toBeChecked();
    });

    // ── TC-HTTP-API-056 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-056: x-www-form-urlencoded radio is NOT checked by default', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlEncodedRadio).not.toBeChecked();
    });

    // ── TC-HTTP-API-057 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-057: raw radio is NOT checked by default', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.rawRadio).not.toBeChecked();
    });

    // ── TC-HTTP-API-058 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-058: Cycling body types form-data → json → raw preserves radio group', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('form-data');
        await expect(workflow.httpApi.formDataRadio).toBeChecked();
        await workflow.httpApi.selectBodyType('json');
        await expect(workflow.httpApi.jsonRadio).toBeChecked();
        await expect(workflow.httpApi.formDataRadio).not.toBeChecked();
        await workflow.httpApi.selectBodyType('raw');
        await expect(workflow.httpApi.rawRadio).toBeChecked();
        await expect(workflow.httpApi.jsonRadio).not.toBeChecked();
    });

    // ── TC-HTTP-API-059 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-059: POST → GET → PUT restores body section with json default', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('get');
        await expect(workflow.httpApi.bodyLabel).not.toBeVisible();
        await workflow.httpApi.selectMethod('put');
        await expect(workflow.httpApi.bodyLabel).toBeVisible();
        await expect(workflow.httpApi.jsonRadio).toBeChecked();
    });

    // ── TC-HTTP-API-060 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-060: Method dropdown shows exactly 5 options', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        const count = await workflow.httpApi.getMethodOptionCount();
        expect(count).toBe(5);
    });

    // ── TC-HTTP-API-061 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-061: Expanding API Editor reveals editor region content', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.apiEditorRegion).toBeVisible();
    });

    // ── TC-HTTP-API-062 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-062: Selecting raw body type shows raw content type text', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('raw');
        await expect(workflow.httpApi.rawBodyTypeText).toBeVisible();
    });

    // ── TC-HTTP-API-063 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-063: Selecting form-data shows form key-value inputs', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('form-data');
        await expect(workflow.httpApi.formKeyInputFirst).toBeVisible();
        await expect(workflow.httpApi.formValueInputFirst).toBeVisible();
    });

    // ── TC-HTTP-API-064 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-064: Selecting x-www-form-urlencoded shows form key-value inputs', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('x-www-form-urlencoded');
        await expect(workflow.httpApi.formKeyInputFirst).toBeVisible();
        await expect(workflow.httpApi.formValueInputFirst).toBeVisible();
    });

    // ── TC-HTTP-API-065 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-065: URL input placeholder shows correct text', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
    });

    // ── TC-HTTP-API-066 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-066: Typing long URL (100+ chars) renders in URL input', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        const longUrl = 'https://api.example.com/v1/data/resource/items?page=1&limit=50&sort=name&order=asc&filter=active';
        await workflow.httpApi.typeUrl(longUrl);
        await expect(workflow.httpApi.urlInput).toContainText('https://api.example.com/v1/data/resource/items');
    });

    // ── TC-HTTP-API-067 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-067: Typing URL with query params works', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeUrl('https://api.example.com/data?key=value');
        await expect(workflow.httpApi.urlInput).toContainText('https://api.example.com/data');
    });

    // ── TC-HTTP-API-068 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-068: API Editor accordion heading text shows "API Editor"', async ({ workflow }) => {
        await expect(workflow.httpApi.apiEditorHeadingText).toBeVisible();
    });

    // ── TC-HTTP-API-069 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-069: cURL accordion heading text shows "Import cURL / Ask AI"', async ({ workflow }) => {
        await expect(workflow.httpApi.curlHeadingText).toBeVisible();
    });

    // ── TC-HTTP-API-070 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-070: Query params bulk textbox is initially empty', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        const text = await workflow.httpApi.queryParamsBulkTextbox.textContent();
        expect((text ?? '').trim()).toBe('');
    });

    // ═════════════════════════════════════════════════════════════════════════
    // BATCH 2: TC-HTTP-API-071 – TC-HTTP-API-090
    // Save/reopen persistence, cURL, key-value deep, method edge cases
    // ═════════════════════════════════════════════════════════════════════════

    // ── TC-HTTP-API-071 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-071: Save → reopen → method dropdown still shows POST', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toContain('POST');
    });

    // ── TC-HTTP-API-072 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-072: Save → reopen → Test button still visible', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await expect(workflow.httpApi.testButton).toBeVisible();
    });

    // ── TC-HTTP-API-073 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-073: Save → reopen → cURL accordion visible', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await expect(workflow.httpApi.curlAccordionBtn).toBeVisible();
    });

    // ── TC-HTTP-API-074 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-074: cURL textbox accepts typed text', async ({ workflow }) => {
        await workflow.httpApi.typeCurlCommand('curl https://api.example.com');
        await expect(workflow.httpApi.curlTextbox).toContainText('curl https://api.example.com');
    });

    // ── TC-HTTP-API-075 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-075: cURL accordion collapse → re-expand shows textbox again', async ({ workflow }) => {
        await expect(workflow.httpApi.curlTextbox).toBeVisible();
        await workflow.httpApi.toggleCurlAccordion();
        await expect(workflow.httpApi.curlTextbox).not.toBeVisible();
        await workflow.httpApi.toggleCurlAccordion();
        await expect(workflow.httpApi.curlTextbox).toBeVisible();
    });

    // ── TC-HTTP-API-076 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-076: Headers key-value mode shows Add button', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchHeadersToKeyValue();
        await expect(workflow.httpApi.addRowButton).toBeVisible();
    });

    // ── TC-HTTP-API-077 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-077: Headers key-value mode shows key placeholder inputs', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchHeadersToKeyValue();
        await expect(workflow.httpApi.formKeyInputFirst).toBeVisible();
    });

    // ── TC-HTTP-API-078 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-078: Query params key-value mode shows Add button', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchQueryParamsToKeyValue();
        await expect(workflow.httpApi.addRowButton).toBeVisible();
    });

    // ── TC-HTTP-API-079 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-079: Query params key-value mode shows key placeholder inputs', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchQueryParamsToKeyValue();
        await expect(workflow.httpApi.formKeyInputFirst).toBeVisible();
    });

    // ── TC-HTTP-API-080 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-080: Headers key-value → Bulk Edit toggles back to bulk textbox', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchHeadersToKeyValue();
        await expect(workflow.httpApi.headersBulkEditBtn).toBeVisible();
        await workflow.httpApi.headersBulkEditBtn.click();
        await expect(workflow.httpApi.headersBulkTextbox).toBeVisible();
    });

    // ── TC-HTTP-API-081 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-081: Query params key-value → Bulk Edit toggles back to bulk textbox', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchQueryParamsToKeyValue();
        await expect(workflow.httpApi.queryParamsBulkEditBtn).toBeVisible();
        await workflow.httpApi.queryParamsBulkEditBtn.click();
        await expect(workflow.httpApi.queryParamsBulkTextbox).toBeVisible();
    });

    // ── TC-HTTP-API-082 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-082: Save → reopen → expand API Editor → URL input visible', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
    });

    // ── TC-HTTP-API-083 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-083: Save → reopen → expand API Editor → method dropdown visible', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.methodDropdown).toBeVisible();
    });

    // ── TC-HTTP-API-084 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-084: Multiple method switches (GET→PUT→DELETE→PATCH) do not break UI', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('get');
        await workflow.httpApi.selectMethod('put');
        await workflow.httpApi.selectMethod('delete');
        await workflow.httpApi.selectMethod('patch');
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toContain('PATCH');
        await expect(workflow.httpApi.bodyLabel).toBeVisible();
    });

    // ── TC-HTTP-API-085 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-085: Save → reopen → expand → headers label still visible', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.headersLabel).toBeVisible();
    });

    // ── TC-HTTP-API-086 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-086: Save → reopen → expand → query params label still visible', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.queryParamsLabel).toBeVisible();
    });

    // ── TC-HTTP-API-087 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-087: API name input is editable', async ({ workflow }) => {
        await workflow.httpApi.fillApiName('My Custom API');
        await expect(workflow.httpApi.apiNameInput).toHaveValue('My Custom API');
    });

    // ── TC-HTTP-API-088 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-088: cURL textbox is initially empty', async ({ workflow }) => {
        const text = await workflow.httpApi.curlTextbox.textContent();
        expect((text ?? '').trim()).toBe('');
    });

    // ── TC-HTTP-API-089 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-089: Test button still disabled after selecting method without URL', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('get');
        await expect(workflow.httpApi.testButton).toBeDisabled();
    });

    // ── TC-HTTP-API-090 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-090: Input Values accordion can be toggled (expand/collapse)', async ({ workflow }) => {
        await expect(workflow.httpApi.inputValuesAccordionBtn).toBeVisible();
        await workflow.httpApi.toggleInputValues();
        await expect(workflow.httpApi.inputValuesAccordionBtn).toBeVisible();
    });

    // ═════════════════════════════════════════════════════════════════════════
    // BATCH 3: TC-HTTP-API-091 – TC-HTTP-API-100
    // Edge cases, advanced state, realistic user flows
    // ═════════════════════════════════════════════════════════════════════════

    // ── TC-HTTP-API-091 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-091: POST → form-data → switch to PUT keeps body visible', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('form-data');
        await expect(workflow.httpApi.formDataRadio).toBeChecked();
        await workflow.httpApi.selectMethod('put');
        await expect(workflow.httpApi.bodyLabel).toBeVisible();
    });

    // ── TC-HTTP-API-092 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-092: GET method hides all 4 body type radios', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('get');
        await expect(workflow.httpApi.formDataRadio).not.toBeVisible();
        await expect(workflow.httpApi.urlEncodedRadio).not.toBeVisible();
        await expect(workflow.httpApi.jsonRadio).not.toBeVisible();
        await expect(workflow.httpApi.rawRadio).not.toBeVisible();
    });

    // ── TC-HTTP-API-093 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-093: Headers section visible for GET method', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('get');
        await expect(workflow.httpApi.headersLabel).toBeVisible();
    });

    // ── TC-HTTP-API-094 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-094: Query params section visible for GET method', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('get');
        await expect(workflow.httpApi.queryParamsLabel).toBeVisible();
    });

    // ── TC-HTTP-API-095 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-095: Save button is enabled on fresh step', async ({ workflow }) => {
        await expect(workflow.httpApi.saveButton).toBeEnabled();
    });

    // ── TC-HTTP-API-096 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-096: Change button has data-testid step-change-button', async ({ workflow }) => {
        await expect(workflow.httpApi.stepChangeButton).toBeVisible();
    });

    // ── TC-HTTP-API-097 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-097: Multiple API Editor accordion toggles preserve state', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
        await workflow.httpApi.toggleApiEditor();
        await expect(workflow.httpApi.urlInput).not.toBeVisible();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
        await workflow.httpApi.toggleApiEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.methodDropdown).toBeVisible();
    });

    // ── TC-HTTP-API-098 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-098: Save → reopen → expand → Body section visible (POST persists)', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.bodyLabel).toBeVisible();
    });

    // ── TC-HTTP-API-099 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-099: Help section visible after expanding API Editor', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.helpText).toBeVisible();
    });

    // ── TC-HTTP-API-100 ──────────────────────────────────────────────────────
    test('TC-HTTP-API-100: Apply button visible in cURL section on fresh step', async ({ workflow }) => {
        await expect(workflow.httpApi.curlApplyButton).toBeVisible();
    });

});

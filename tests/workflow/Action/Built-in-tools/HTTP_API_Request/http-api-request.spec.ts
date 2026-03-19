import { test, expect } from '../../../../../fixtures/base.fixture';

const PROJECT_ID = '58104';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — opens a fresh HTTP API Request editor for each test
// Flow: project → new flow → webhook trigger → close slider →
//        add-step → select HTTP API Request → close overlay → wait for panel
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

// ─────────────────────────────────────────────────────────────────────────────
// HTTP API Request — focused small test cases
// ─────────────────────────────────────────────────────────────────────────────
test.describe('HTTP API Request — Built-in Tool', () => {

    test.beforeEach(async ({ dashboard, triggers, workflow }) => {
        await setupHttpApiRequest(dashboard, triggers, workflow);
    });

    // ── TC-HAR-001 ────────────────────────────────────────────────────────────
    test('TC-HAR-001: Panel shows Test and Save buttons on open', async ({ workflow }) => {
        await expect(workflow.httpApi.testButton).toBeVisible();
        await expect(workflow.httpApi.saveButton).toBeVisible();
    });

    // ── TC-HAR-002 ────────────────────────────────────────────────────────────
    test('TC-HAR-002: API Editor accordion summary is visible', async ({ workflow }) => {
        await expect(workflow.httpApi.apiEditorAccordionBtn).toBeVisible();
    });

    // ── TC-HAR-003 ────────────────────────────────────────────────────────────
    test('TC-HAR-003: Import cURL / Ask AI accordion is visible on fresh step', async ({ workflow }) => {
        await expect(workflow.httpApi.curlAccordionBtn).toBeVisible();
    });

    // ── TC-HAR-004 ────────────────────────────────────────────────────────────
    test('TC-HAR-004: Expanding API Editor reveals method dropdown', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.methodDropdown).toBeVisible();
    });

    // ── TC-HAR-005 ────────────────────────────────────────────────────────────
    test('TC-HAR-005: Expanding API Editor reveals URL input', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
    });

    // ── TC-HAR-006 ────────────────────────────────────────────────────────────
    test('TC-HAR-006: Method dropdown defaults to POST', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toContain('POST');
    });

    // ── TC-HAR-007 ────────────────────────────────────────────────────────────
    test('TC-HAR-007: Query params label is visible inside API Editor', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.queryParamsLabel).toBeVisible();
    });

    // ── TC-HAR-008 ────────────────────────────────────────────────────────────
    test('TC-HAR-008: Headers label is visible inside API Editor', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.headersLabel).toBeVisible();
    });

    // ── TC-HAR-009 ────────────────────────────────────────────────────────────
    test('TC-HAR-009: Method can be changed to POST', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('post');
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toContain('POST');
    });

    // ── TC-HAR-010 ────────────────────────────────────────────────────────────
    test('TC-HAR-010: Method can be changed to PUT', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('put');
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toContain('PUT');
    });

    // ── TC-HAR-011 ────────────────────────────────────────────────────────────
    test('TC-HAR-011: Method can be changed to DELETE', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('delete');
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toContain('DELETE');
    });

    // ── TC-HAR-012 ────────────────────────────────────────────────────────────
    test('TC-HAR-012: Method can be changed to PATCH', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('patch');
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toContain('PATCH');
    });

    // ── TC-HAR-013 ────────────────────────────────────────────────────────────
    test('TC-HAR-013: Body section is visible for default POST method', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.bodyLabel).toBeVisible();
    });

    // ── TC-HAR-014 ────────────────────────────────────────────────────────────
    test('TC-HAR-014: Body section has form-data radio option', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.formDataRadio).toBeVisible();
    });

    // ── TC-HAR-015 ────────────────────────────────────────────────────────────
    test('TC-HAR-015: Body section has json radio option', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.jsonRadio).toBeVisible();
    });

    // ── TC-HAR-016 ────────────────────────────────────────────────────────────
    test('TC-HAR-016: Body section does NOT appear after switching to GET', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('get');
        await expect(workflow.httpApi.bodyLabel).not.toBeVisible();
    });

    // ── TC-HAR-017 ────────────────────────────────────────────────────────────
    test('TC-HAR-017: Body section does NOT appear for DELETE method', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('delete');
        await expect(workflow.httpApi.bodyLabel).not.toBeVisible();
    });

    // ── TC-HAR-018 ────────────────────────────────────────────────────────────
    test('TC-HAR-018: Save with default state closes panel — step node on canvas', async ({ workflow }) => {
        await workflow.httpApi.save();
        await expect(workflow.httpApi.testButton).not.toBeVisible();
    });

    // ── TC-HAR-019 ────────────────────────────────────────────────────────────
    test('TC-HAR-019: Test button displays "Test" text', async ({ workflow }) => {
        await expect(workflow.httpApi.testButton).toContainText('Test');
    });

    // ── TC-HAR-020 ────────────────────────────────────────────────────────────
    test('TC-HAR-020: Save button displays "Save" text', async ({ workflow }) => {
        await expect(workflow.httpApi.saveButton).toContainText('Save');
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // TC-HAR-021 – TC-HAR-050  (30 additional tests)
    // ═══════════════════════════════════════════════════════════════════════════

    // ── Body type interactions ───────────────────────────────────────────────

    // ── TC-HAR-021 ────────────────────────────────────────────────────────────
    test('TC-HAR-021: x-www-form-urlencoded radio visible for default POST', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlEncodedRadio).toBeVisible();
    });

    // ── TC-HAR-022 ────────────────────────────────────────────────────────────
    test('TC-HAR-022: raw radio visible for default POST', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.rawRadio).toBeVisible();
    });

    // ── TC-HAR-023 ────────────────────────────────────────────────────────────
    test('TC-HAR-023: json radio is checked by default for POST', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.jsonRadio).toBeChecked();
    });

    // ── TC-HAR-024 ────────────────────────────────────────────────────────────
    test('TC-HAR-024: Selecting form-data deselects json', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectBodyType('form-data');
        await expect(workflow.httpApi.formDataRadio).toBeChecked();
        await expect(workflow.httpApi.jsonRadio).not.toBeChecked();
    });

    // ── TC-HAR-025 ────────────────────────────────────────────────────────────
    test('TC-HAR-025: Body section appears for PUT method', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('put');
        await expect(workflow.httpApi.bodyLabel).toBeVisible();
    });

    // ── TC-HAR-026 ────────────────────────────────────────────────────────────
    test('TC-HAR-026: Body section appears for PATCH method', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('patch');
        await expect(workflow.httpApi.bodyLabel).toBeVisible();
    });

    // ── Method switching ────────────────────────────────────────────────────

    // ── TC-HAR-027 ────────────────────────────────────────────────────────────
    test('TC-HAR-027: Method can be changed to GET', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('get');
        const method = await workflow.httpApi.getSelectedMethod();
        expect(method).toContain('GET');
    });

    // ── TC-HAR-028 ────────────────────────────────────────────────────────────
    test('TC-HAR-028: Switching GET → POST restores Body section', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('get');
        await expect(workflow.httpApi.bodyLabel).not.toBeVisible();
        await workflow.httpApi.selectMethod('post');
        await expect(workflow.httpApi.bodyLabel).toBeVisible();
    });

    // ── TC-HAR-029 ────────────────────────────────────────────────────────────
    test('TC-HAR-029: POST → DELETE hides Body, DELETE → PATCH shows it', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.selectMethod('delete');
        await expect(workflow.httpApi.bodyLabel).not.toBeVisible();
        await workflow.httpApi.selectMethod('patch');
        await expect(workflow.httpApi.bodyLabel).toBeVisible();
    });

    // ── Query params ────────────────────────────────────────────────────────

    // ── TC-HAR-030 ────────────────────────────────────────────────────────────
    test('TC-HAR-030: Query params Key-Value Edit button is visible', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.queryParamsKeyValueBtn).toBeVisible();
    });

    // ── TC-HAR-031 ────────────────────────────────────────────────────────────
    test('TC-HAR-031: Clicking Key-Value Edit toggles to Bulk Edit for query params', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchQueryParamsToKeyValue();
        await expect(workflow.httpApi.queryParamsBulkEditBtn).toBeVisible();
    });

    // ── TC-HAR-032 ────────────────────────────────────────────────────────────
    test('TC-HAR-032: Query params bulk textbox is visible', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.queryParamsBulkTextbox).toBeVisible();
    });

    // ── Headers ─────────────────────────────────────────────────────────────

    // ── TC-HAR-033 ────────────────────────────────────────────────────────────
    test('TC-HAR-033: Headers Key-Value Edit button is visible', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.headersKeyValueBtn).toBeVisible();
    });

    // ── TC-HAR-034 ────────────────────────────────────────────────────────────
    test('TC-HAR-034: Clicking Key-Value Edit toggles to Bulk Edit for headers', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.switchHeadersToKeyValue();
        await expect(workflow.httpApi.headersBulkEditBtn).toBeVisible();
    });

    // ── TC-HAR-035 ────────────────────────────────────────────────────────────
    test('TC-HAR-035: Headers has default Content-Type: application/json', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.headersBulkTextbox).toContainText('Content-Type: application/json');
    });

    // ── Import cURL / Ask AI ────────────────────────────────────────────────

    // ── TC-HAR-036 ────────────────────────────────────────────────────────────
    test('TC-HAR-036: cURL textbox is visible (accordion expanded by default)', async ({ workflow }) => {
        await expect(workflow.httpApi.curlTextbox).toBeVisible();
    });

    // ── TC-HAR-037 ────────────────────────────────────────────────────────────
    test('TC-HAR-037: Collapsing cURL accordion hides cURL textbox', async ({ workflow }) => {
        await expect(workflow.httpApi.curlTextbox).toBeVisible();
        await workflow.httpApi.toggleCurlAccordion();
        await expect(workflow.httpApi.curlTextbox).not.toBeVisible();
    });

    // ── TC-HAR-038 ────────────────────────────────────────────────────────────
    test('TC-HAR-038: Apply button is visible in cURL section', async ({ workflow }) => {
        await expect(workflow.httpApi.curlApplyButton).toBeVisible();
    });

    // ── Input Values & Accordion toggles ────────────────────────────────────

    // ── TC-HAR-039 ────────────────────────────────────────────────────────────
    test('TC-HAR-039: Input Values accordion is visible', async ({ workflow }) => {
        await expect(workflow.httpApi.inputValuesAccordionBtn).toBeVisible();
    });

    // ── TC-HAR-040 ────────────────────────────────────────────────────────────
    test('TC-HAR-040: API Editor collapse hides URL input', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
        await workflow.httpApi.toggleApiEditor();
        await expect(workflow.httpApi.urlInput).not.toBeVisible();
    });

    // ── TC-HAR-041 ────────────────────────────────────────────────────────────
    test('TC-HAR-041: API Editor expand → collapse → re-expand restores URL input', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.toggleApiEditor();
        await workflow.httpApi.expandApiEditor();
        await expect(workflow.httpApi.urlInput).toBeVisible();
    });

    // ── API name & panel header ─────────────────────────────────────────────

    // ── TC-HAR-042 ────────────────────────────────────────────────────────────
    test('TC-HAR-042: API name input shows "HTTP API Request"', async ({ workflow }) => {
        await expect(workflow.httpApi.apiNameInput).toHaveValue('HTTP API Request');
    });

    // ── TC-HAR-043 ────────────────────────────────────────────────────────────
    test('TC-HAR-043: Change button is visible in panel header', async ({ workflow }) => {
        await expect(workflow.httpApi.changeButton).toBeVisible();
    });

    // ── Test button state ───────────────────────────────────────────────────

    // ── TC-HAR-044 ────────────────────────────────────────────────────────────
    test('TC-HAR-044: Test button is disabled on fresh step', async ({ workflow }) => {
        await expect(workflow.httpApi.testButton).toBeDisabled();
    });

    // ── Save & reopen ───────────────────────────────────────────────────────

    // ── TC-HAR-045 ────────────────────────────────────────────────────────────
    test('TC-HAR-045: Save → step node shows HTTP_API_Request on canvas', async ({ workflow }) => {
        await workflow.httpApi.save();
        await expect(workflow.httpApi.httpApiStepNode).toBeVisible();
    });

    // ── TC-HAR-046 ────────────────────────────────────────────────────────────
    test('TC-HAR-046: Save → reopen → Save button reappears', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await expect(workflow.httpApi.saveButton).toBeVisible();
    });

    // ── TC-HAR-047 ────────────────────────────────────────────────────────────
    test('TC-HAR-047: Save → reopen → API Editor accordion still visible', async ({ workflow }) => {
        await workflow.httpApi.save();
        await workflow.httpApi.reopenEditor();
        await expect(workflow.httpApi.apiEditorAccordionBtn).toBeVisible();
    });

    // ── URL input ───────────────────────────────────────────────────────────

    // ── TC-HAR-048 ────────────────────────────────────────────────────────────
    test('TC-HAR-048: URL input is empty on fresh step', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        const urlValue = await workflow.httpApi.getUrlValue();
        expect(urlValue.trim()).toBe('');
    });

    // ── TC-HAR-049 ────────────────────────────────────────────────────────────
    test('TC-HAR-049: URL input accepts typed text', async ({ workflow }) => {
        await workflow.httpApi.expandApiEditor();
        await workflow.httpApi.typeUrl('https://example.com');
        await expect(workflow.httpApi.urlInput).toContainText('https://example.com');
    });

    // ── Help ────────────────────────────────────────────────────────────────

    // ── TC-HAR-050 ────────────────────────────────────────────────────────────
    test('TC-HAR-050: Help section is visible in panel', async ({ workflow }) => {
        await expect(workflow.httpApi.helpText).toBeVisible();
    });

});

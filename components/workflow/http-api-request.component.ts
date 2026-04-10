import { Page, Locator } from '@playwright/test';

/**
 * HTTP API Request Component
 * Handles: HTTP API Request step panel — method selector, URL input, query params,
 *          headers, body options, save/test actions, add-step flow
 * Reference: apiSliderV2.tsx, apiInputField.tsx, tabBarV2.tsx, BulkKeyValueEditor.tsx,
 *            bodyTabNavigation.tsx, dryRunButton.tsx, saveButtonV3.tsx
 */
export class HttpApiRequestComponent {
    readonly page: Page;

    // ── Add-step flow ──────────────────────────────────────────────────────────
    readonly addStepButton: Locator;
    readonly httpApiRequestOption: Locator;
    readonly closeOverlayButton: Locator;

    // ── Accordion buttons ─────────────────────────────────────────────────────
    readonly apiEditorAccordionBtn: Locator;
    readonly curlAccordionBtn: Locator;
    readonly inputValuesAccordionBtn: Locator;

    // ── Method dropdown (MUI Select) ───────────────────────────────────────────
    readonly methodDropdown: Locator;

    // ── URL input ──────────────────────────────────────────────────────────────
    readonly urlInput: Locator;

    // ── Query params section ───────────────────────────────────────────────────
    readonly queryParamsLabel: Locator;
    readonly queryParamsBulkEdit: Locator;
    readonly queryParamsKeyValueBtn: Locator;

    // ── Headers section ────────────────────────────────────────────────────────
    readonly headersLabel: Locator;
    readonly headersBulkEdit: Locator;
    readonly headersKeyValueBtn: Locator;

    // ── Body section (POST/PUT/PATCH only) ─────────────────────────────────────
    readonly bodyLabel: Locator;
    readonly formDataRadio: Locator;
    readonly urlEncodedRadio: Locator;
    readonly jsonRadio: Locator;
    readonly rawRadio: Locator;

    // ── Footer buttons ─────────────────────────────────────────────────────────
    readonly testButton: Locator;
    readonly saveButton: Locator;

    // ── cURL section ────────────────────────────────────────────────────────
    readonly curlTextbox: Locator;
    readonly curlApplyButton: Locator;

    // ── API name & panel header ──────────────────────────────────────────────
    readonly apiNameInput: Locator;
    readonly changeButton: Locator;

    // ── Help ─────────────────────────────────────────────────────────────────
    readonly helpText: Locator;

    // ── Scoped bulk textboxes (query params first, headers second) ───────────
    readonly queryParamsBulkTextbox: Locator;
    readonly headersBulkTextbox: Locator;

    // ── Bulk Edit buttons (visible after Key-Value Edit toggle) ──────────────
    readonly queryParamsBulkEditBtn: Locator;
    readonly headersBulkEditBtn: Locator;

    // ── Body / editor area ────────────────────────────────────────────────────
    readonly apiEditorRegion: Locator;
    readonly rawEditorPlaceholder: Locator;

    // ── Raw body type indicator ──────────────────────────────────────────────
    readonly rawBodyTypeText: Locator;

    // ── Form key-value mode inputs (form-data / x-www-form-urlencoded) ───────
    readonly formKeyInputFirst: Locator;
    readonly formValueInputFirst: Locator;
    readonly addRowButton: Locator;

    // ── Heading texts ────────────────────────────────────────────────────────
    readonly apiEditorHeadingText: Locator;
    readonly curlHeadingText: Locator;

    // ── Step change button (data-testid) ─────────────────────────────────────
    readonly stepChangeButton: Locator;

    // ── Delete row buttons (MUI Delete icon inside IconButton) ────────────────
    readonly deleteRowButtons: Locator;

    // ── Radio group (body type) ──────────────────────────────────────────────
    readonly bodyRadioGroup: Locator;

    // ── Field mapping chip buttons ───────────────────────────────────────────
    readonly fieldMappingButtons: Locator;

    // ── Canvas step nodes ──────────────────────────────────────────────────────
    readonly httpApiStepNode: Locator;
    readonly configureStepNode: Locator;

    constructor(page: Page) {
        this.page = page;

        // Add-step flow
        this.addStepButton = page.getByTestId('add-step-button');
        this.httpApiRequestOption = page.getByRole('option', { name: 'HTTP API Request' });
        this.closeOverlayButton = page.getByTestId('slider-back-button');

        // Accordion buttons — ID-based selectors (stable, no testid on AccordionSummary)
        this.apiEditorAccordionBtn = page.locator('#panel1a-header');
        this.curlAccordionBtn = page.locator('#accordion-summary-curl');
        this.inputValuesAccordionBtn = page.getByTestId('input-values-accordion-summary');

        // Method dropdown — CSS selector avoids aria-hidden breakage from MUI Popover
        this.methodDropdown = page.locator('[role="combobox"][aria-label="Without label"]').first();

        // URL input — textbox with API placeholder
        this.urlInput = page.getByPlaceholder('https://flow.viasocket.com/');

        // Query params
        this.queryParamsLabel = page.getByText('Query params', { exact: true });
        this.queryParamsBulkEdit = page.locator('#queryparamsBulkEdit');
        this.queryParamsKeyValueBtn = page.getByTestId('query-params-key-value-edit-button');

        // Headers
        this.headersLabel = page.getByText('Headers', { exact: true });
        this.headersBulkEdit = page.locator('#headersBulkEdit');
        this.headersKeyValueBtn = page.getByTestId('headers-key-value-edit-button');

        // Body radio buttons
        this.bodyLabel = page.getByText('Body', { exact: true });
        this.formDataRadio = page.getByLabel('form-data');
        this.urlEncodedRadio = page.getByLabel('x-www-form-urlencoded');
        this.jsonRadio = page.getByLabel('json');
        this.rawRadio = page.getByLabel('raw');

        // Footer
        this.testButton = page.getByTestId('dry-run-step-test-button');
        this.saveButton = page.getByTestId('save-button');

        // cURL section
        this.curlTextbox = page.getByPlaceholder(/Provide cURL command/);
        this.curlApplyButton = page.getByTestId('import-curl-apply-button');

        // API name & panel header
        this.apiNameInput = page.getByPlaceholder('Api Name');
        this.changeButton = page.getByRole('button', { name: 'Change' });

        // Help
        this.helpText = page.getByText('Help', { exact: true });

        // Scoped bulk textboxes (query params first, headers second)
        const bulkTextboxes = page.getByPlaceholder(/key1:value1/);
        this.queryParamsBulkTextbox = bulkTextboxes.first();
        this.headersBulkTextbox = bulkTextboxes.nth(1);

        // Bulk Edit buttons (visible after Key-Value Edit toggle)
        this.queryParamsBulkEditBtn = page.getByTestId('query-params-bulk-edit-button');
        this.headersBulkEditBtn = page.getByTestId('headers-bulk-edit-button');

        // Body / editor area
        this.apiEditorRegion = page.getByRole('region', { name: 'API Editor' });
        this.rawEditorPlaceholder = page.getByText('WRITE YOUR TEXT');

        // Raw body type indicator
        this.rawBodyTypeText = page.getByText('Text (text/plain)');

        // Form key-value mode inputs
        this.formKeyInputFirst = page.getByPlaceholder('key 1');
        this.formValueInputFirst = page.getByPlaceholder('value 1');
        this.addRowButton = page.getByRole('button', { name: 'Add', exact: true });

        // Heading texts (MUI Accordion renders both h3 + h6, pick first)
        this.apiEditorHeadingText = page.getByRole('heading', { name: 'API Editor' }).first();
        this.curlHeadingText = page.getByRole('heading', { name: 'Import cURL / Ask AI' }).first();

        // Step change button
        this.stepChangeButton = page.getByTestId('step-change-button');

        // Delete row buttons — scoped to the small icon buttons next to key-value pairs
        this.deleteRowButtons = page.locator('[data-testid="DeleteIcon"]');

        // Radio group (body type)
        this.bodyRadioGroup = page.getByRole('radiogroup');

        // Field mapping chip buttons — no testid; scoped by aria-label on the chip button
        this.fieldMappingButtons = page.locator('button[aria-label="Click for Field Mapping"]');

        // Canvas step nodes — no testid on canvas nodes; scoped to paragraph text elements
        this.httpApiStepNode = page.locator('p').filter({ hasText: /^HTTP_API_Request$/ }).first();
        this.configureStepNode = page.locator('p').filter({ hasText: /^Configure$/ }).first();
    }

    // ── Add-step flow ──────────────────────────────────────────────────────────

    async clickAddStepButton(): Promise<void> {
        await this.addStepButton.click();
    }

    async selectHttpApiRequestOption(): Promise<void> {
        await this.httpApiRequestOption.click();
    }

    async closeAddStepOverlay(): Promise<void> {
        await this.closeOverlayButton.click();
    }

    // ── Panel readiness ────────────────────────────────────────────────────────

    async waitForPanelReady(): Promise<void> {
        await this.saveButton.waitFor({ state: 'visible' });
    }

    /** Dismiss any overlay / popover (e.g. Flow Document) that intercepts clicks */
    async dismissOverlay(): Promise<void> {
        const closeBtn = this.page.locator('button').filter({ hasText: '× Close' });
        if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeBtn.click();
        } else {
            await this.page.keyboard.press('Escape');
        }
        await this.page.waitForTimeout(500);
    }

    // ── API Editor accordion ───────────────────────────────────────────────────

    async expandApiEditor(): Promise<void> {
        await this.apiEditorAccordionBtn.click({ force: true });
        await this.urlInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }

    async toggleInputValues(): Promise<void> {
        await this.inputValuesAccordionBtn.click();
    }

    async toggleApiEditor(): Promise<void> {
        await this.apiEditorAccordionBtn.click({ force: true });
    }

    async toggleCurlAccordion(): Promise<void> {
        await this.curlAccordionBtn.click({ force: true });
    }

    // ── Method dropdown ────────────────────────────────────────────────────────

    async selectMethod(method: 'get' | 'post' | 'put' | 'delete' | 'patch'): Promise<void> {
        await this.methodDropdown.click();
        await this.page.getByRole('option', { name: method.toUpperCase(), exact: true }).click();
    }

    async getSelectedMethod(): Promise<string> {
        return (await this.methodDropdown.textContent()) ?? '';
    }

    // ── URL input ──────────────────────────────────────────────────────────────

    async fillUrl(url: string): Promise<void> {
        await this.urlInput.click();
        await this.urlInput.fill(url);
    }

    async typeUrl(url: string): Promise<void> {
        await this.urlInput.click();
        await this.page.keyboard.type(url);
    }

    // ── Query params ───────────────────────────────────────────────────────────

    async fillQueryParams(text: string): Promise<void> {
        await this.queryParamsBulkEdit.click();
        await this.queryParamsBulkEdit.fill(text);
    }

    async switchQueryParamsToKeyValue(): Promise<void> {
        await this.queryParamsKeyValueBtn.click();
    }

    // ── Headers ────────────────────────────────────────────────────────────────

    async fillHeaders(text: string): Promise<void> {
        await this.headersBulkEdit.click();
        await this.headersBulkEdit.fill(text);
    }

    async switchHeadersToKeyValue(): Promise<void> {
        await this.headersKeyValueBtn.click();
    }

    // ── Body type ──────────────────────────────────────────────────────────────

    async selectBodyType(type: 'form-data' | 'x-www-form-urlencoded' | 'json' | 'raw'): Promise<void> {
        switch (type) {
            case 'form-data': await this.formDataRadio.click(); break;
            case 'x-www-form-urlencoded': await this.urlEncodedRadio.click(); break;
            case 'json': await this.jsonRadio.click(); break;
            case 'raw': await this.rawRadio.click(); break;
        }
    }

    // ── Save ───────────────────────────────────────────────────────────────────

    async save(): Promise<void> {
        await this.saveButton.click({ force: true });
    }

    async reopenEditor(): Promise<void> {
        // Wait for panel to fully close after save
        await this.saveButton.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        await this.dismissOverlay();
        await this.httpApiStepNode.first().click({ force: true });
        await this.waitForPanelReady();
    }

    async getUrlValue(): Promise<string> {
        return (await this.urlInput.inputValue().catch(async () =>
            (await this.urlInput.textContent()) ?? ''
        ));
    }

    // ── Method options ────────────────────────────────────────────────────────

    async getMethodOptionCount(): Promise<number> {
        await this.methodDropdown.click();
        const count = await this.page.getByRole('option').count();
        await this.page.keyboard.press('Escape');
        return count;
    }

    // ── cURL ──────────────────────────────────────────────────────────────────

    async typeCurlCommand(text: string): Promise<void> {
        await this.curlTextbox.click();
        await this.page.keyboard.type(text);
    }

    async applyCurlCommand(text: string): Promise<void> {
        await this.curlTextbox.click();
        await this.page.keyboard.type(text);
        await this.page.waitForTimeout(300);
        // JS click on Apply bypasses any overlay
        await this.curlApplyButton.evaluate((el) => (el as HTMLElement).click());
        await this.page.waitForTimeout(2000);
        // Aggressively dismiss all overlays via raw DOM
        await this.page.evaluate(() => {
            // Close Available Variables panel
            document.querySelectorAll('p').forEach((p) => {
                if (p.textContent?.includes('Available Variables')) {
                    const btn = p.parentElement?.querySelector('button');
                    if (btn) (btn as HTMLElement).click();
                }
            });
            // Close Flow Document popover — find Close button by sibling iframe
            document.querySelectorAll('iframe').forEach((iframe) => {
                const container = iframe.parentElement;
                if (container) {
                    container.querySelectorAll('button').forEach((btn) => {
                        if (btn.textContent?.includes('Close')) (btn as HTMLElement).click();
                    });
                }
            });
        });
        await this.page.waitForTimeout(500);
    }

    // ── URL clearing ──────────────────────────────────────────────────────────

    async clearUrl(): Promise<void> {
        await this.urlInput.click({ clickCount: 3 });
        await this.page.keyboard.press('Backspace');
        await this.page.waitForTimeout(300);
    }

    // ── API name ──────────────────────────────────────────────────────────────

    async fillApiName(name: string): Promise<void> {
        await this.apiNameInput.click();
        await this.apiNameInput.fill(name);
    }

    // ── Query params bulk typing ─────────────────────────────────────────────

    async typeQueryParamsBulk(text: string): Promise<void> {
        await this.queryParamsBulkTextbox.click();
        await this.page.keyboard.type(text);
        await this.queryParamsLabel.click({ force: true });
        await this.page.waitForTimeout(300);
    }

    // ── Headers bulk typing ──────────────────────────────────────────────────

    async typeHeadersBulk(text: string): Promise<void> {
        await this.headersBulkTextbox.click();
        await this.page.keyboard.type(text);
        await this.headersLabel.click({ force: true });
        await this.page.waitForTimeout(300);
    }

    // ── Form key-value interactions ──────────────────────────────────────────

    formKeyInput(index: number): Locator {
        return this.page.getByPlaceholder(`key ${index}`);
    }

    formValueInput(index: number): Locator {
        return this.page.getByPlaceholder(`value ${index}`);
    }

    async typeFormKey(index: number, text: string): Promise<void> {
        await this.formKeyInput(index).click();
        await this.page.keyboard.type(text);
        await this.queryParamsLabel.click({ force: true });
        await this.page.waitForTimeout(300);
    }

    async typeFormValue(index: number, text: string): Promise<void> {
        await this.formValueInput(index).click({ force: true });
        await this.page.keyboard.type(text);
        await this.queryParamsLabel.click({ force: true });
        await this.page.waitForTimeout(300);
    }

    async clickAddRow(): Promise<void> {
        await this.addRowButton.click({ force: true });
    }

    async clickDeleteRow(index: number): Promise<void> {
        await this.deleteRowButtons.nth(index).click({ force: true });
        await this.page.waitForTimeout(300);
    }

    async getDeleteRowCount(): Promise<number> {
        return await this.deleteRowButtons.count();
    }

    // ── Raw body type dropdown ───────────────────────────────────────────────

    getRawBodyTypeDropdown(): Locator {
        // Second combobox in API Editor region (first is method dropdown)
        return this.page.getByRole('combobox', { name: 'Without label' }).nth(1);
    }

    async selectRawBodyType(type: string): Promise<void> {
        await this.getRawBodyTypeDropdown().click();
        await this.page.getByRole('option', { name: type }).click();
    }

    async getRawBodyTypeValue(): Promise<string> {
        return (await this.getRawBodyTypeDropdown().textContent()) ?? '';
    }

    // ── Bulk textbox content retrieval ────────────────────────────────────────

    async getQueryParamsBulkValue(): Promise<string> {
        return (await this.queryParamsBulkTextbox.textContent()) ?? '';
    }

    async getHeadersBulkValue(): Promise<string> {
        return (await this.headersBulkTextbox.textContent()) ?? '';
    }
}

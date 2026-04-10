import { Page, Locator } from '@playwright/test';

/**
 * Delay Component
 * Handles: Delay (Wait) step panel — delay statement input, AI preview toggle,
 *          save/test actions, add-step flow, canvas interactions
 * Reference: pluginV2.tsx, aiInputComponentV1.tsx, customAutoSuggestV2.tsx,
 *            saveButtonV3.tsx, dryRunButton.tsx, stepNameComponentV2.tsx,
 *            pluginHocV2.tsx, AddStepSlider.tsx
 *
 * IMPORTANT:
 *  - The delay input uses CustomAutoSuggestV2 (MentionsInput / textarea) with placeholder.
 *  - On focus, the "Available Variables" MUI Popover may open, adding aria-hidden="true"
 *    to the root div and breaking getByRole locators.
 *  - The AI auto-correct runs on blur of the input field.
 *  - The panel header shows "Wait" (the step name from the plugin action).
 *  - The "Show AI Preview" toggle switches between two CustomAutoSuggestV2 modes.
 */
export class DelayComponent {
    readonly page: Page;

    // ── Add-step flow ──────────────────────────────────────────────────────────
    readonly addStepButton: Locator;
    readonly delayOption: Locator;
    readonly closeOverlayButton: Locator;

    // ── Panel header ─────────────────────────────────────────────────────────
    readonly panelHeading: Locator;
    readonly changeButton: Locator;
    readonly closeButton: Locator;

    // ── Delay input ──────────────────────────────────────────────────────────
    readonly delayInput: Locator;
    readonly delayLabel: Locator;

    // ── AI Preview toggle ────────────────────────────────────────────────────
    readonly aiPreviewToggle: Locator;
    readonly aiPreviewLabel: Locator;

    // ── Field mapping & AI submit ──────────────────────────────────
    readonly fieldMappingButton: Locator;
    readonly submitAiButton: Locator;

    // ── Footer buttons ───────────────────────────────────────────────────────
    readonly testButton: Locator;
    readonly saveButton: Locator;

    // ── Error / validation ───────────────────────────────────────────────────
    readonly emptyFieldError: Locator;

    // ── Help ─────────────────────────────────────────────────────────────────
    readonly helpButton: Locator;

    // ── Canvas nodes ───────────────────────────────────────────────────────
    readonly canvasWaitNode: Locator;
    readonly unsavedChangesChip: Locator;

    // ── Response section ─────────────────────────────────────────────────────
    readonly responseSection: Locator;

    constructor(page: Page) {
        this.page = page;

        // Add-step flow
        this.addStepButton = page.getByTestId('add-step-button');
        this.delayOption = page.getByTestId('builtin-tool-option')
            .filter({ hasText: 'Delay' });
        this.closeOverlayButton = page.getByTestId('slider-back-button');

        // Panel header — step name input has id='function-title-textfield' (stable ID)
        this.panelHeading = page.locator('#function-title-textfield');
        this.changeButton = page.getByTestId('step-change-button');
        this.closeButton = page.getByTestId('slider-close-button');

        // Delay input — MentionsInput textarea with placeholder
        this.delayInput = page.getByPlaceholder('e.g. Delay of 15 minutes');
        this.delayLabel = page.getByText('Enter Delay statement here', { exact: true });

        // AI Preview toggle — no testid; target the switch input's parent label by its text
        this.aiPreviewToggle = page.locator('label').filter({ hasText: 'Check AI response' }).locator('span[role="checkbox"], input[type="checkbox"]').first();
        this.aiPreviewLabel = page.getByText('Check AI response', { exact: true });

        // Field mapping button — aria-label based (no testid available)
        this.fieldMappingButton = page.locator('button[aria-label="Click for Field Mapping"]');

        // AI submit button — Fab with ArrowUpward icon; target by aria-label or role=button with title
        this.submitAiButton = page.locator('button[aria-label="submit"]').or(page.locator('[role="button"][title="submit"]')).first();

        // Footer buttons
        this.testButton = page.getByTestId('dry-run-test-button');
        this.saveButton = page.getByTestId('save-button');

        // Error text — no testid; stable by exact text content
        this.emptyFieldError = page.getByText("This field can't be empty.", { exact: true });

        // Help button — no testid; exact text match
        this.helpButton = page.getByText('Help', { exact: true });

        // Canvas nodes — no testid on canvas step nodes; scoped to paragraph text
        this.canvasWaitNode = page.locator('p').filter({ hasText: /^Wait$/ }).first();
        this.unsavedChangesChip = page.getByText('Unsaved Changes', { exact: true });

        // Response section (appears after TEST)
        this.responseSection = page.getByTestId('dry-run-expand-response');
    }

    // ── Add-step flow ──────────────────────────────────────────────────────────

    async clickAddStepButton(): Promise<void> {
        await this.addStepButton.click();
    }

    async selectDelayOption(): Promise<void> {
        // Use evaluate click to bypass tooltip overlay that can intercept pointer events
        await this.delayOption.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.evaluate(() => {
            const options = document.querySelectorAll('[data-testid="builtin-tool-option"]');
            for (const opt of options) {
                if (opt.textContent?.includes('Delay')) {
                    (opt as HTMLElement).click();
                    return;
                }
            }
        });
    }

    async closeAddStepOverlay(): Promise<void> {
        await this.closeOverlayButton.click();
    }

    // ── Panel readiness ────────────────────────────────────────────────────────

    async waitForPanelReady(): Promise<void> {
        await this.saveButton.waitFor({ state: 'visible', timeout: 30000 });
    }

    // ── Dismiss overlays ───────────────────────────────────────────────────────

    /**
     * Dismiss "Available Variables" popover and any other overlay.
     * The popover opens on input focus and adds aria-hidden to root.
     */
    async dismissOverlays(): Promise<void> {
        await this.page.evaluate(() => {
            // Close Available Variables popover
            const allP = document.querySelectorAll('p');
            allP.forEach((p) => {
                if (p.textContent?.trim() === 'Available Variables') {
                    const container = p.closest('.MuiPaper-root');
                    const closeBtn = container?.querySelector('button');
                    if (closeBtn) (closeBtn as HTMLElement).click();
                }
            });
            // Close Flow Document popover (has iframe)
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach((iframe) => {
                const parent = iframe.closest('.MuiPaper-root');
                if (parent) {
                    const btns = parent.querySelectorAll('button');
                    btns.forEach((btn) => {
                        if (btn.textContent?.includes('Close')) btn.click();
                    });
                }
            });
        });
        await this.page.waitForTimeout(300);
    }

    // ── Delay input interactions ───────────────────────────────────────────────

    /**
     * Fill the delay input using keyboard.type().
     * MentionsInput requires keyboard events to trigger React onChange.
     * Handles the Available Variables popover that opens on focus.
     */
    async fillDelay(text: string): Promise<void> {
        for (let attempt = 0; attempt < 2; attempt++) {
            await this.dismissOverlays();
            await this.delayInput.click({ force: true });
            await this.page.waitForTimeout(200);
            await this.dismissOverlays();
            await this.delayInput.click({ force: true });
            await this.delayInput.focus();
            await this.page.waitForTimeout(100);
            await this.page.keyboard.type(text, { delay: 20 });
            // Verify the value was actually set
            const value = await this.delayInput.inputValue().catch(() => '');
            if (value.includes(text)) return;
            // Clear and retry
            await this.delayInput.click({ force: true });
            await this.page.keyboard.press('Control+a');
            await this.page.keyboard.press('Delete');
        }
    }

    /**
     * Type into the delay input without clearing first.
     */
    async typeDelay(text: string): Promise<void> {
        await this.dismissOverlays();
        await this.delayInput.click({ force: true });
        await this.page.waitForTimeout(200);
        await this.dismissOverlays();
        await this.delayInput.click({ force: true });
        await this.page.keyboard.type(text, { delay: 20 });
    }

    /**
     * Get the current value of the delay input.
     */
    async getDelayValue(): Promise<string> {
        return await this.delayInput.inputValue();
    }

    /**
     * Clear the delay input field.
     */
    async clearDelay(): Promise<void> {
        // Try fill('') first — works on standard <input> elements
        try {
            await this.delayInput.fill('', { timeout: 2000 });
            const val = await this.delayInput.inputValue().catch(() => 'x');
            if (val === '') return;
        } catch { /* contenteditable — fall through */ }

        // Fallback: triple-click to select all, then delete
        await this.delayInput.click({ force: true, clickCount: 3 });
        await this.page.keyboard.press('Backspace');
        await this.page.waitForTimeout(300);

        // Last resort: Ctrl+A + Delete
        const remaining = await this.delayInput.inputValue().catch(() => '');
        if (remaining !== '') {
            await this.delayInput.click({ force: true });
            await this.page.keyboard.press('Control+a');
            await this.page.keyboard.press('Delete');
            await this.page.waitForTimeout(300);
        }
    }

    // ── AI Preview toggle ────────────────────────────────────────────────────

    async toggleAiPreview(): Promise<void> {
        await this.aiPreviewToggle.click();
    }

    async isAiPreviewChecked(): Promise<boolean> {
        const switchInput = this.page.locator('input[type="checkbox"]').first();
        return await switchInput.isChecked();
    }

    // ── AI processing ──────────────────────────────────────────────────────

    /**
     * Wait for AI auto-correct to finish processing.
     * autoCorrectByAi sets window.__aiFieldLoading = true at start,
     * and window.__aiFieldLoading = false in finally block.
     * After AI completes, the Redux value is set and validation error disappears.
     */
    async waitForAiProcessing(): Promise<void> {
        // Wait for __aiFieldLoading to become false (AI done)
        try {
            await this.page.waitForFunction(
                () => (window as any).__aiFieldLoading !== true,
                { timeout: 30000 }
            );
        } catch {
            // Timeout — AI may have failed or never started
        }
        // Extra settle time for React re-render after Redux update
        await this.page.waitForTimeout(1000);
    }

    /**
     * Fill delay input and ensure the Redux value is set so the step can be saved.
     *
     * Strategy: Toggle "Check AI response" ON → the input switches to a non-AI mode
     * where blur DIRECTLY dispatches setValueOnKey({ [parentKey]: html }) to Redux.
     * This bypasses the async AI API (autoCorrectByAi) which requires the
     * ArrowUpward Fab button click and an external API call.
     *
     * Source: aiInputComponentV1.tsx lines 164-184 (showInput=true branch)
     */
    async fillDelayAndSubmitAi(text: string): Promise<void> {
        // Step 0: Dismiss any overlays that might block interaction
        await this.dismissOverlays();

        // Step 1: Ensure "Check AI response" toggle is ON (showInput=true).
        // When ON, the input is non-AI mode and blur directly sets Redux value.
        const isChecked = await this.isAiPreviewChecked();
        if (!isChecked) {
            // Use force:true to bypass any remaining overlay
            await this.aiPreviewToggle.click({ force: true });
            await this.page.waitForTimeout(500);
        }

        // Step 2: Fill the input (now in non-AI mode, same placeholder)
        await this.fillDelay(text);

        // Step 3: Blur the input to trigger getHtmlAndValue → direct Redux dispatch
        await this.dismissOverlays();
        await this.delayLabel.click({ force: true }).catch(async () => {
            await this.page.keyboard.press('Tab');
        });
        await this.page.waitForTimeout(1500);
    }

    // ── Save ─────────────────────────────────────────────────────────────────

    /**
     * Click save using page.evaluate with MouseEvent dispatch.
     * Bypasses any overlay that covers the button.
     * Waits for AI processing to complete first.
     */
    async save(): Promise<void> {
        await this.waitForAiProcessing();
        await this.dismissOverlays();
        // Wait for save button to be enabled
        await this.page.waitForFunction(
            (sel) => {
                const buttons = document.querySelectorAll(sel) as NodeListOf<HTMLButtonElement>;
                return Array.from(buttons).some((btn) => !btn.disabled);
            },
            '[data-testid="save-button"]',
            { timeout: 15000 }
        );
        await this.page.evaluate(() => {
            const buttons = document.querySelectorAll('[data-testid="save-button"]') as NodeListOf<HTMLButtonElement>;
            for (const btn of buttons) {
                if (!btn.disabled) {
                    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                    break;
                }
            }
        });
    }

    /**
     * Save and wait for panel to close.
     */
    async saveAndWait(): Promise<void> {
        await this.save();
        // Panel closes after save — wait for save button to disappear
        try {
            await this.saveButton.waitFor({ state: 'hidden', timeout: 15000 });
        } catch {
            // Panel may already be hidden
        }
        // Also wait for "Unsaved Changes" chip to disappear (save API completion)
        try {
            await this.unsavedChangesChip.waitFor({ state: 'hidden', timeout: 15000 });
        } catch {
            // Chip may already be hidden or not present
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Click the TEST button using page.evaluate.
     */
    async test(): Promise<void> {
        await this.dismissOverlays();
        await this.page.evaluate(() => {
            const btn = document.querySelector('[data-testid="dry-run-test-button"]') as HTMLButtonElement;
            if (btn) btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
    }

    /**
     * Check if save button is enabled.
     */
    async isSaveEnabled(): Promise<boolean> {
        return await this.saveButton.isEnabled();
    }

    /**
     * Check if save button is disabled.
     */
    async isSaveDisabled(): Promise<boolean> {
        return await this.saveButton.isDisabled();
    }

    /**
     * Check if test button is visible.
     */
    async isTestVisible(): Promise<boolean> {
        return await this.testButton.isVisible();
    }

    /**
     * Get save button text content.
     */
    async getSaveButtonText(): Promise<string> {
        return (await this.saveButton.textContent()) || '';
    }

    /**
     * Get test button text content.
     */
    async getTestButtonText(): Promise<string> {
        return (await this.testButton.textContent()) || '';
    }

    // ── Panel header interactions ────────────────────────────────────────────

    async clickChangeButton(): Promise<void> {
        await this.changeButton.click();
    }

    async isPanelOpen(): Promise<boolean> {
        return await this.saveButton.isVisible();
    }

    // ── Canvas interactions ──────────────────────────────────────────────────

    /**
     * Click the Wait node on the canvas to reopen the panel.
     */
    async clickCanvasWaitNode(): Promise<void> {
        await this.canvasWaitNode.click();
    }

    /**
     * Reopen panel after save by clicking the canvas node.
     * After save, the canvas may show original or AI-modified text.
     * Falls back to clicking any path node text on the canvas.
     */
    async reopenPanelAfterSave(_delayText?: string): Promise<void> {
        // After save, the canvas shows "Wait" (+ "Newly Added" chip).
        // The clickable element structure (from DOM snapshot):
        //   generic [cursor=pointer]:
        //     generic: Wait         ← text node
        //     generic: Newly Added  ← chip
        //     img                   ← icon
        // We find the "Wait" text element and click its parent (the cursor:pointer container).
        await this.page.evaluate(() => {
            const allEls = document.querySelectorAll('div, span, p');
            for (const el of allEls) {
                // Direct text content match (exclude children text)
                const directText = Array.from(el.childNodes)
                    .filter(n => n.nodeType === Node.TEXT_NODE)
                    .map(n => n.textContent?.trim())
                    .join('');
                if (directText === 'Wait' && el.parentElement) {
                    // Click the parent container (the cursor:pointer element)
                    (el.parentElement as HTMLElement).click();
                    return;
                }
            }
        });
        await this.page.waitForTimeout(1500);

        // Check if the Delay panel opened (save button visible)
        const panelReady = await this.saveButton.isVisible().catch(() => false);
        if (!panelReady) {
            // Fallback: click the step-draggable-container with "Wait" text
            try {
                await this.canvasWaitNode.click({ force: true, timeout: 5000 });
            } catch {
                // Last resort: stable getByText fallback
                const waitText = this.page.getByText('Wait', { exact: true }).first();
                await waitText.click({ force: true, timeout: 5000 }).catch(() => {});
            }
            await this.page.waitForTimeout(1000);
        }

        await this.waitForPanelReady();
        await this.page.waitForTimeout(800);
        await this.dismissOverlays();
    }

    // ── Composite helpers ────────────────────────────────────────────────────

    /**
     * Fill delay → save → wait for panel close.
     */
    async fillDelayAndSave(text: string): Promise<void> {
        await this.fillDelay(text);
        await this.saveAndWait();
    }

    /**
     * Fill delay → save → reopen panel.
     */
    async fillDelaySaveAndReopen(text: string): Promise<void> {
        for (let attempt = 0; attempt < 3; attempt++) {
            await this.fillDelay(text);
            await this.save();
            try {
                await this.saveButton.waitFor({ state: 'hidden', timeout: 8000 });
                await this.page.waitForTimeout(500);
                await this.reopenPanelAfterSave(text);
                return;
            } catch {
                await this.clearDelay();
            }
        }
        await this.reopenPanelAfterSave(text);
    }

    /**
     * Fill delay → test → wait for response.
     */
    async fillDelayAndTest(text: string): Promise<void> {
        await this.fillDelay(text);
        // Wait for AI processing to complete before clicking test
        await this.page.waitForTimeout(500);
        await this.dismissOverlays();
        // Blur the input first to trigger AI auto-correct
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(1000);
        await this.test();
    }
}

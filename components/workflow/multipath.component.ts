import { Page, Locator } from '@playwright/test';

/**
 * Multipath Component
 * Handles: Multiple Paths (If Conditions) — add step, condition paths, else block,
 *          condition input, save, add condition, accordion interactions
 * Reference: ifBlockSlider.tsx, singleConditionBlock.tsx, ifComponent.tsx,
 *            AddStepSlider.tsx, SaveButtonV3.tsx, CustomAutoSuggestV2.tsx
 *
 * IMPORTANT:
 *  - When the panel opens, the condition input gets autoFocus, which opens
 *    the "Available Variables" MUI Popover. The "Flow Document" popover may
 *    also appear. Both add aria-hidden="true" to the root, breaking getByRole.
 *  - The Else block is NOT created automatically when the IFGROUP is first
 *    created. It only appears after saving the first condition path.
 *  - The condition input is a react-mentions MentionsInput (textarea).
 *    Using fill() may not trigger React onChange; use keyboard.type() instead.
 */
export class MultipathComponent {
    readonly page: Page;

    // ── Add-step flow ──────────────────────────────────────────────────────
    readonly addStepButton: Locator;          // data-testid='add-step-button'
    readonly multipathOption: Locator;        // data-testid='builtin-tool-option' filtered
    readonly closeOverlayButton: Locator;     // icon-only button that closes add-step overlay

    // ── If Block Slider panel ──────────────────────────────────────────────
    readonly addConditionButton: Locator;     // data-testid='ifblock-add-condition-button'
    readonly saveButton: Locator;             // data-testid='save-button'
    readonly stepChangeButton: Locator;       // data-testid='step-change-button'

    // ── Condition input (CustomAutoSuggestV2 → MentionsInput → textarea) ──
    readonly conditionInput: Locator;         // placeholder='Enter a condition for path.'

    // ── Else block ─────────────────────────────────────────────────────────
    readonly elseDescription: Locator;        // text content from AccordionDetails

    // ── Expression button ──────────────────────────────────────────────────
    readonly expressionButton: Locator;

    // ── Panel heading ──────────────────────────────────────────────────────
    readonly panelHeading: Locator;           // heading "MultiPath"

    constructor(page: Page) {
        this.page = page;

        // Add-step flow — data-testid selectors
        this.addStepButton = page.getByTestId('add-step-button');
        this.multipathOption = page.getByTestId('builtin-tool-option')
            .filter({ hasText: 'Multiple Paths' });
        this.closeOverlayButton = page.getByRole('button').filter({ hasText: /^$/ }).first();

        // If Block Slider panel — data-testid selectors
        this.addConditionButton = page.getByTestId('ifblock-add-condition-button');
        this.saveButton = page.getByTestId('save-button');
        this.stepChangeButton = page.getByTestId('step-change-button');

        // Condition input — placeholder selector (MentionsInput renders textarea)
        this.conditionInput = page.getByPlaceholder('Enter a condition for path.');

        // Else description — text content
        this.elseDescription = page.getByText(
            'This path is executed when none of the other conditions are met.'
        );

        // Expression button — use locator to avoid aria-hidden issues
        this.expressionButton = page.locator('button:text-is("Expression")');

        // Panel heading
        this.panelHeading = page.locator('h5:text-is("MultiPath")');
    }

    // ── Add-step flow ──────────────────────────────────────────────────────

    async clickAddStepButton(): Promise<void> {
        await this.addStepButton.click();
    }

    async selectMultipathOption(): Promise<void> {
        await this.multipathOption.click();
    }

    async closeAddStepOverlay(): Promise<void> {
        await this.closeOverlayButton.click();
    }

    // ── Panel readiness ────────────────────────────────────────────────────

    async waitForPanelReady(): Promise<void> {
        await this.conditionInput.first().waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Dismiss ALL popovers that may be blocking the UI:
     * 1. "Available Variables" popover — click close button next to the title
     * 2. "Flow Document" popover — click "Close" button near the iframe
     * Uses page.evaluate() for raw DOM manipulation to bypass aria-hidden.
     */
    async dismissOverlays(): Promise<void> {
        await this.page.waitForTimeout(300);
        // Phase 1: evaluate — handles both popovers via raw DOM
        await this.page.evaluate(() => {
            // Close "Available Variables" popover
            document.querySelectorAll('p').forEach((p) => {
                if (p.textContent?.includes('Available Variables')) {
                    const btn = p.parentElement?.querySelector('button');
                    if (btn) (btn as HTMLElement).click();
                }
            });
            // Close "Flow Document" popover — search ALL buttons for "Close" text
            document.querySelectorAll('button').forEach((btn) => {
                const text = (btn.textContent || '').trim();
                if (text.includes('Close') && !text.includes('New tab') && !text.includes('Add')) {
                    (btn as HTMLElement).click();
                }
            });
        });
        await this.page.waitForTimeout(300);
        // Phase 2: Playwright locator fallback (off-screen popovers may survive evaluate)
        try {
            const flowDocClose = this.page.locator('button').filter({ hasText: /Close/ }).filter({ hasText: /×/ });
            if (await flowDocClose.count() > 0) {
                await flowDocClose.first().click({ force: true, timeout: 2000 });
            }
        } catch {
            // Already dismissed or not present
        }
        await this.page.waitForTimeout(200);
    }

    // ── Condition input ────────────────────────────────────────────────────

    /**
     * Type a condition into the condition input using keyboard.type().
     * MentionsInput requires keyboard events to trigger React onChange.
     * Double dismiss+click cycle is necessary because:
     *  1. First click focuses input → triggers onFocus → reopens Available Variables popover
     *  2. onBlur resets userClosedPopoverRef=false, so popover will reopen on every focus
     *  3. Second dismiss closes the re-opened popover, second click ensures clean focus
     */
    /**
     * Get the visible condition input (the one in the expanded accordion).
     * Uses :visible pseudo-selector to skip inputs in collapsed accordions.
     */
    private getActiveConditionInput(): Locator {
        return this.page.locator('[placeholder="Enter a condition for path."]:visible').first();
    }

    async fillCondition(text: string): Promise<void> {
        for (let attempt = 0; attempt < 2; attempt++) {
            await this.dismissOverlays();
            const input = this.getActiveConditionInput();
            await input.click({ force: true });
            await this.page.waitForTimeout(150);
            await this.dismissOverlays();
            await input.click({ force: true });
            // Explicitly focus the input to prevent popover stealing focus
            await input.focus();
            await this.page.waitForTimeout(100);
            await this.page.keyboard.type(text, { delay: 20 });
            // Verify the value was actually set
            const value = await input.inputValue().catch(() => '');
            if (value.includes(text)) return;
            // Value not set — clear and retry
            await input.click({ force: true });
            await this.page.keyboard.press('Control+a');
            await this.page.keyboard.press('Delete');
        }
    }

    async typeCondition(text: string): Promise<void> {
        await this.dismissOverlays();
        const input = this.getActiveConditionInput();
        await input.click({ force: true });
        await this.page.waitForTimeout(150);
        await this.dismissOverlays();
        await input.click({ force: true });
        await this.page.keyboard.type(text, { delay: 20 });
    }

    async getConditionValue(): Promise<string> {
        return await this.getActiveConditionInput().inputValue();
    }

    async clearCondition(): Promise<void> {
        const input = this.getActiveConditionInput();
        await input.click({ force: true });
        await this.page.keyboard.press('Control+a');
        await this.page.keyboard.press('Delete');
    }

    // ── Save ───────────────────────────────────────────────────────────────

    /**
     * Click the save button. Waits for the button to become enabled first
     * (disabled buttons ignore both native and programmatic clicks in React).
     * Uses page.evaluate to click, bypassing any overlay that covers the button.
     */
    async save(): Promise<void> {
        // Dismiss overlays that may intercept events
        await this.dismissOverlays();
        // Wait for ANY save button to be enabled (multi-path: first may be disabled)
        await this.page.waitForFunction(
            (sel) => {
                const buttons = document.querySelectorAll(sel) as NodeListOf<HTMLButtonElement>;
                return Array.from(buttons).some((btn) => !btn.disabled);
            },
            '[data-testid="save-button"]',
            { timeout: 15000 }
        );
        // Click the enabled save button with proper MouseEvents for React event delegation
        await this.page.evaluate(() => {
            const buttons = document.querySelectorAll('[data-testid="save-button"]') as NodeListOf<HTMLButtonElement>;
            const enabled = Array.from(buttons).find((btn) => !btn.disabled);
            if (enabled) {
                const opts: MouseEventInit = { bubbles: true, cancelable: true };
                enabled.dispatchEvent(new MouseEvent('mousedown', opts));
                enabled.dispatchEvent(new MouseEvent('mouseup', opts));
                enabled.dispatchEvent(new MouseEvent('click', opts));
            }
        });
    }

    /**
     * Save the condition and wait for the save to complete.
     * After saving, the path transitions from DRAFTED to ACTIVE.
     */
    async saveAndWait(): Promise<void> {
        await this.save();
        // After successful save, the panel closes (setParams sets stepId/slugName to null).
        // Wait for the MultiPath heading to disappear as confirmation.
        try {
            await this.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 10000 });
        } catch {
            // Panel didn't close — save may not have registered. Retry once.
            await this.save();
            await this.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 10000 });
        }
        // Small buffer for canvas to update
        await this.page.waitForTimeout(500);
    }

    async isSaveVisible(): Promise<boolean> {
        return this.saveButton.isVisible();
    }

    async isSaveDisabled(): Promise<boolean> {
        return this.saveButton.isDisabled();
    }

    // ── Add condition ──────────────────────────────────────────────────────

    async addCondition(): Promise<void> {
        // Wait for the button to be in the DOM and visible before clicking
        await this.addConditionButton.waitFor({ state: 'visible', timeout: 5000 });
        // Use evaluate to bypass any overlay and ensure React handler fires
        await this.page.evaluate(() => {
            const btn = document.querySelector('[data-testid="ifblock-add-condition-button"]') as HTMLElement;
            if (btn) btn.click();
        });
    }

    /**
     * Add condition, wait for new path, ensure it is expanded, and dismiss overlays.
     * After addCondition(), a React re-render race can reset URL params to the
     * switchParent, collapsing the new path. We detect this and use Playwright's
     * native click to expand Path 3, retrying until the condition input is visible.
     */
    async addConditionAndDismiss(): Promise<void> {
        await this.addCondition();
        // Wait for new path header to appear in the panel
        await this.getPathAccordionHeader(3).waitFor({ state: 'visible', timeout: 10000 });
        // Wait for the React re-render race to fully settle
        await this.page.waitForTimeout(2000);
        await this.dismissOverlays();
        // Ensure Path 3 is expanded — retry up to 3 times
        for (let attempt = 0; attempt < 3; attempt++) {
            const isExpanded = await this.page.evaluate(() => {
                const buttons = document.querySelectorAll('button');
                for (const btn of buttons) {
                    const h6 = btn.querySelector('h6');
                    if (h6 && h6.textContent?.trim() === 'Path 3') {
                        return btn.getAttribute('aria-expanded') === 'true';
                    }
                }
                return false;
            });
            if (isExpanded) break;
            // Click Path 3 header with native Playwright click
            await this.clickPathAccordion(3);
            await this.page.waitForTimeout(1000);
            await this.dismissOverlays();
        }
    }

    async isAddConditionVisible(): Promise<boolean> {
        return this.addConditionButton.isVisible();
    }

    // ── Path accordions ────────────────────────────────────────────────────

    /**
     * Get a path accordion summary by its path number.
     * Uses CSS :text-is() pseudo-class to avoid aria-hidden issues.
     */
    getPathAccordionHeader(pathNumber: number): Locator {
        return this.page.locator(`h6:text-is("Path ${pathNumber}")`);
    }

    async clickPathAccordion(pathNumber: number): Promise<void> {
        // Use MouseEvent dispatch for reliable React event delegation
        await this.page.evaluate((pn) => {
            document.querySelectorAll('button').forEach((btn) => {
                const h6 = btn.querySelector('h6');
                if (h6 && h6.textContent?.trim() === `Path ${pn}`) {
                    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                }
            });
        }, pathNumber);
    }

    async isPathVisible(pathNumber: number): Promise<boolean> {
        return this.getPathAccordionHeader(pathNumber).isVisible();
    }

    /**
     * Get the Else accordion header.
     * Note: Else block only exists AFTER saving the first condition path.
     */
    getElseAccordionHeader(): Locator {
        return this.page.locator('h6:text-is("Else")');
    }

    async clickElseAccordion(): Promise<void> {
        // Use MouseEvent dispatch for reliable React event delegation
        await this.page.evaluate(() => {
            document.querySelectorAll('button').forEach((btn) => {
                const h6 = btn.querySelector('h6');
                if (h6 && h6.textContent?.trim() === 'Else') {
                    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                }
            });
        });
    }

    async isElseVisible(): Promise<boolean> {
        return this.getElseAccordionHeader().isVisible();
    }

    async isElseDescriptionVisible(): Promise<boolean> {
        return this.elseDescription.isVisible();
    }

    // ── Draft chip ─────────────────────────────────────────────────────────

    getDraftChip(): Locator {
        return this.page.locator('.MuiChip-label').filter({ hasText: 'Draft' });
    }

    async isDraftChipVisible(): Promise<boolean> {
        return this.getDraftChip().first().isVisible();
    }

    /**
     * Get Configure chip on canvas node.
     */
    getConfigureChip(): Locator {
        return this.page.locator('.MuiChip-label').filter({ hasText: 'Configure' });
    }

    // ── Expression ─────────────────────────────────────────────────────────

    async clickExpression(): Promise<void> {
        await this.expressionButton.click();
    }

    async isExpressionVisible(): Promise<boolean> {
        return this.expressionButton.isVisible();
    }

    // ── Canvas badges ─────────────────────────────────────────────────────

    /**
     * Get the True badge (green) on canvas — appears when condition evaluates to true.
     * MUI Badge: <span class="MuiBadge-badge MuiBadge-colorSuccess">True</span>
     */
    getCanvasTrueBadge(): Locator {
        return this.page.locator('.MuiBadge-badge.MuiBadge-colorSuccess');
    }

    /**
     * Get the False badge (red) on canvas — appears when condition evaluates to false.
     */
    getCanvasFalseBadge(): Locator {
        return this.page.locator('.MuiBadge-badge.MuiBadge-colorError');
    }

    /**
     * Get the Error badge (warning) on canvas — appears when condition evaluation fails.
     */
    getCanvasErrorBadge(): Locator {
        return this.page.locator('.MuiBadge-badge.MuiBadge-colorWarning');
    }

    // ── Canvas elements ──────────────────────────────────────────────────

    /**
     * "Continue from here" text below the IF block on canvas.
     */
    getContinueFromHereText(): Locator {
        return this.page.locator('text=Continue from here');
    }

    /**
     * "Add or drag step here" button inside a saved path on canvas.
     * Only visible for ACTIVE paths (not DRAFTED).
     */
    getAddStepInsidePath(): Locator {
        return this.page.locator('text=Add or drag step here');
    }

    /**
     * Get Else node text on canvas (paragraph, not h6 which is the panel accordion).
     */
    getCanvasElseNode(): Locator {
        return this.page.locator('p:text-is("Else")');
    }

    /**
     * Get the three-dot actions menu trigger on canvas path nodes.
     */
    getActionsMenuTrigger(): Locator {
        return this.page.getByTestId('actions-menu-trigger');
    }

    /**
     * Get menu items in the actions dropdown (after clicking three-dot menu).
     */
    getActionsMenuItem(): Locator {
        return this.page.getByTestId('actions-menu-item');
    }

    // ── Evaluation result ──────────────────────────────────────────────────

    /**
     * Evaluation result text (true/false) below the condition input in the panel.
     * Rendered as <Typography class="break-all" variant="body1">true</Typography>.
     */
    getEvaluationResult(): Locator {
        return this.page.locator('p.break-all');
    }

    // ── Save button inspection ──────────────────────────────────────────────

    /**
     * Get the visible text of the save button (e.g. "SAVE", "Ask AI", "Accept Changes By AI").
     */
    async getSaveButtonText(): Promise<string> {
        return (await this.saveButton.innerText()).trim();
    }

    // ── Canvas add-condition button ─────────────────────────────────────────

    /**
     * The "+" IconButton on canvas (SwitchComponent) for adding a new condition.
     * Only visible when no draft condition exists.
     * Uses the MUI Add icon's data-testid.
     */
    getCanvasAddConditionButton(): Locator {
        return this.page.locator('button:has([data-testid="AddIcon"])');
    }

    // ── Canvas path text ────────────────────────────────────────────────────

    /**
     * Get the canvas node text for a specific path (e.g. "Path 1", "true", etc.).
     * After save, the node text changes from "Path N" to the condition statement.
     */
    getCanvasPathText(text: string): Locator {
        return this.page.locator(`p:text-is("${text}")`);
    }

    // ── Three-dot menu with hover ───────────────────────────────────────────

    /**
     * Hover over a canvas path node and click the three-dot menu.
     * The menu icon has class 'hiddenMenuButton' (opacity:0), visible only on hover.
     * @param pathText The text on the canvas node to hover (e.g. "Path 1", "true").
     */
    async hoverAndClickActionsMenu(pathText: string): Promise<void> {
        const pathNode = this.page.locator(`p:text-is("${pathText}")`).first();
        // Hover the parent box to trigger CSS :hover → opacity:1
        const parentBox = pathNode.locator('xpath=ancestor::div[contains(@class,"p-2")]').first();
        await parentBox.hover();
        await this.page.waitForTimeout(300);
        // Click the actions-menu-trigger inside this box
        const menuTrigger = parentBox.locator('[data-testid="actions-menu-trigger"]');
        await menuTrigger.click({ force: true });
        await this.page.waitForTimeout(300);
    }

    // ── Accordion expand icon ───────────────────────────────────────────────

    /**
     * Get the accordion expand icon (ExpandMoreIcon) in accordion headers.
     */
    getExpandIcon(): Locator {
        return this.page.locator('[data-testid="ExpandMoreIcon"]');
    }

    // ── Canvas interaction ─────────────────────────────────────────────────

    /**
     * Click a path node on the canvas to open/reopen the slider.
     */
    async clickCanvasPathNode(text: string): Promise<void> {
        await this.page.locator(`p:text-is("${text}")`).first().click();
    }

    /**
     * Click the canvas "Path N" node — uses paragraph element on canvas.
     */
    async clickCanvasPath(pathNumber: number): Promise<void> {
        await this.page.locator(`p:text-is("Path ${pathNumber}")`).first().click();
    }

    /**
     * Click the Else node on the canvas.
     */
    async clickCanvasElseNode(): Promise<void> {
        await this.page.locator('p:text-is("Else")').first().click();
    }

    /**
     * Get the canvas IF node button.
     */
    getCanvasIfButton(): Locator {
        return this.page.locator('button:text-is("IF")');
    }

    // ── Reopen panel ───────────────────────────────────────────────────────

    /**
     * Reopen the slider panel after save by clicking on a canvas condition node.
     * After save, the panel closes (setParams sets stepId/slugName to null).
     * The canvas shows condition text in `<p>` tags inside clickable boxes.
     * @param conditionText The saved condition text to click on the canvas.
     */
    async reopenPanelAfterSave(conditionText?: string): Promise<void> {
        let clicked = false;
        if (conditionText) {
            // Try exact text match first (works when AI doesn't rename)
            const node = this.page.locator(`p:text-is("${conditionText}")`).first();
            try {
                await node.click({ timeout: 3000 });
                clicked = true;
            } catch {
                // AI may rename the step title on save — fall through to fallback
            }
        }
        if (!clicked) {
            // Fallback: click the IF canvas node which always opens the multipath panel
            await this.page.locator('button:text-is("IF")').click({ timeout: 5000 });
            // IF button opens at switchParent level — all accordions collapsed.
            // Wait for panel header, then expand the first accordion.
            await this.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'visible', timeout: 5000 });
            await this.page.waitForTimeout(300);
            // Click the first accordion button (has aria-expanded attribute)
            await this.page.evaluate(() => {
                const btn = document.querySelector('button[aria-expanded]') as HTMLElement;
                if (btn) btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            });
            await this.page.waitForTimeout(500);
        }
        await this.waitForPanelReady();
        // Wait for RAF + React state update to fully render the popover
        await this.page.waitForTimeout(800);
        await this.dismissOverlays();
    }

    async reopenPanel(): Promise<void> {
        await this.clickCanvasPath(1);
        await this.waitForPanelReady();
        await this.dismissOverlays();
    }

    // ── Step change button ─────────────────────────────────────────────────

    async isStepChangeButtonVisible(): Promise<boolean> {
        return this.stepChangeButton.isVisible();
    }

    // ── Composite helpers ──────────────────────────────────────────────────

    /**
     * Fill condition → save → wait for save.
     * After save the panel CLOSES (slider sets params to null).
     * Use fillConditionSaveAndReopen if you need the panel open afterwards.
     */
    async fillConditionAndSave(text: string): Promise<void> {
        await this.fillCondition(text);
        await this.saveAndWait();
    }

    /**
     * Fill condition → save → wait (panel closes). Does NOT reopen.
     * Use for tests that need to assert canvas state after save.
     */
    async fillConditionAndSaveOnly(text: string): Promise<void> {
        for (let attempt = 0; attempt < 3; attempt++) {
            await this.fillCondition(text);
            await this.save();
            try {
                await this.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 8000 });
                await this.page.waitForTimeout(500);
                return;
            } catch {
                await this.clearCondition();
            }
        }
    }

    /**
     * Fill condition → save → wait → reopen panel.
     * Use this when you need to interact with the panel after saving.
     */
    async fillConditionSaveAndReopen(text: string): Promise<void> {
        for (let attempt = 0; attempt < 3; attempt++) {
            await this.fillCondition(text);
            await this.save();
            // Verify save: panel should close after successful save
            try {
                await this.page.locator('h5:text-is("MultiPath")').waitFor({ state: 'hidden', timeout: 8000 });
                // Save succeeded — panel closed
                await this.page.waitForTimeout(500);
                await this.reopenPanelAfterSave(text);
                return;
            } catch {
                // Save failed — panel still open, clear and retry
                await this.clearCondition();
            }
        }
        // Last resort after retries
        await this.reopenPanelAfterSave(text);
    }
}

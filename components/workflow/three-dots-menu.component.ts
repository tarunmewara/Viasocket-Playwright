import { Page, Locator } from '@playwright/test';

/**
 * Three Dots Menu Component
 * Handles: Flow page more-options menu (···) — Move, Duplicate, Test Flow, Pause, Move To Trash
 * Reference: flowPageMoreOptions.tsx, duplicateFlowModal.tsx, customDropDown.tsx
 *
 * IMPORTANT:
 *  - The menu button uses data-testid='flow-more-options-button' (IconButton with MoreHorizIcon).
 *  - Each menu item uses data-testid='flow-menu-item' (MenuItem).
 *  - Move/Duplicate open a shared DuplicateFlowModal with different modalType.
 *  - CustomDropDown renders MUI Select with aria-label='Without label'.
 *  - Move To Trash opens a MUI Dialog with confirm/cancel buttons.
 *  - Pause dispatches changeScriptStatus and closes the menu.
 *  - Test Flow / Run flow opens the dry-run panel or triggers cron test.
 *  - After pause, the navbar shows "RESUME" button (data-testid='workflow-resume-restore-button').
 *  - After pause, a "Paused" chip appears next to the flow title.
 */
export class ThreeDotsMenuComponent {
    readonly page: Page;

    // ── Menu trigger ──────────────────────────────────────────────────────────
    readonly menuButton: Locator;
    readonly menuItems: Locator;

    // ── Menu options (filtered by text) ──────────────────────────────────────
    readonly moveOption: Locator;
    readonly duplicateOption: Locator;
    readonly testFlowOption: Locator;
    readonly pauseOption: Locator;
    readonly moveToTrashOption: Locator;

    // ── Move Flow modal ──────────────────────────────────────────────────────
    readonly moveModalTitle: Locator;
    readonly moveWorkspaceDropdown: Locator;
    readonly moveCollectionDropdown: Locator;
    readonly moveConfirmButton: Locator;
    readonly moveCancelButton: Locator;

    // ── Duplicate Flow modal ─────────────────────────────────────────────────
    readonly duplicateModalTitle: Locator;
    readonly duplicateWorkspaceDropdown: Locator;
    readonly duplicateCollectionDropdown: Locator;
    readonly duplicateTitleInput: Locator;
    readonly duplicateConfirmButton: Locator;
    readonly duplicateCancelButton: Locator;

    // ── Move To Trash dialog ─────────────────────────────────────────────────
    readonly trashDialogTitle: Locator;
    readonly trashDialogMessage: Locator;
    readonly trashDeleteButton: Locator;
    readonly trashCancelButton: Locator;

    // ── Workflow state indicators ────────────────────────────────────────────
    readonly pausedChip: Locator;
    readonly liveChip: Locator;
    readonly resumeButton: Locator;
    readonly publishChangesButton: Locator;
    readonly discardChangesButton: Locator;

    // ── Dry run panel (Test Flow) ────────────────────────────────────────────
    readonly dryRunPanel: Locator;
    readonly dryRunTestFlowButton: Locator;
    readonly dryRunCloseButton: Locator;

    // ── Navbar / Flow title ──────────────────────────────────────────────────
    readonly flowTitleInput: Locator;
    readonly editingChip: Locator;

    // ── MUI Menu container ───────────────────────────────────────────────────
    readonly muiMenu: Locator;

    // ── MUI Select dropdown listbox (for workspace/collection selection) ─────
    readonly selectListbox: Locator;

    constructor(page: Page) {
        this.page = page;

        // Menu trigger — flowPageMoreOptions.tsx
        this.menuButton = page.getByTestId('flow-more-options-button');
        this.menuItems = page.getByTestId('flow-menu-item');

        // Menu options — filter by visible text
        this.moveOption = page.getByTestId('flow-menu-item').filter({ hasText: 'Move' }).first();
        this.duplicateOption = page.getByTestId('flow-menu-item').filter({ hasText: 'Duplicate' });
        this.testFlowOption = page.getByTestId('flow-menu-item').filter({ hasText: /Test Flow|Run flow/ });
        this.pauseOption = page.getByTestId('flow-menu-item').filter({ hasText: 'Pause' });
        this.moveToTrashOption = page.getByTestId('flow-menu-item').filter({ hasText: 'Move To Trash' });

        // Move Flow modal — DuplicateFlowModal with title "Move Flow"
        this.moveModalTitle = page.getByRole('heading', { name: 'Move Flow', exact: true });
        this.moveWorkspaceDropdown = page.locator('[role="dialog"] [aria-label="Without label"]').first();
        this.moveCollectionDropdown = page.locator('[role="dialog"] [aria-label="Without label"]').nth(1);
        this.moveConfirmButton = page.getByTestId('move-script-confirm-button');
        this.moveCancelButton = page.getByTestId('duplicate-flow-cancel-button');

        // Duplicate Flow modal — DuplicateFlowModal with title "Duplicate Flow"
        this.duplicateModalTitle = page.getByRole('heading', { name: 'Duplicate Flow', exact: true });
        this.duplicateWorkspaceDropdown = page.locator('[role="dialog"] [aria-label="Without label"]').first();
        this.duplicateCollectionDropdown = page.locator('[role="dialog"] [aria-label="Without label"]').nth(1);
        this.duplicateTitleInput = page.getByPlaceholder('Enter flow title');
        this.duplicateConfirmButton = page.getByTestId('duplicate-flow-confirm-button');
        this.duplicateCancelButton = page.getByTestId('duplicate-flow-cancel-button');

        // Move To Trash dialog — MUI Dialog
        this.trashDialogTitle = page.getByText('Move workflow to trash?', { exact: true });
        this.trashDialogMessage = page.getByText('Are you sure you want to delete this workflow?', { exact: true });
        this.trashDeleteButton = page.getByTestId('flow-delete-confirm-button');
        this.trashCancelButton = page.getByTestId('flow-delete-cancel-button');

        // Workflow state indicators
        this.pausedChip = page.getByText('Paused', { exact: true }).first();
        this.liveChip = page.getByText('Live', { exact: true }).first();
        this.resumeButton = page.getByTestId('workflow-resume-restore-button');
        this.publishChangesButton = page.locator('button').filter({ hasText: 'PUBLISH CHANGES' });
        this.discardChangesButton = page.locator('button').filter({ hasText: 'DISCARD CHANGES' });

        // Dry run panel (opened by Test Flow)
        this.dryRunPanel = page.getByText('Test Flow', { exact: true }).first();
        this.dryRunTestFlowButton = page.getByTestId('dry-run-test-flow-button');
        this.dryRunCloseButton = page.locator('[data-testid="dry-run-close-button"]');

        // Navbar elements
        this.flowTitleInput = page.locator('#flow-title-textfield');
        this.editingChip = page.getByText('EDITING', { exact: true }).first();

        // MUI Menu container (rendered by flowPageMoreOptions.tsx)
        this.muiMenu = page.locator('#account-menu');

        // MUI Select dropdown listbox
        this.selectListbox = page.locator('[role="listbox"]');
    }

    // ── Menu interactions ─────────────────────────────────────────────────────

    /**
     * Open the three-dots menu.
     */
    async openMenu(): Promise<void> {
        await this.menuButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.menuButton.click();
        await this.page.waitForTimeout(300);
    }

    /**
     * Close the menu by pressing Escape.
     */
    async closeMenuByEscape(): Promise<void> {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    /**
     * Close the menu by clicking outside.
     */
    async closeMenuByClickOutside(): Promise<void> {
        await this.page.locator('body').click({ position: { x: 10, y: 10 } });
        await this.page.waitForTimeout(300);
    }

    /**
     * Check if the menu is currently open (MUI Menu visible).
     */
    async isMenuOpen(): Promise<boolean> {
        return await this.muiMenu.isVisible();
    }

    /**
     * Get the count of visible menu items.
     */
    async getMenuItemCount(): Promise<number> {
        return await this.menuItems.count();
    }

    /**
     * Get the text of all visible menu items.
     */
    async getMenuItemTexts(): Promise<string[]> {
        const count = await this.menuItems.count();
        const texts: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = await this.menuItems.nth(i).textContent();
            if (text) texts.push(text.trim());
        }
        return texts;
    }

    // ── Move Flow ─────────────────────────────────────────────────────────────

    /**
     * Click the Move option from the menu.
     */
    async clickMove(): Promise<void> {
        await this.moveOption.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Open the menu and click Move.
     */
    async openMenuAndClickMove(): Promise<void> {
        await this.openMenu();
        await this.clickMove();
    }

    /**
     * Wait for the Move Flow modal to be visible.
     */
    async waitForMoveModal(): Promise<void> {
        await this.moveModalTitle.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Open the workspace dropdown in the Move modal and select a workspace by text.
     */
    async selectMoveWorkspace(workspaceName: string): Promise<void> {
        await this.moveWorkspaceDropdown.click();
        await this.page.waitForTimeout(300);
        await this.selectListbox.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.locator(`[role="option"]`).filter({ hasText: workspaceName }).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Open the collection dropdown in the Move modal and select a collection by text.
     */
    async selectMoveCollection(collectionName: string): Promise<void> {
        await this.moveCollectionDropdown.click();
        await this.page.waitForTimeout(300);
        await this.selectListbox.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.locator(`[role="option"]`).filter({ hasText: collectionName }).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Click the Move confirm button.
     */
    async confirmMove(): Promise<void> {
        await this.moveConfirmButton.click();
    }

    /**
     * Click the Cancel button in Move modal.
     */
    async cancelMove(): Promise<void> {
        await this.moveCancelButton.click();
        await this.page.waitForTimeout(300);
    }

    /**
     * Check if the Move confirm button is disabled.
     */
    async isMoveButtonDisabled(): Promise<boolean> {
        return await this.moveConfirmButton.isDisabled();
    }

    /**
     * Check if the Move confirm button is enabled.
     */
    async isMoveButtonEnabled(): Promise<boolean> {
        return await this.moveConfirmButton.isEnabled();
    }

    // ── Duplicate Flow ────────────────────────────────────────────────────────

    /**
     * Click the Duplicate option from the menu.
     */
    async clickDuplicate(): Promise<void> {
        await this.duplicateOption.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Open the menu and click Duplicate.
     */
    async openMenuAndClickDuplicate(): Promise<void> {
        await this.openMenu();
        await this.clickDuplicate();
    }

    /**
     * Wait for the Duplicate Flow modal to be visible.
     */
    async waitForDuplicateModal(): Promise<void> {
        await this.duplicateModalTitle.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Open the workspace dropdown in Duplicate modal and select a workspace.
     */
    async selectDuplicateWorkspace(workspaceName: string): Promise<void> {
        await this.duplicateWorkspaceDropdown.click();
        await this.page.waitForTimeout(300);
        await this.selectListbox.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.locator(`[role="option"]`).filter({ hasText: workspaceName }).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Open the collection dropdown in Duplicate modal and select a collection.
     */
    async selectDuplicateCollection(collectionName: string): Promise<void> {
        await this.duplicateCollectionDropdown.click();
        await this.page.waitForTimeout(300);
        await this.selectListbox.waitFor({ state: 'visible', timeout: 5000 });
        await this.page.locator(`[role="option"]`).filter({ hasText: collectionName }).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Fill the duplicate flow title input.
     */
    async fillDuplicateTitle(title: string): Promise<void> {
        await this.duplicateTitleInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.duplicateTitleInput.click();
        await this.duplicateTitleInput.fill(title);
    }

    /**
     * Clear the duplicate flow title input.
     */
    async clearDuplicateTitle(): Promise<void> {
        await this.duplicateTitleInput.click();
        await this.duplicateTitleInput.fill('');
    }

    /**
     * Get the current value of the duplicate title input.
     */
    async getDuplicateTitleValue(): Promise<string> {
        return await this.duplicateTitleInput.inputValue();
    }

    /**
     * Click the Duplicate confirm button.
     */
    async confirmDuplicate(): Promise<void> {
        await this.duplicateConfirmButton.click();
    }

    /**
     * Click the Cancel button in Duplicate modal.
     */
    async cancelDuplicate(): Promise<void> {
        await this.duplicateCancelButton.click();
        await this.page.waitForTimeout(300);
    }

    /**
     * Check if the Duplicate confirm button is disabled.
     */
    async isDuplicateButtonDisabled(): Promise<boolean> {
        return await this.duplicateConfirmButton.isDisabled();
    }

    /**
     * Check if the Duplicate confirm button is enabled.
     */
    async isDuplicateButtonEnabled(): Promise<boolean> {
        return await this.duplicateConfirmButton.isEnabled();
    }

    /**
     * Check if the title input is disabled (when workspace/collection not selected).
     */
    async isDuplicateTitleInputDisabled(): Promise<boolean> {
        return await this.duplicateTitleInput.isDisabled();
    }

    // ── Test Flow (Dry Run) ──────────────────────────────────────────────────

    /**
     * Click the Test Flow / Run flow option from the menu.
     */
    async clickTestFlow(): Promise<void> {
        await this.testFlowOption.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Open menu and click Test Flow.
     */
    async openMenuAndClickTestFlow(): Promise<void> {
        await this.openMenu();
        await this.clickTestFlow();
    }

    /**
     * Wait for the dry run panel to appear.
     */
    async waitForDryRunPanel(): Promise<void> {
        // The dry-run panel contains "Test Flow" heading and test-flow button
        await this.page.waitForTimeout(1000);
    }

    // ── Pause ─────────────────────────────────────────────────────────────────

    /**
     * Click the Pause option from the menu.
     */
    async clickPause(): Promise<void> {
        await this.pauseOption.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Open menu and click Pause.
     */
    async openMenuAndClickPause(): Promise<void> {
        await this.openMenu();
        await this.clickPause();
    }

    /**
     * Wait for the workflow to show "Paused" state.
     */
    async waitForPausedState(): Promise<void> {
        await this.pausedChip.waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Wait for the workflow to show "Live" state.
     */
    async waitForLiveState(): Promise<void> {
        await this.liveChip.waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Click Resume button to un-pause the workflow.
     */
    async clickResume(): Promise<void> {
        await this.resumeButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.resumeButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Check if the Paused chip is visible.
     */
    async isPaused(): Promise<boolean> {
        return await this.pausedChip.isVisible();
    }

    /**
     * Check if the Resume button is visible.
     */
    async isResumeVisible(): Promise<boolean> {
        return await this.resumeButton.isVisible();
    }

    // ── Move To Trash ─────────────────────────────────────────────────────────

    /**
     * Click the Move To Trash option from the menu.
     */
    async clickMoveToTrash(): Promise<void> {
        await this.moveToTrashOption.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Open menu and click Move To Trash.
     */
    async openMenuAndClickMoveToTrash(): Promise<void> {
        await this.openMenu();
        await this.clickMoveToTrash();
    }

    /**
     * Wait for the trash confirmation dialog to appear.
     */
    async waitForTrashDialog(): Promise<void> {
        await this.trashDialogTitle.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Confirm deleting the workflow (click DELETE in trash dialog).
     */
    async confirmTrash(): Promise<void> {
        await this.trashDeleteButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Cancel deleting the workflow (click CANCEL in trash dialog).
     */
    async cancelTrash(): Promise<void> {
        await this.trashCancelButton.click();
        await this.page.waitForTimeout(300);
    }

    /**
     * Check if the trash dialog is visible.
     */
    async isTrashDialogVisible(): Promise<boolean> {
        return await this.trashDialogTitle.isVisible();
    }

    // ── Composite helpers ─────────────────────────────────────────────────────

    /**
     * Open menu → Move → wait for modal.
     */
    async openMoveModal(): Promise<void> {
        await this.openMenuAndClickMove();
        await this.waitForMoveModal();
    }

    /**
     * Open menu → Duplicate → wait for modal.
     */
    async openDuplicateModal(): Promise<void> {
        await this.openMenuAndClickDuplicate();
        await this.waitForDuplicateModal();
    }

    /**
     * Open menu → Move To Trash → wait for dialog.
     */
    async openTrashDialog(): Promise<void> {
        await this.openMenuAndClickMoveToTrash();
        await this.waitForTrashDialog();
    }

    /**
     * Full pause flow: open menu → click Pause → wait for Paused state.
     */
    async pauseWorkflow(): Promise<void> {
        await this.openMenuAndClickPause();
        await this.waitForPausedState();
    }

    /**
     * Full resume flow: click Resume → wait for Live state.
     */
    async resumeWorkflow(): Promise<void> {
        await this.clickResume();
        await this.waitForLiveState();
    }

    /**
     * Full duplicate flow: open modal → fill title → confirm.
     */
    async duplicateWorkflow(title: string): Promise<void> {
        await this.openDuplicateModal();
        await this.fillDuplicateTitle(title);
        await this.confirmDuplicate();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Full move to trash flow: open dialog → confirm.
     */
    async trashWorkflow(): Promise<void> {
        await this.openTrashDialog();
        await this.confirmTrash();
    }

    /**
     * Get the workspace dropdown selected value text in the Move/Duplicate modal.
     */
    async getWorkspaceDropdownText(): Promise<string> {
        const dropdown = this.page.locator('[role="dialog"] [aria-label="Without label"]').first();
        return (await dropdown.textContent()) || '';
    }

    /**
     * Get the collection dropdown selected value text in the Move/Duplicate modal.
     */
    async getCollectionDropdownText(): Promise<string> {
        const dropdown = this.page.locator('[role="dialog"] [aria-label="Without label"]').nth(1);
        return (await dropdown.textContent()) || '';
    }

    /**
     * Check if workspace dropdown options are visible in the listbox.
     */
    async getDropdownOptionCount(): Promise<number> {
        return await this.page.locator('[role="option"]').count();
    }

    /**
     * Get all dropdown option texts from the currently open listbox.
     */
    async getDropdownOptionTexts(): Promise<string[]> {
        const count = await this.page.locator('[role="option"]').count();
        const texts: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = await this.page.locator('[role="option"]').nth(i).textContent();
            if (text) texts.push(text.trim());
        }
        return texts;
    }

    /**
     * Close any open MUI Select dropdown by pressing Escape.
     */
    async closeDropdown(): Promise<void> {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(200);
    }

    /**
     * Dismiss the Move/Duplicate modal by clicking Cancel.
     */
    async dismissModal(): Promise<void> {
        const cancelBtn = this.page.getByTestId('duplicate-flow-cancel-button');
        if (await cancelBtn.isVisible()) {
            await cancelBtn.click();
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Check if the Move/Duplicate modal is visible.
     */
    async isModalVisible(): Promise<boolean> {
        return (await this.moveModalTitle.isVisible()) || (await this.duplicateModalTitle.isVisible());
    }

    /**
     * Publish changes to make the flow "Live" before testing pause.
     */
    async publishChanges(): Promise<void> {
        await this.publishChangesButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.publishChangesButton.click();
        await this.page.waitForTimeout(2000);
    }
}

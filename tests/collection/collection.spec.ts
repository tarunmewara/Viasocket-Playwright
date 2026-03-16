import { test, expect } from '../../fixtures/base.fixture';

const COLLECTION_NAME_PREFIX = 'test-coll';

test.describe('Collection Tests', () => {

    test.beforeEach(async ({ workspace, dashboard }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();
        await expect(dashboard.collectionAllButton).toBeVisible({ timeout: 15000 });
    });

    test.describe('Collection Sidebar', () => {

        test('TC-COLL-01: Collections sidebar is visible with All button', async ({ collection }) => {
            await expect(collection.collectionsHeading).toBeVisible();
            await expect(collection.allButton).toBeVisible();
            await expect(collection.createCollectionButton).toBeVisible();
        });

        test('TC-COLL-02: Click All button shows all collections', async ({ collection, page }) => {
            await collection.clickAll();
            await page.waitForURL('**/projects/**', { timeout: 10000 });
        });

        test('TC-COLL-03: Select a collection by index', async ({ collection }) => {
            const count = await collection.getCollectionCount();
            if (count === 0) {
                test.skip();
                return;
            }
            await collection.selectCollectionByIndex(0);
        });
    });

    test.describe('Create Collection', () => {

        test('TC-COLL-04: Open create collection modal', async ({ collection }) => {
            await collection.clickCreateCollection();
            await expect(collection.createModal.dialogTitle).toBeVisible();
            await expect(collection.createModal.nameInput).toBeVisible();
            await expect(collection.createModal.createButton).toBeVisible();
            await expect(collection.createModal.cancelButton).toBeVisible();
        });

        test('TC-COLL-05: Create button is disabled when name is empty', async ({ collection }) => {
            await collection.clickCreateCollection();
            await expect(collection.createModal.dialogTitle).toBeVisible();
            await expect(collection.createModal.createButton).toBeDisabled();
        });

        test('TC-COLL-06: Create collection with a custom name', async ({ collection }) => {
            const collectionName = `${COLLECTION_NAME_PREFIX}-${Date.now()}`;
            await collection.clickCreateCollection();
            await expect(collection.createModal.dialogTitle).toBeVisible();
            await collection.createModal.fillName(collectionName);
            await expect(collection.createModal.createButton).toBeEnabled();
            await collection.createModal.create();

            // Verify the new collection appears in the sidebar
            await expect(collection.collectionItems.filter({ hasText: collectionName })).toBeVisible({ timeout: 10000 });
        });

        test('TC-COLL-07: Create collection from suggestion chip', async ({ collection }) => {
            await collection.clickCreateCollection();
            await expect(collection.createModal.dialogTitle).toBeVisible();

            // Wait for suggestion chips to appear
            await expect(collection.createModal.suggestionsContainer).toBeVisible({ timeout: 5000 });

            // Click the first suggestion chip
            await collection.createModal.clickNthSuggestion(0);

            // Name input should be populated and create button enabled
            await expect(collection.createModal.createButton).toBeEnabled();
            await collection.createModal.create();
        });

        test('TC-COLL-08: Cancel create collection modal', async ({ collection }) => {
            await collection.clickCreateCollection();
            await expect(collection.createModal.dialogTitle).toBeVisible();

            await collection.createModal.cancel();
            await expect(collection.createModal.dialogTitle).not.toBeVisible();
        });
    });

    test.describe('Rename Collection', () => {

        test('TC-COLL-09: Rename a collection via context menu', async ({ collection }) => {
            const count = await collection.getCollectionCount();
            if (count === 0) {
                test.skip();
                return;
            }

            const newName = `${COLLECTION_NAME_PREFIX}-renamed-${Date.now()}`;
            await collection.openContextMenuByIndex(0);
            await collection.clickMenuOption('Rename');

            await expect(collection.renameDialogTitle).toBeVisible();
            await collection.renameModal.fillName(newName);
            await collection.renameModal.submit();

            // Verify the renamed collection appears in the sidebar
            await expect(collection.collectionItems.filter({ hasText: newName })).toBeVisible({ timeout: 10000 });
        });

        test('TC-COLL-10: Cancel rename collection', async ({ collection }) => {
            const count = await collection.getCollectionCount();
            if (count === 0) {
                test.skip();
                return;
            }

            await collection.openContextMenuByIndex(0);
            await collection.clickMenuOption('Rename');

            await expect(collection.renameDialogTitle).toBeVisible();
            await collection.renameModal.cancel();
            await expect(collection.renameDialogTitle).not.toBeVisible();
        });
    });

    test.describe('Collection Status Actions', () => {

        test('TC-COLL-11: Pause an active collection', async ({ collection }) => {
            const count = await collection.getCollectionCount();
            if (count === 0) {
                test.skip();
                return;
            }

            // Capture the name of the first collection before pausing
            const firstItem = collection.collectionItems.nth(0);
            const collectionName = (await firstItem.locator('.MuiListItemText-root').textContent())?.trim() ?? '';

            await collection.openContextMenuByIndex(0);
            await collection.clickMenuOption('Pause');

            // After pause, the item may shift position — find it by name
            const pausedItem = collection.collectionItems.filter({ hasText: collectionName });
            const chip = pausedItem.locator('.MuiChip-root');
            await expect(chip).toBeVisible({ timeout: 10000 });
            await expect(chip).toHaveText('Paused');
        });

        test('TC-COLL-12: Activate a paused collection', async ({ collection, page }) => {
            const count = await collection.getCollectionCount();
            if (count === 0) {
                test.skip();
                return;
            }

            // Find a paused collection by checking for the "Paused" chip
            let pausedIndex = -1;
            for (let i = 0; i < count; i++) {
                const item = collection.collectionItems.nth(i);
                const chip = item.locator('.MuiChip-root');
                if (await chip.isVisible()) {
                    const chipText = await chip.textContent();
                    if (chipText === 'Paused') {
                        pausedIndex = i;
                        break;
                    }
                }
            }

            if (pausedIndex === -1) {
                test.skip();
                return;
            }

            await collection.openContextMenuByIndex(pausedIndex);
            await collection.clickMenuOption('Active');
        });

        test('TC-COLL-13: Move a collection to trash via context menu', async ({ collection }) => {
            // First create a collection to trash so we don't destroy real data
            const collectionName = `${COLLECTION_NAME_PREFIX}-trash-${Date.now()}`;
            await collection.clickCreateCollection();
            await expect(collection.createModal.dialogTitle).toBeVisible();
            await collection.createModal.fillName(collectionName);
            await collection.createModal.create();

            // Wait for the new collection to appear
            await expect(collection.collectionItems.filter({ hasText: collectionName })).toBeVisible({ timeout: 10000 });

            // Open context menu and move to trash
            await collection.openContextMenu(collectionName);
            await collection.clickMenuOption('Move To Trash');

            // Verify the collection shows "Trashed" status or is removed from active list
            const item = collection.collectionItems.filter({ hasText: collectionName });
            const chip = item.locator('.MuiChip-root');
            await expect(chip).toBeVisible({ timeout: 10000 });
            await expect(chip).toHaveText('Trashed');
        });
    });
});

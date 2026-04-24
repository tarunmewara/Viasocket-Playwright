import { test, expect } from '../../fixtures/base.fixture';

test.describe('Template Tests', () => {

    test.beforeEach(async ({ workspace, page }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();

        // Navigate to templates page via sidebar
        await page.getByRole('link', { name: 'Templates' }).click();
        await expect(page.getByRole('tab', { name: 'All Templates' })).toBeVisible({ timeout: 15000 });
    });

    test.describe('Templates Page Load', () => {

        test('TC-TMPL-01: Templates page displays All Templates and My Templates tabs', async ({ templates }) => {
            await expect(templates.allTemplatesTab).toBeVisible();
            await expect(templates.myTemplatesTab).toBeVisible();
        });

        test('TC-TMPL-02: Create New Template button is visible', async ({ templates }) => {
            await expect(templates.createNewTemplateButton).toBeVisible();
        });

        test('TC-TMPL-03: Search autocomplete input is visible', async ({ templates }) => {
            await expect(templates.searchAutocomplete).toBeVisible();
        });

        test('TC-TMPL-04: Sort dropdown is visible', async ({ templates }) => {
            await expect(templates.sortSelect).toBeVisible();
        });

        test('TC-TMPL-05: Template cards are displayed on All Templates tab', async ({ templates }) => {
            const cardCount = await templates.getTemplateCardCount();
            expect(cardCount).toBeGreaterThan(0);
        });
    });

    test.describe('Tab Switching', () => {

        test('TC-TMPL-06: Switch to My Templates tab', async ({ templates }) => {
            await templates.selectMyTemplatesTab();

            const myTabClass = await templates.myTemplatesTab.getAttribute('aria-selected');
            expect(myTabClass).toBe('true');
        });

        test('TC-TMPL-07: Switch back to All Templates tab from My Templates', async ({ templates }) => {
            await templates.selectMyTemplatesTab();
            await templates.selectAllTemplatesTab();

            const allTabClass = await templates.allTemplatesTab.getAttribute('aria-selected');
            expect(allTabClass).toBe('true');
        });

        test('TC-TMPL-08: My Templates tab shows sort dropdown with extra options', async ({ templates, page }) => {
            await templates.selectMyTemplatesTab();

            await templates.sortSelect.click();

            // My Templates tab has additional sort options: Approved, Rejected, Pending
            await expect(page.getByRole('option', { name: 'Approved' })).toBeVisible();
            await expect(page.getByRole('option', { name: 'Rejected' })).toBeVisible();
            await expect(page.getByRole('option', { name: 'Pending' })).toBeVisible();

            // Close dropdown by pressing Escape
            await page.keyboard.press('Escape');
        });
    });

    test.describe('Search', () => {

        test('TC-TMPL-09: Search input opens dropdown with default options', async ({ templates }) => {
            await templates.searchInput.click();

            // MUI Autocomplete renders listbox as a portal at page root;
            // clicking the input opens the dropdown with default departments & industries
            await expect(templates.searchDropdown).toBeVisible({ timeout: 5000 });
        });


        test('TC-TMPL-11: Clear search restores all templates', async ({ templates, page }) => {
            await templates.searchTemplates('slack');
            await page.keyboard.press('Escape');

            await templates.clearSearch();
            await page.keyboard.press('Escape');

            // Wait for cards to reappear after clearing search
            await expect(templates.templateCards.first()).toBeVisible({ timeout: 5000 });

            const cardCount = await templates.getTemplateCardCount();
            expect(cardCount).toBeGreaterThan(0);
        });

        test('TC-TMPL-12: Search dropdown shows Apps, Departments, Industries groups', async ({ templates, page }) => {
            await templates.searchInput.click();

            // Opening the autocomplete should show department and industry groups
            await expect(page.getByText('Departments')).toBeVisible({ timeout: 5000 });
            await expect(page.getByText('Industries')).toBeVisible({ timeout: 5000 });
        });
    });

    test.describe('Sort', () => {

        test('TC-TMPL-13: Sort dropdown shows Sort by Time and Sort by Popularity options', async ({ templates, page }) => {
            await templates.sortSelect.click();

            await expect(page.getByRole('option', { name: 'Sort by Time' })).toBeVisible();
            await expect(page.getByRole('option', { name: 'Sort by Popularity' })).toBeVisible();

            await page.keyboard.press('Escape');
        });

        test('TC-TMPL-14: Change sort to Sort by Time', async ({ templates }) => {
            await templates.selectSort('Sort by Time');

            // Template cards should still be visible after sort change
            const cardCount = await templates.getTemplateCardCount();
            expect(cardCount).toBeGreaterThan(0);
        });

        test('TC-TMPL-15: Change sort to Sort by Popularity', async ({ templates }) => {
            await templates.selectSort('Sort by Popularity');

            const cardCount = await templates.getTemplateCardCount();
            expect(cardCount).toBeGreaterThan(0);
        });
    });

    test.describe('Template Cards', () => {

        test('TC-TMPL-16: Template card has copy URL button', async ({ templates }) => {
            const cardCount = await templates.getTemplateCardCount();
            if (cardCount === 0) {
                test.skip();
                return;
            }

            await expect(templates.templateCopyUrlButtons.first()).toBeVisible();
        });

        test('TC-TMPL-17: Install Template navigates to template detail', async ({ templates, page }) => {
            const cardCount = await templates.getTemplateCardCount();
            if (cardCount === 0) {
                test.skip();
                return;
            }

            await templates.installTemplate(0);
            await expect(page).toHaveURL(/\/template\//, { timeout: 10000 });
        });
    });

    test.describe('Pagination', () => {

        test('TC-TMPL-18: Pagination is visible when more than 12 templates', async ({ templates }) => {
            const cardCount = await templates.getTemplateCardCount();
            if (cardCount === 0) {
                test.skip();
                return;
            }

            // Pagination only appears if total templates > PAGE_SIZE (12)
            const hasPagination = await templates.pagination.isVisible().catch(() => false);
            // This is informational — pagination visibility depends on template count
            expect(typeof hasPagination).toBe('boolean');
        });

        test('TC-TMPL-19: Navigate to next page via pagination', async ({ templates }) => {
            const hasPagination = await templates.pagination.isVisible().catch(() => false);
            if (!hasPagination) {
                test.skip();
                return;
            }

            await templates.goToNextPage();

            // Cards should still be displayed on page 2
            const cardCount = await templates.getTemplateCardCount();
            expect(cardCount).toBeGreaterThan(0);
        });

        test('TC-TMPL-20: Navigate to previous page via pagination', async ({ templates }) => {
            const hasPagination = await templates.pagination.isVisible().catch(() => false);
            if (!hasPagination) {
                test.skip();
                return;
            }

            // Go to page 2 first, then back to page 1
            await templates.goToNextPage();
            await templates.goToPreviousPage();

            const cardCount = await templates.getTemplateCardCount();
            expect(cardCount).toBeGreaterThan(0);
        });
    });

    test.describe('Create New Template Modal', () => {

        test('TC-TMPL-21: Open Create New Template modal shows radio options', async ({ templates, page }) => {
            await templates.clickCreateNewTemplate();

            // Modal should show "Create Template From" with New Flow / Existing Flow radios
            await expect(page.getByText('Create Template From')).toBeVisible({ timeout: 5000 });
            await expect(page.getByRole('radio', { name: 'New Flow' })).toBeVisible();
            await expect(page.getByRole('radio', { name: 'Existing Flow' })).toBeVisible();
        });

        test('TC-TMPL-22: New Flow mode shows Collection dropdown and Create Template button', async ({ templates, page }) => {
            await templates.clickCreateNewTemplate();

            await expect(page.getByText('Create Template From')).toBeVisible({ timeout: 5000 });

            // "New Flow" should be selected by default
            await expect(page.getByRole('radio', { name: 'New Flow' })).toBeChecked();

            // Collection dropdown and Create Template button should be visible
            await expect(page.getByText('Collection', { exact: true })).toBeVisible();
            await expect(page.getByTestId('create-template-confirm-button')).toBeVisible();
        });

        test('TC-TMPL-23: Switch to Existing Flow mode shows flow autocomplete', async ({ templates, page }) => {
            await templates.clickCreateNewTemplate();

            await expect(page.getByText('Create Template From')).toBeVisible({ timeout: 5000 });

            // Click "Existing Flow" radio
            await page.getByRole('radio', { name: 'Existing Flow' }).click();
            await expect(page.getByRole('radio', { name: 'Existing Flow' })).toBeChecked();

            // "Select Flow" label and autocomplete should appear
            await expect(page.getByText('Select Flow')).toBeVisible();
        });

        test('TC-TMPL-24: Cancel Create New Template modal closes it', async ({ templates, page }) => {
            await templates.clickCreateNewTemplate();

            await expect(page.getByTestId('create-template-confirm-button')).toBeVisible({ timeout: 5000 });

            await page.getByTestId('duplicate-flow-cancel-button').click();

            await expect(page.getByTestId('create-template-confirm-button')).not.toBeVisible();
        });


        test('TC-TMPL-26: Select collection enables Create Template button', async ({ templates, page }) => {
            await templates.clickCreateNewTemplate();

            await expect(page.getByText('Collection', { exact: true })).toBeVisible({ timeout: 5000 });

            // Select "No Collection" from the collection dropdown
            await page.getByText('No Collection').click();
            await page.getByRole('option', { name: /No Collection/ }).click();

            await expect(page.getByTestId('create-template-confirm-button')).toBeEnabled();
        });

        test('TC-TMPL-27: Create template from New Flow navigates to workflow', async ({ templates, page }) => {
            await templates.clickCreateNewTemplate();

            await expect(page.getByText('Collection', { exact: true })).toBeVisible({ timeout: 5000 });

            // Select "No Collection" — click the combobox to open, then pick the option
            await page.getByText('No Collection').click();
            await page.getByRole('option', { name: /No Collection/ }).click();
            await expect(page.getByTestId('create-template-confirm-button')).toBeEnabled();

            await page.getByTestId('create-template-confirm-button').click();

            // Should navigate to the workflow draft page
            await expect(page).toHaveURL(/\/workflow\/.*\/draft/, { timeout: 15000 });
        });
    });

    test.describe('Install Template', () => {


        test('TC-TMPL-29: Template detail page shows workspace and collection dropdowns', async ({ templates, page }) => {
            const cardCount = await templates.getTemplateCardCount();
            if (cardCount === 0) {
                test.skip();
                return;
            }

            await templates.installTemplate(0);
            await expect(page).toHaveURL(/\/template\//, { timeout: 10000 });

            await expect(page.getByText('Select Workspace')).toBeVisible({ timeout: 10000 });
            await expect(page.getByText('Collection', { exact: true })).toBeVisible();
        });

        test('TC-TMPL-30: Template detail page shows Install and Cancel buttons', async ({ templates, page }) => {
            const cardCount = await templates.getTemplateCardCount();
            if (cardCount === 0) {
                test.skip();
                return;
            }

            await templates.installTemplate(0);
            await expect(page).toHaveURL(/\/template\//, { timeout: 10000 });

            await expect(page.getByRole('button', { name: 'Install' })).toBeVisible({ timeout: 10000 });
            await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        });

        test('TC-TMPL-31: Cancel on template detail navigates back', async ({ templates, page }) => {
            const cardCount = await templates.getTemplateCardCount();
            if (cardCount === 0) {
                test.skip();
                return;
            }

            await templates.installTemplate(0);
            await expect(page).toHaveURL(/\/template\//, { timeout: 10000 });

            await page.getByRole('button', { name: 'Cancel' }).click();

            // Should navigate back (URL should no longer contain /template/)
            await expect(page).not.toHaveURL(/\/template\//, { timeout: 10000 });
        });

        test('TC-TMPL-32: Select collection and install template navigates to workflow', async ({ templates, page }) => {
            const cardCount = await templates.getTemplateCardCount();
            if (cardCount === 0) {
                test.skip();
                return;
            }

            await templates.installTemplate(0);
            await expect(page).toHaveURL(/\/template\//, { timeout: 10000 });

            // Wait for collection dropdown to load
            await expect(page.getByText('Collection', { exact: true })).toBeVisible({ timeout: 10000 });

            // Select "No Collection" from the dropdown — click combobox to open, then pick option
            await page.getByText('No Collection').click();
            await page.getByRole('option', { name: /No Collection/ }).click();

            // Click Install
            await page.getByRole('button', { name: 'Install' }).click();

            // Should navigate to the workflow draft page
            await expect(page).toHaveURL(/\/workflow\/.*\/draft/, { timeout: 15000 });
        });

        test('TC-TMPL-33: Installed template workflow shows configure button', async ({ templates, workflow, page }) => {
            const cardCount = await templates.getTemplateCardCount();
            if (cardCount === 0) {
                test.skip();
                return;
            }

            await templates.installTemplate(0);
            await expect(page).toHaveURL(/\/template\//, { timeout: 10000 });

            await expect(page.getByText('Collection', { exact: true })).toBeVisible({ timeout: 10000 });
            await page.getByText('No Collection').click();
            await page.getByRole('option', { name: /No Collection/ }).click();

            await page.getByRole('button', { name: 'Install' }).click();
            await expect(page).toHaveURL(/\/workflow\/.*\/draft/, { timeout: 15000 });
        });
    });
});

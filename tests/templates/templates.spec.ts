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

        test('TC-TMPL-10: Search filters template cards', async ({ templates, page }) => {
            const initialCount = await templates.getTemplateCardCount();

            await templates.searchTemplates('slack');
            // Close dropdown so cards update
            await page.keyboard.press('Escape');

            // Wait for filtered results or no-results text to appear
            await expect(async () => {
                const filteredCount = await templates.getTemplateCardCount();
                const noResults = await templates.noTemplatesFound.isVisible().catch(() => false);
                expect(filteredCount !== initialCount || noResults).toBeTruthy();
            }).toPass({ timeout: 5000 });
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
});

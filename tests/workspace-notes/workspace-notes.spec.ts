import { test, expect } from '../../fixtures/base.fixture';

test.describe('Workspace Notes Tests', () => {
    const testText = `Workspace Notes in viaSocket serve as a centralized documentation and collaboration feature that allows users to store, organize, and reference important information related to workflows, integrations, and automation processes. These notes act as a knowledge base within a workspace, helping teams keep track of logic, configurations, API details, and decision-making context without needing external tools.

They are especially useful during workflow development, where engineers and team members can document step-by-step logic, variable usage, error-handling strategies, and dependencies between different nodes. Workspace Notes also support better collaboration by enabling multiple users to understand the purpose and structure of a workflow, reducing onboarding time and miscommunication.

Another key benefit is maintainability. As workflows grow complex, having well-structured notes ensures that future updates, debugging, or optimizations can be done efficiently. Instead of reverse-engineering logic, developers can refer directly to the notes for clarity.

In addition, Workspace Notes can be used for storing reusable snippets, best practices, and guidelines specific to a project or organization. Overall, they enhance productivity, improve transparency, and ensure consistency across the development and management of automated workflows within viaSocket.`;

    test.beforeEach(async ({ workspace, page }) => {
        await workspace.navigateToOrg();
        await workspace.selectFirstWorkspace();

        // Navigate to Workspace Notes via sidebar
        await page.getByTestId('project-sidebar-workspace-notes-btn').click();
        await expect(page).toHaveURL(/\/workspace\/document/, { timeout: 15000 });
    });

    test.describe('Page Load', () => {

        test('TC-WSNOTE-01: Workspace Notes page displays heading', async ({ workspaceNotes }) => {
            await expect(workspaceNotes.heading).toBeVisible({ timeout: 10000 });
        });

        test('TC-WSNOTE-02: Workspace Notes page displays description', async ({ workspaceNotes }) => {
            await expect(workspaceNotes.description).toBeVisible({ timeout: 10000 });
        });

        test('TC-WSNOTE-03: DocStar container is present on the page', async ({ workspaceNotes }) => {
            await expect(workspaceNotes.docstarContainer).toBeAttached({ timeout: 10000 });
        });

        test('TC-WSNOTE-04: URL contains /workspace/document', async ({ page }) => {
            await expect(page).toHaveURL(/\/workspace\/document/);
        });
    });

    test.describe('Sidebar Navigation', () => {

        test('TC-WSNOTE-05: Workspace Notes sidebar link is visible', async ({ page }) => {
            await expect(page.getByTestId('project-sidebar-workspace-notes-btn')).toBeVisible();
        });

        test('TC-WSNOTE-06: Navigate back to Home from Workspace Notes', async ({ page }) => {
            await page.getByRole('link', { name: 'Home' }).click();

            await expect(page).toHaveURL(/\/projects\//, { timeout: 10000 });
            await expect(page).not.toHaveURL(/\/workspace\/document/);
        });

        test('TC-WSNOTE-07: Navigate to Workspace Notes and back preserves sidebar state', async ({ page }) => {
            // Navigate away
            await page.getByRole('link', { name: 'Home' }).click();
            await expect(page).toHaveURL(/\/projects\//, { timeout: 10000 });

            // Navigate back to Workspace Notes
            await page.getByTestId('project-sidebar-workspace-notes-btn').click();
            await expect(page).toHaveURL(/\/workspace\/document/, { timeout: 15000 });

            await expect(page.getByRole('heading', { name: 'Workspace Notes' })).toBeVisible({ timeout: 10000 });
        });
    });

    test.describe('DocStar Editor', () => {

        test('TC-WSNOTE-08: DocStar iframe loads on page', async ({ workspaceNotes }) => {
            // DocStar renders as an iframe#iframe-component-techdocEmbed inside the container
            await expect(workspaceNotes.docstarIframe).toBeVisible({ timeout: 20000 });
        });

        test('TC-WSNOTE-09: DocStar container has content after load', async ({ workspaceNotes, page }) => {
            // Wait for DocStar to initialize and render content into the container
            await expect(async () => {
                const childCount = await workspaceNotes.docstarContainer.locator('> *').count();
                expect(childCount).toBeGreaterThan(0);
            }).toPass({ timeout: 15000 });
        });

        test('TC-WSNOTE-10: Write text into workspace notes editor', async ({ workspaceNotes }) => {
            
            // Wait for iframe and editor to be ready
            await expect(workspaceNotes.docstarIframe).toBeVisible({ timeout: 20000 });
            const editor = workspaceNotes.getEditorLocator();
            await expect(editor).toBeVisible({ timeout: 20000 });
           
            // Write text
            await workspaceNotes.writeNote(testText);
        });

        test('TC-WSNOTE-11: Clear text from workspace notes editor', async ({ workspaceNotes }) => {

            // Wait for iframe and editor to be ready
            await expect(workspaceNotes.docstarIframe).toBeVisible({ timeout: 20000 });
            const editor = workspaceNotes.getEditorLocator();
            await expect(editor).toBeVisible({ timeout: 20000 });

            // Clear any existing content first so we start clean
            await workspaceNotes.clearNote();

            // Write fresh text
            await workspaceNotes.writeNote(testText);
            // Clear all text
            await workspaceNotes.clearNote();

            // Verify text is removed
            await expect(async () => {
                const editorText = await workspaceNotes.getEditorText();
                expect(editorText).not.toContain(testText);
            }).toPass({ timeout: 10000 });
        });
    });
});

import { Page, Locator } from '@playwright/test';

/**
 * Create Organization Modal
 * Handles: workspace name, timezone, industry, employees, domain inputs, create/close buttons
 * Reference: createOrgModal.tsx
 */
export class CreateOrgModal {
    readonly page: Page;

    // Form fields
    readonly workspaceNameInput: Locator;
    readonly industryInput: Locator;
    readonly employeesInput: Locator;
    readonly domainInput: Locator;

    // Actions
    readonly submitButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locators from createOrgModal.tsx
        this.workspaceNameInput = page.getByTestId('create-org-workspace-name-input');
        this.industryInput = page.getByTestId('create-org-industry-input');
        this.employeesInput = page.getByTestId('create-org-employees-input');
        this.domainInput = page.getByTestId('create-org-domain-input');
        this.submitButton = page.getByTestId('create-org-submit-button');
        this.closeButton = page.getByTestId('create-org-close-button');
    }

    async fillWorkspaceName(name: string): Promise<void> {
        await this.workspaceNameInput.locator('input').fill(name);
    }

    async fillIndustry(industry: string): Promise<void> {
        await this.industryInput.locator('input').fill(industry);
        await this.page.getByRole('option', { name: industry }).first().click();
    }

    async selectEmployees(range: string): Promise<void> {
        await this.employeesInput.locator('input').click();
        await this.page.getByRole('option', { name: range }).click();
    }

    async fillDomain(domain: string): Promise<void> {
        await this.domainInput.locator('input').fill(domain);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async createWorkspace(name: string, domain?: string): Promise<void> {
        await this.fillWorkspaceName(name);
        if (domain) await this.fillDomain(domain);
        await this.submit();
    }

    async isVisible(): Promise<boolean> {
        return this.submitButton.isVisible();
    }

    async isSubmitDisabled(): Promise<boolean> {
        return this.submitButton.isDisabled();
    }
}

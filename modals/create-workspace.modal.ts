import { Page, Locator } from '@playwright/test';

/**
 * Create Workspace Modal
 * Handles: create org dialog — workspace name, timezone, industry, employees, domain, submit, close
 * Reference: createOrgModal.tsx
 */
export class CreateWorkspaceModal {
    readonly page: Page;

    readonly workspaceNameInput: Locator;
    readonly industryInput: Locator;
    readonly employeesInput: Locator;
    readonly domainInput: Locator;
    readonly submitButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Role/text/placeholder locators (data-testid stripped in prod build)
        this.workspaceNameInput = page.getByPlaceholder('Workspace name');
        this.industryInput = page.getByPlaceholder('Example :- IT');
        this.employeesInput = page.getByRole('combobox').nth(1);
        this.domainInput = page.getByPlaceholder('Your official website address');
        this.submitButton = page.getByRole('button', { name: 'Create' });
        this.closeButton = page.getByRole('button', { name: 'Close' });
    }

    async fillWorkspaceName(name: string): Promise<void> {
        await this.workspaceNameInput.fill(name);
    }

    async selectIndustry(industry: string): Promise<void> {
        await this.industryInput.fill(industry);
        await this.page.getByRole('option', { name: industry }).click();
    }

    async selectEmployees(count: string): Promise<void> {
        await this.employeesInput.click();
        await this.page.getByRole('option', { name: count }).click();
    }

    async fillDomain(domain: string): Promise<void> {
        await this.domainInput.fill(domain);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }

    async createWorkspace(name: string): Promise<void> {
        await this.fillWorkspaceName(name);
        await this.submit();
    }

    async isVisible(): Promise<boolean> {
        return this.workspaceNameInput.isVisible();
    }

    async isSubmitDisabled(): Promise<boolean> {
        return this.submitButton.isDisabled();
    }
}

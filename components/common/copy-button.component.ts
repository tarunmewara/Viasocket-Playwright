import { Page, Locator } from '@playwright/test';

/**
 * Copy Button Component
 * Handles: reusable copy-to-clipboard button interactions
 * Reference: CopyButton.tsx
 */
export class CopyButtonComponent {
    readonly page: Page;

    readonly copyButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // data-testid locator from CopyButton.tsx
        this.copyButton = page.getByTestId('copy-button');
    }

    async click(): Promise<void> {
        await this.copyButton.click();
    }

    async clickNth(index: number): Promise<void> {
        await this.copyButton.nth(index).click();
    }

    async isVisible(): Promise<boolean> {
        return this.copyButton.first().isVisible();
    }

    async count(): Promise<number> {
        return this.copyButton.count();
    }
}

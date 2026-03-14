import { Page } from '@playwright/test';

/**
 * URL navigation helpers
 * Centralized navigation utilities for consistent URL handling
 */

const BASE_URL = process.env.BASE_URL!;

export async function navigateToOrg(page: Page): Promise<void> {
    await page.goto(`${BASE_URL}/org`);
}

export async function navigateToWorkspace(page: Page, orgId: string): Promise<void> {
    await page.goto(`${BASE_URL}/${orgId}`);
}

export async function navigateToFlow(page: Page, orgId: string, flowId: string): Promise<void> {
    await page.goto(`${BASE_URL}/${orgId}/flow/${flowId}`);
}

export async function navigateToSettings(page: Page, orgId: string): Promise<void> {
    await page.goto(`${BASE_URL}/${orgId}/settings`);
}

export async function navigateToConnections(page: Page, orgId: string): Promise<void> {
    await page.goto(`${BASE_URL}/${orgId}/connections`);
}

export async function navigateToTemplates(page: Page): Promise<void> {
    await page.goto(`${BASE_URL}/templates`);
}

export async function navigateToMCP(page: Page, orgId: string): Promise<void> {
    await page.goto(`${BASE_URL}/${orgId}/mcp`);
}

export async function navigateToOAuth(page: Page, orgId: string): Promise<void> {
    await page.goto(`${BASE_URL}/${orgId}/oauth`);
}

export async function navigateToInterface(page: Page, orgId: string): Promise<void> {
    await page.goto(`${BASE_URL}/${orgId}/interface`);
}

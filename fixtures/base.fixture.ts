import { test as base } from '@playwright/test';

// TODO: Import all page objects, components, and modals here

// Define the types for our custom fixtures
type MyFixtures = {
    // TODO: Add fixture types
};

// Extend the base test with our custom fixtures
export const test = base.extend<MyFixtures>({
    // TODO: Register fixtures
});

export { expect } from '@playwright/test';

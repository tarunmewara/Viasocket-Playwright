/**
 * Test Data Utilities
 * Random generators and helpers for dynamic test data
 */

export class TestDataUtils {
    /**
     * Generate a timestamp-based unique name
     */
    static timestampName(prefix: string): string {
        return `${prefix}-${Date.now()}`;
    }

    /**
     * Generate a random string of given length
     */
    static randomString(length: number = 8): string {
        return Math.random().toString(36).substring(2, 2 + length);
    }

    /**
     * Pick a random item from an array
     */
    static randomFromArray<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Generate a unique collection name
     */
    static collectionName(): string {
        return TestDataUtils.timestampName('collection');
    }

    /**
     * Generate a unique workspace name
     */
    static workspaceName(): string {
        return TestDataUtils.timestampName('workspace');
    }

    /**
     * Generate a unique flow name
     */
    static flowName(): string {
        return TestDataUtils.timestampName('flow');
    }
}

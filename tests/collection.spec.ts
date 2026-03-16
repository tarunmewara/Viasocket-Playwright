// import { test, expect } from '../fixtures/base.fixture';
// import { DashboardPage } from '../pages/DashboardPage';
// import { CollectionPage } from '../pages/CollectionPage';

// test.describe('Collection Tests', () => {

//     // storageState is configured globally in playwright.config.ts via STORAGE_STATE env var
//     test.beforeEach(async ({ page }) => {
//         const dashboardPage = new DashboardPage(page);
//         await dashboardPage.navigateToOrg();
//         await dashboardPage.selectOrganization();
//     });

//     test('Should NOT allow creating collection with duplicate name', async ({ page }) => {
//         const collectionPage = new CollectionPage(page);
//         await collectionPage.clickCreateCollection();

//         const collectionName = 'randomname'; // already existing name
//         await collectionPage.fillCollectionName(collectionName);
//         await collectionPage.submitCreateCollection();

//         await expect(page.getByText(/already exists/i)).toBeVisible({ timeout: 5000 });
//     });

//     test('Create collection with random name', async ({ page }) => {
//         const collectionPage = new CollectionPage(page);
//         await collectionPage.clickCreateCollection();

//         const randomName = `collection-${Date.now()}`;
//         await collectionPage.fillCollectionName(randomName);
//         await collectionPage.submitCreateCollection();
//     });

//     test('Create Collection From Suggestions', async ({ page }) => {
//         const collectionPage = new CollectionPage(page);
//         await collectionPage.clickCreateCollection();

//         // Click the first suggestion chip instead of relying on dynamic text
//         await collectionPage.clickFirstSuggestion();

//         // Submit the collection creation to validate behavior
//         await collectionPage.submitCreateCollection();
//     });

//     test('Rename collection with random name', async ({ page }) => {
//         const collectionPage = new CollectionPage(page);

//         const collections: string[] = ['this is the new collection', 'ygyihkghkgu', 'asdfghjklsd', 'folder for testing', 'lelo', 'xfghjklv'];
//         const collectionName = collections[Math.floor(Math.random() * collections.length)];

//         await collectionPage.selectCollectionByName(collectionName);
//         await collectionPage.openCollectionMenu(collectionName);
//         await collectionPage.clickRename();

//         const randomName = `collection-${Date.now()}`;
//         await collectionPage.fillRenameCollectionName(randomName);
//         await collectionPage.submitRename();

//         await expect(await collectionPage.getCollectionRow(randomName)).toBeVisible();
//     });

//     test('Move collection to trash', async ({ page }) => {
//         const collectionPage = new CollectionPage(page);

//         const collections: string[] = [
//             "folder for testinggg",
//             "Information Technology",
//             "Management",
//             "Marketing",
//             "name of this collection ...",
//             "new collection",
//             "Product Management",
//             "randomname",
//             "randomnameitis",
//             "randomnameitisin",
//             "abc",
//             "collection-17...",
//             "folder for test...",
//             "lelo",
//             "xfgjhjklv",
//             "hello",
//             "this is the ne...",
//             "Account Management",
//             "Administration",
//             "Automation",
//             "Business Operations",
//             "collection",
//             "collection-1772164345...",
//             "collection-1772164493...",
//             "collection-1772164700...",
//             "collection-1772164774...",
//             "collection-1772165619...",
//             "collection-1772181350...",
//             "collection-1772286288...",
//             "collection-1772286720...",
//             "collection-1772287006...",
//             "collection-1772287148...",
//             "collection-1772287166...",
//             "collection-1772430485...",
//             "Customer Support"
//         ];
//         const collectionName = collections[Math.floor(Math.random() * collections.length)];

//         await collectionPage.selectCollectionByName(collectionName);
//         await collectionPage.openCollectionMenu(collectionName);
//         await collectionPage.moveToTrash();
//     });

//     test('Pause or Active collection', async ({ page }) => {
//         const collectionPage = new CollectionPage(page);

//         await collectionPage.selectCollectionByName('abc');
//         await collectionPage.openCollectionMenu('abc');
//         await collectionPage.togglePauseOrActive();
//     });

// });

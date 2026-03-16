import { test, expect } from '../../../../fixtures/base.fixture';

const TIMEZONES = [
    'America/New_York',
    'Europe/London',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Asia/Tokyo',
];

const STATEMENTS = [
    'Every 10 minutes',
    'Every hour',
    'Every day at 9am',
    'Every Monday at 8am',
    'Every weekday at noon',
];


const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

test.describe('Cron Trigger', () => {

    test.beforeEach(async ({ dashboard }) => {
        await dashboard.navigateToProject('58104');
        await dashboard.clickCreateNewFlow();
    });

    // ------------------------------------------------------------------ //
    // Test 1: Create cron — random timezone + random natural-language      //
    // ------------------------------------------------------------------ //
    test('create cron with random timezone and statement', async ({ triggers, workflow }) => {
        const timezone = random(TIMEZONES);
        const statement = random(STATEMENTS);

        await triggers.selectCronTrigger();

        // Set a randomly chosen timezone via the Autocomplete
        await triggers.cron.selectTimezone(timezone);

        // Fill the natural-language schedule and save
        await triggers.cron.fillStatement(statement);
        await triggers.cron.save();

        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 2: Select cron statement from suggestion dropdown               //
    // ------------------------------------------------------------------ //
    test('select cron statement from suggestion', async ({ triggers, workflow }) => {
        await triggers.selectCronTrigger();

        // Typing triggers the NLP suggestion list
        await triggers.cron.cronInput.fill('Every');

        // Wait for at least one autocomplete option and pick it
        const firstSuggestion = triggers.page.getByRole('option').first();
        await expect(firstSuggestion).toBeVisible();
        await firstSuggestion.click();

        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 3: Open cron slider and close with the cross (×) icon           //
    // ------------------------------------------------------------------ //
    test('open and close cron slider with cross icon', async ({ triggers }) => {
        await triggers.selectCronTrigger();

        // Cron config slider should be open
        await expect(triggers.cron.cronInput).toBeVisible();

        // Close via the ✕ icon (slider-close-button)
        await triggers.slider.clickClose();

        // Slider should be dismissed
        await expect(triggers.cron.cronInput).not.toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 4: Change cron trigger → webhook via Change button              //
    // ------------------------------------------------------------------ //
    test('change cron trigger to webhook via Change button', async ({ triggers, workflow }) => {
        // Step 1: add cron
        await triggers.selectCronTrigger();
        await triggers.cron.fillStatement('Every 30 minutes');
        await triggers.cron.cronInput.press('Tab');  
        await triggers.cron.save();
        

        // Step 2: click the cron step node on canvas to open cron slider
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // Step 3: click Change button in cron slider header
        await expect(workflow.stepChangeButton).toBeVisible();
        await workflow.stepChangeButton.click();

        // Step 4: pick webhook
        await triggers.selectWebhookTrigger();

        // Webhook config opens → trigger list is gone
        await expect(triggers.triggerOption.first()).not.toBeVisible();
        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 5: Change cron trigger → email via Change button                //
    // ------------------------------------------------------------------ //
    test('change cron trigger to email via Change button', async ({ triggers, workflow }) => {
        // Step 1: add cron
        await triggers.selectCronTrigger();
        await triggers.cron.fillStatement('Every day at noon');
        await triggers.cron.cronInput.press('Tab');
        await triggers.cron.save();

        // Step 2: click the cron step node on canvas to open cron slider
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // Step 3: click Change button in cron slider header
        await expect(workflow.stepChangeButton).toBeVisible();
        await workflow.stepChangeButton.click();

        // Step 4: pick email
        await triggers.selectEmailTrigger();

        // Email config opens → trigger list is gone
        await expect(triggers.triggerOption.first()).not.toBeVisible();
        await expect(workflow.publish.goLiveButton).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 6: Change cron trigger → plugin app via Change button           //
    // ------------------------------------------------------------------ //
    test('change cron trigger to plugin app via Change button', async ({ triggers, workflow }) => {
        // Step 1: add cron
        await triggers.selectCronTrigger();
        await triggers.cron.fillStatement('Every hour');
        await triggers.cron.cronInput.press('Tab');
        await triggers.cron.save();

        // Step 2: click the cron step node on canvas to open cron slider
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // Step 3: click Change button in cron slider header
        await expect(workflow.stepChangeButton).toBeVisible();
        await workflow.stepChangeButton.click();

        // Step 4: search for a plugin and pick the first result
        await triggers.triggerSearchInput.fill('Gmail');
        const firstPluginOption = triggers.triggerOption.first();
        await expect(firstPluginOption).toBeVisible();
        await firstPluginOption.click();

        // Plugin trigger config opens → search input should be gone
        await expect(triggers.triggerSearchInput).not.toBeVisible();
    });

});

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
        await expect(firstSuggestion).toBeVisible({ timeout: 15000 });
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

        // goLiveButton appears only after the trigger is saved successfully
        await expect(workflow.publish.goLiveButton).toBeVisible({ timeout: 20000 });

        // Step 2: click the cron step node on canvas to open cron slider
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // Step 3: click Change button in cron slider header
        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Step 4: pick webhook
        await triggers.selectWebhookTrigger();

        // Webhook config opens → trigger list is gone
        await expect(triggers.triggerOption.first()).not.toBeVisible();

        // Step 5: click Set webhook to confirm
        await expect(workflow.setWebhookButton).toBeVisible();
        await workflow.setWebhookButton.click();

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

        // goLiveButton appears only after the trigger is saved successfully
        await expect(workflow.publish.goLiveButton).toBeVisible({ timeout: 20000 });

        // Step 2: click the cron step node on canvas to open cron slider
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // Step 3: click Change button in cron slider header
        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Step 4: email option should be visible but disabled (opacity-50, cursor-not-allowed)
        // When triggerType is 'cron', email is not selectable (AddStepSearchView.tsx)
        const emailOption = triggers.triggerOption.filter({ hasText: /email/i });
        await expect(emailOption).toBeVisible();
        await expect(emailOption).toHaveClass(/opacity-50/);
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

        // goLiveButton appears only after the trigger is saved successfully
        await expect(workflow.publish.goLiveButton).toBeVisible({ timeout: 20000 });

        // Step 2: click the cron step node on canvas to open cron slider
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // Step 3: click Change button in cron slider header
        await expect(workflow.cronChangeButton).toBeVisible();
        await workflow.cronChangeButton.click();

        // Step 4: search for a plugin and pick the first result
        await triggers.triggerSearchInput.fill('Gmail');
        const firstPluginOption = triggers.page.getByRole('option').first();
        await expect(firstPluginOption).toBeVisible();
        await firstPluginOption.click();

        // Plugin trigger config opens → search input should be gone
        await expect(triggers.triggerSearchInput).not.toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 7: Expression toggle reveals the raw cron expression field      //
    // ------------------------------------------------------------------ //
    test('expression toggle reveals cron expression field', async ({ triggers, workflow }) => {
        await triggers.selectCronTrigger();

        // Save a cron statement first — the expression toggle only renders
        // when triggerInfo.cronExpression is truthy (cronComponent.tsx line 518)
        await triggers.cron.fillStatement('Every day at 9am');
        await triggers.cron.cronInput.press('Tab');
        await triggers.cron.save();

        // goLiveButton appears only after the trigger is saved successfully
        await expect(workflow.publish.goLiveButton).toBeVisible({ timeout: 20000 });

        // Re-open cron slider from canvas
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // Expression field hidden by default
        await expect(triggers.cron.expressionField).not.toBeVisible();

        // Toggle to expression mode
        await expect(triggers.cron.expressionToggle).toBeVisible();
        await triggers.cron.clickExpressionToggle();

        // Expression field should now be visible
        await expect(triggers.cron.expressionField).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 8: Save button is disabled before a statement is entered        //
    // ------------------------------------------------------------------ //
    test('cron save button is disabled before entering statement', async ({ triggers }) => {
        await triggers.selectCronTrigger();

        // No statement yet — save button must be disabled
        await expect(triggers.cron.setCronButton).toBeDisabled();

        // After filling a statement the button becomes enabled
        await triggers.cron.fillStatement('Every hour');
        await expect(triggers.cron.setCronButton).toBeEnabled();
    });

    // ------------------------------------------------------------------ //
    // Test 9: Trigger search input is fillable and filters results         //
    // ------------------------------------------------------------------ //
    test('trigger search input is fillable and filters results', async ({ triggers }) => {
        // The trigger search input is visible on the initial trigger-selection screen
        await expect(triggers.triggerSearchInput).toBeVisible();

        // Should accept typed text (data-testid is on the <input> element)
        await triggers.triggerSearchInput.fill('Gmail');

        // At least one search result matching the query should appear
        // Search results render as role='option' via MUI useAutocomplete (not data-testid='trigger-option')
        await expect(triggers.page.getByRole('option').filter({ hasText: /gmail/i }).first()).toBeVisible();
    });

    // ------------------------------------------------------------------ //
    // Test 10: Change button is visible in the cron slider after saving    //
    // ------------------------------------------------------------------ //
    test('change button is visible in cron slider after saving', async ({ triggers, workflow }) => {
        await triggers.selectCronTrigger();
        await triggers.cron.fillStatement('Every day at noon');
        await triggers.cron.cronInput.press('Tab');
        await triggers.cron.save();

        // Open cron slider from canvas
        await expect(workflow.inflowCronNode).toBeVisible();
        await workflow.inflowCronNode.click();

        // Change button must be visible in the slider header
        await expect(workflow.cronChangeButton).toBeVisible();
    });

});

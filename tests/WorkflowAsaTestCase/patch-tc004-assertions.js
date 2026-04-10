// const fs = require('fs');
// const path = require('path');

// const filePath = path.join(__dirname, 'workflow1.spec.ts');
// let content = fs.readFileSync(filePath, 'utf8');

// const oldBlock = `    // ── Step 8: Select the Slack option from results ─────────────────────────
//     // ListItemButton with ListItemText primary=service_name (ConnectedAppsRenderer.tsx)
//     // No aria-label — use role='option' filtered by exact name 'Slack'
//     await page.getByRole('option', { name: /^Slack$/i }).click();

//     // ── Step 8b: Select 'Send Message' action from the Slack actions list ────
//     // After selecting Slack app, the action list opens — must pick an action first
//     // No data-testid on action list items — stable text selector
//     await page.getByText('Send Message').first().click();

//     // ── Step 9: Click auth connection chip to connect Slack account ──────────
//     // data-testid='auth-connection-chip' (BasicAndAuth2.tsx line 640)
//     await page.getByTestId('auth-connection-chip').click();

//     // ── Step 10: Select the existing Slack connection ───────────────────────
//     // Text 'something' is the existing connection label — no data-testid on connection list items
//     await page.getByText('something').click();

//     // ── Step 11: Click 'Select Slack channel(s)' button to open channel picker
//     // role=button with name — no data-testid on this Slack field button
//     await page.getByRole('button', { name: 'Select Slack channel(s)' }).click();

//     // ── Step 12: Select the Slack channel ───────────────────────────────────
//     // Text match for the channel option — no data-testid on dropdown items
//     await page.getByText('fraud-review (C0AQTGJ23DM)').click();

//     // ── Step 13: Click inside the channel_id field scroll area to confirm selection
//     // #scroll-channel_id is the plugin-rendered field container — use stable locator scoped by field label
//     await page.locator('#scroll-channel_id').click();

//     // ── Step 14: Click the message textbox and close variable popover ────────
//     await page.getByRole('textbox', { name: /Type your message/i }).click();
//     // data-testid='variable-popover-close-button' (VariablePopoverMenu.tsx line 484)
//     await page.getByTestId('variable-popover-close-button').click();

//     // ── Step 15: Test the Slack step (dry run) ───────────────────────────────
//     // data-testid='dry-run-test-button' (pluginButton/dryRunButton.tsx line 177)
//     await page.getByTestId('dry-run-test-button').click();

//     // ── Step 16: Save the Slack step ────────────────────────────────────────
//     // data-testid='save-button' (saveButtonV3.tsx)
//     await page.getByTestId('save-button').click();

//     console.log('✅ Multiple Paths added, Slack step configured in first branch, tested and saved');`;

// const newBlock = `    // ── Step 8: Select the Slack option from results ─────────────────────────
//     // ListItemButton with ListItemText primary=service_name (ConnectedAppsRenderer.tsx)
//     // No aria-label — use role='option' filtered by exact name 'Slack'
//     await page.getByRole('option', { name: /^Slack$/i }).click();

//     // ── Step 8b: Select 'Send Message' action from the Slack actions list ────
//     // After selecting Slack app, the action list opens — must pick an action first
//     // No data-testid on action list items — stable text selector
//     await page.getByText('Send Message').first().click();

//     // ── Assert: 'Send Message' panel is now open ─────────────────────────────
//     await expect(page.getByTestId('auth-connection-chip')).toBeVisible({ timeout: 10000 });

//     // ── Step 9: Click auth connection chip to connect Slack account ──────────
//     // data-testid='auth-connection-chip' (BasicAndAuth2.tsx line 640)
//     await page.getByTestId('auth-connection-chip').click();

//     // ── Step 10: Select the existing Slack connection ───────────────────────
//     // Text 'something' is the existing connection label — no data-testid on connection list items
//     await page.getByText('something').click();

//     // ── Assert: connection was selected — channel picker button is now visible ─
//     await expect(page.getByRole('button', { name: 'Select Slack channel(s)' })).toBeVisible({ timeout: 10000 });

//     // ── Step 11: Click 'Select Slack channel(s)' button to open channel picker
//     // role=button with name — no data-testid on this Slack field button
//     await page.getByRole('button', { name: 'Select Slack channel(s)' }).click();

//     // ── Step 12: Select the Slack channel ───────────────────────────────────
//     // Text match for the channel option — no data-testid on dropdown items
//     await page.getByText('fraud-review (C0AQTGJ23DM)').click();

//     // ── Assert: channel was selected — text appears inside the field ──────────
//     await expect(page.locator('#scroll-channel_id')).toContainText('fraud-review', { timeout: 8000 });

//     // ── Step 13: Click inside the channel_id field scroll area to confirm selection
//     await page.locator('#scroll-channel_id').click();

//     // ── Step 14: Click the message textbox and close variable popover ────────
//     await page.getByRole('textbox', { name: /Type your message/i }).click();
//     // data-testid='variable-popover-close-button' (VariablePopoverMenu.tsx line 484)
//     await page.getByTestId('variable-popover-close-button').click();

//     // ── Step 15: Test the Slack step (dry run) ───────────────────────────────
//     // data-testid='dry-run-test-button' (pluginButton/dryRunButton.tsx line 177)
//     await page.getByTestId('dry-run-test-button').click();

//     // ── Assert: dry run completed — save button is now enabled ───────────────
//     await expect(page.getByTestId('save-button')).toBeEnabled({ timeout: 15000 });

//     // ── Step 16: Save the Slack step ────────────────────────────────────────
//     // data-testid='save-button' (saveButtonV3.tsx)
//     await page.getByTestId('save-button').click();

//     console.log('✅ Multiple Paths added, Slack step configured in first branch, tested and saved');`;

// if (!content.includes(oldBlock)) {
//   console.error('Could not find target block — aborting.');
//   process.exit(1);
// }

// content = content.replace(oldBlock, newBlock);
// fs.writeFileSync(filePath, content, 'utf8');
// console.log('TC-WF-004 assertions added successfully.');

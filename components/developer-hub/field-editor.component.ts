import { Page, Locator } from '@playwright/test';

/**
 * Field Editor Component (Developer Hub)
 * Handles: field rendering, editing, data field CRUD, scope separator, show field config
 * Reference: fieldRenderer.tsx, basicAuthFieldsCard.tsx, createBasicAuthField.tsx
 */
export class FieldEditorComponent {
    readonly page: Page;

    // Field editor
    readonly editorCloseButton: Locator;
    readonly editorModeRadioGroup: Locator;

    // Field renderer
    readonly rendererCheckbox: Locator;
    readonly rendererInfoButton: Locator;
    readonly rendererRemoveButton: Locator;
    readonly rendererSearchApiCheckbox: Locator;

    // Field menu
    readonly menuAddOptionButton: Locator;

    // Fields card
    readonly cardRemoveButton: Locator;

    // Field source
    readonly sourceDebugAiButton: Locator;
    readonly sourceTestButton: Locator;

    // Data field CRUD
    readonly dataFieldAddKeyButton: Locator;
    readonly dataFieldDeleteButton: Locator;
    readonly dataFieldDeleteCancelButton: Locator;
    readonly dataFieldDeleteConfirmButton: Locator;

    // Hidden fields
    readonly hiddenFieldsSetupAutocomplete: Locator;

    // Scope separator
    readonly scopeSeparatorRadioGroup: Locator;

    // Show field
    readonly showFieldAddButton: Locator;
    readonly showFieldRedirectUrlCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;

        // Field editor — from fieldRenderer.tsx
        this.editorCloseButton = page.getByTestId('field-editor-close-button');
        this.editorModeRadioGroup = page.getByTestId('field-editor-mode-radio-group');

        // Field renderer
        this.rendererCheckbox = page.getByTestId('field-renderer-checkbox');
        this.rendererInfoButton = page.getByTestId('field-renderer-info-button');
        this.rendererRemoveButton = page.getByTestId('field-renderer-remove-button');
        this.rendererSearchApiCheckbox = page.getByTestId('field-renderer-search-api-checkbox');

        // Field menu
        this.menuAddOptionButton = page.getByTestId('field-menu-add-option-button');

        // Fields card
        this.cardRemoveButton = page.getByTestId('fields-card-remove-button');

        // Field source
        this.sourceDebugAiButton = page.getByTestId('field-source-debug-ai-button');
        this.sourceTestButton = page.getByTestId('field-source-test-button');

        // Data field CRUD — from basicAuthFieldsCard.tsx
        this.dataFieldAddKeyButton = page.getByTestId('data-field-add-key-button');
        this.dataFieldDeleteButton = page.getByTestId('data-field-delete-button');
        this.dataFieldDeleteCancelButton = page.getByTestId('data-field-delete-cancel-button');
        this.dataFieldDeleteConfirmButton = page.getByTestId('data-field-delete-confirm-button');

        // Hidden fields
        this.hiddenFieldsSetupAutocomplete = page.getByTestId('hidden-fields-setup-autocomplete');

        // Scope separator
        this.scopeSeparatorRadioGroup = page.getByTestId('scope-separator-radio-group');

        // Show field
        this.showFieldAddButton = page.getByTestId('show-field-add-button');
        this.showFieldRedirectUrlCheckbox = page.getByTestId('show-field-redirect-url-checkbox');
    }

    async closeEditor(): Promise<void> {
        await this.editorCloseButton.click();
    }

    async addDataFieldKey(): Promise<void> {
        await this.dataFieldAddKeyButton.click();
    }

    async deleteDataField(): Promise<void> {
        await this.dataFieldDeleteButton.click();
    }

    async confirmDeleteDataField(): Promise<void> {
        await this.dataFieldDeleteConfirmButton.click();
    }

    async cancelDeleteDataField(): Promise<void> {
        await this.dataFieldDeleteCancelButton.click();
    }

    async addShowField(): Promise<void> {
        await this.showFieldAddButton.click();
    }
}

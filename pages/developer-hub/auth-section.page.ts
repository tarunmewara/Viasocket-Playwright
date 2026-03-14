import { Page, Locator } from '@playwright/test';

/**
 * Auth Section Page (Developer Hub)
 * Handles: authentication configuration, auth types, versions, basic auth fields,
 * connect/authorize, grant type, response tabs
 * Reference: AuthenticationSection.tsx, AuthenticationForm.tsx, basicAuthFieldsCard.tsx
 */
export class AuthSectionPage {
    readonly page: Page;

    // Auth navigation
    readonly backButton: Locator;
    readonly deleteButton: Locator;
    readonly deleteCancelButton: Locator;
    readonly deleteConfirmButton: Locator;
    readonly connectButton: Locator;
    readonly descriptionInput: Locator;
    readonly learnMoreLink: Locator;

    // Auth type & version
    readonly typeRadioGroup: Locator;
    readonly versionAgreeButton: Locator;
    readonly versionCancelButton: Locator;
    readonly versionDropdown: Locator;
    readonly preferredVersionCheckbox: Locator;

    // Auth grant type
    readonly grantTypeGroup: Locator;

    // Auth form
    readonly formAddFieldButton: Locator;
    readonly formRemoveFieldButton: Locator;
    readonly formDeleteCancelButton: Locator;
    readonly formDeleteConfirmButton: Locator;
    readonly formResponseTab: Locator;
    readonly formResponseTabs: Locator;

    // Auth1 response
    readonly auth1ResponseTab: Locator;
    readonly auth1ResponseTabs: Locator;

    // Auth2 actions
    readonly auth2BackButton: Locator;
    readonly auth2ConnectButton: Locator;
    readonly auth2TogglePasswordButton: Locator;

    // Auth congrats
    readonly congratsHomeButton: Locator;

    // Authorize org modal
    readonly authorizeOrgModal: Locator;

    // Basic auth field actions
    readonly basicAuthCopyPathButton: Locator;
    readonly basicAuthDeleteCancelButton: Locator;
    readonly basicAuthDeleteConfirmButton: Locator;
    readonly basicAuthDeleteFieldButton: Locator;
    readonly basicAuthDeleteRedirectUrlButton: Locator;
    readonly basicAuthEditFieldButton: Locator;
    readonly basicAuthTogglePasswordButton: Locator;

    // Code challenge
    readonly codeChallengeMethodRadioGroup: Locator;
    readonly codeChallengeCopyPathButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Auth navigation
        this.backButton = page.getByTestId('auth-back-button');
        this.deleteButton = page.getByTestId('auth-delete-button');
        this.deleteCancelButton = page.getByTestId('auth-delete-cancel-button');
        this.deleteConfirmButton = page.getByTestId('auth-delete-confirm-button');
        this.connectButton = page.getByTestId('auth-connect-button');
        this.descriptionInput = page.getByTestId('auth-description-input');
        this.learnMoreLink = page.getByTestId('auth-learn-more-link');

        // Auth type & version
        this.typeRadioGroup = page.getByTestId('auth-type-radio-group');
        this.versionAgreeButton = page.getByTestId('auth-version-agree-button');
        this.versionCancelButton = page.getByTestId('auth-version-cancel-button');
        this.versionDropdown = page.getByTestId('auth-version-dropdown');
        this.preferredVersionCheckbox = page.getByTestId('auth-preferred-version-checkbox');

        // Auth grant type
        this.grantTypeGroup = page.getByTestId('auth-grant-type-group');

        // Auth form
        this.formAddFieldButton = page.getByTestId('auth-form-add-field-button');
        this.formRemoveFieldButton = page.getByTestId('auth-form-remove-field-button');
        this.formDeleteCancelButton = page.getByTestId('auth-form-delete-cancel-button');
        this.formDeleteConfirmButton = page.getByTestId('auth-form-delete-confirm-button');
        this.formResponseTab = page.getByTestId('auth-form-response-tab');
        this.formResponseTabs = page.getByTestId('auth-form-response-tabs');

        // Auth1 response
        this.auth1ResponseTab = page.getByTestId('auth1-response-tab');
        this.auth1ResponseTabs = page.getByTestId('auth1-response-tabs');

        // Auth2 actions
        this.auth2BackButton = page.getByTestId('auth2-back-button');
        this.auth2ConnectButton = page.getByTestId('auth2-connect-button');
        this.auth2TogglePasswordButton = page.getByTestId('auth2-toggle-password-button');

        // Auth congrats
        this.congratsHomeButton = page.getByTestId('auth-congrats-home-button');

        // Authorize org modal
        this.authorizeOrgModal = page.getByTestId('authorize-org-modal');

        // Basic auth field actions
        this.basicAuthCopyPathButton = page.getByTestId('basic-auth-copy-path-button');
        this.basicAuthDeleteCancelButton = page.getByTestId('basic-auth-delete-cancel-button');
        this.basicAuthDeleteConfirmButton = page.getByTestId('basic-auth-delete-confirm-button');
        this.basicAuthDeleteFieldButton = page.getByTestId('basic-auth-delete-field-button');
        this.basicAuthDeleteRedirectUrlButton = page.getByTestId('basic-auth-delete-redirect-url-button');
        this.basicAuthEditFieldButton = page.getByTestId('basic-auth-edit-field-button');
        this.basicAuthTogglePasswordButton = page.getByTestId('basic-auth-toggle-password-button');

        // Code challenge
        this.codeChallengeMethodRadioGroup = page.getByTestId('code-challenge-method-radio-group');
        this.codeChallengeCopyPathButton = page.getByTestId('code-challenge-copy-path-button');
    }

    async goBack(): Promise<void> {
        await this.backButton.click();
    }

    async clickConnect(): Promise<void> {
        await this.connectButton.click();
    }

    async clickDelete(): Promise<void> {
        await this.deleteButton.click();
    }

    async confirmDelete(): Promise<void> {
        await this.deleteConfirmButton.click();
    }

    async cancelDelete(): Promise<void> {
        await this.deleteCancelButton.click();
    }

    async agreeVersion(): Promise<void> {
        await this.versionAgreeButton.click();
    }

    async cancelVersion(): Promise<void> {
        await this.versionCancelButton.click();
    }

    async addFormField(): Promise<void> {
        await this.formAddFieldButton.click();
    }

    async removeFormField(): Promise<void> {
        await this.formRemoveFieldButton.click();
    }
}

import { Page } from '@playwright/test';
import { WorkflowNavbarComponent } from '../../components/navbar/workflow-navbar.component';
import { DeleteFlowModal } from '../../modals/delete-flow.modal';
import { DuplicateFlowModal } from '../../modals/duplicate-flow.modal';
import { ShareFlowModal } from '../../modals/share-flow.modal';

/**
 * Flow Options Page
 * Composes: WorkflowNavbarComponent, DeleteFlowModal, DuplicateFlowModal, ShareFlowModal
 */
export class FlowOptionsPage {
    readonly page: Page;

    // Composed components / modals
    readonly navbar: WorkflowNavbarComponent;
    readonly deleteModal: DeleteFlowModal;
    readonly duplicateModal: DuplicateFlowModal;
    readonly shareModal: ShareFlowModal;

    constructor(page: Page) {
        this.page = page;
        this.navbar = new WorkflowNavbarComponent(page);
        this.deleteModal = new DeleteFlowModal(page);
        this.duplicateModal = new DuplicateFlowModal(page);
        this.shareModal = new ShareFlowModal(page);
    }

    // --- More options menu ---

    async openMoreOptions(): Promise<void> {
        await this.navbar.openMoreOptions();
    }

    async selectMenuOption(optionText: string): Promise<void> {
        await this.navbar.selectMenuOption(optionText);
    }

    // --- Delete flow ---

    async confirmDelete(): Promise<void> {
        await this.deleteModal.confirm();
    }

    async cancelDelete(): Promise<void> {
        await this.deleteModal.cancel();
    }

    async deleteFlow(): Promise<void> {
        await this.selectMenuOption('Delete');
        await this.deleteModal.confirm();
    }

    // --- Duplicate ---

    async duplicateFlow(): Promise<void> {
        await this.selectMenuOption('Duplicate');
        await this.duplicateModal.confirmDuplicate();
    }

    async cancelDuplicate(): Promise<void> {
        await this.duplicateModal.cancel();
    }

    // --- Share ---

    async closeShareDialog(): Promise<void> {
        await this.shareModal.close();
    }

    async copyFlowLink(): Promise<void> {
        await this.shareModal.copyLink();
    }

    async createTemplate(): Promise<void> {
        await this.shareModal.createTemplate();
    }

    async copyTemplateLink(): Promise<void> {
        await this.shareModal.copyTemplateLink();
    }

    // --- State checks ---

    async isMoreOptionsVisible(): Promise<boolean> {
        return this.navbar.moreOptionsButton.isVisible();
    }

    async isDeleteConfirmVisible(): Promise<boolean> {
        return this.deleteModal.isVisible();
    }
}

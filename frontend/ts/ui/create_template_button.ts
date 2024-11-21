import * as bootstrap from 'bootstrap';

import {addListenerToSaveTemplateButton} from "./save_template_button";

export function initCreateTemplateButton() {
    const createTemplateBtn = document.getElementById('createTemplateBtn') as HTMLButtonElement;
    const templateContentInput = document.getElementById('templateContent') as HTMLInputElement;

    // Event listener to open the modal
    createTemplateBtn.addEventListener('click', () => {
        // Clear form inputs
        templateContentInput.value = '';
        openCreateTemplateModal(false);
    });
}

export function openCreateTemplateModal(isUpdate: boolean, templateId?: number) {
    const modalElement = document.getElementById('createTemplateModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modalElement);

    // Show the modal
    bootstrapModal.show();

    // Clear the content field for a new template
    const templateContentInput = document.getElementById('templateContent') as HTMLInputElement;
    templateContentInput.value = '';

    // Set the correct event listener for saving the template (create or update)
    addListenerToSaveTemplateButton(isUpdate, templateId);
}
import * as bootstrap from 'bootstrap';

import {createTemplate, updateTemplate} from "../fetch";
import {updateTemplateList} from "./template_list";

export function addListenerToSaveTemplateButton(isUpdate: boolean, templateId?: number) {
    const saveTemplateBtn = document.getElementById('saveTemplateBtn') as HTMLButtonElement;
    const templateContentInput = document.getElementById('templateContent') as HTMLInputElement;

    const saveTemplateHandler = async () => {
        const templateContent = templateContentInput.value.trim();

        if (!templateContent) {
            alert('Введіть умову задачі!');
            return;
        }

        try {
            if (isUpdate && templateId !== undefined) {
                await updateTemplate(templateId, templateContent);
            } else {
                await createTemplate(templateContent);
            }

            // Close modal (Bootstrap handles modal toggle)
            const modalElement = document.getElementById('createTemplateModal') as HTMLElement;
            const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
            bootstrapModal?.hide();

            // Refresh the template list
            await updateTemplateList();
        } catch (error) {
            alert(`Failed to ${isUpdate ? 'update' : 'create'} template: ${(error as Error).message}`);
        }
    };

    // Remove any existing event listener to avoid multiple bindings
    saveTemplateBtn.removeEventListener('click', saveTemplateHandler);

    // Attach the event listener dynamically
    saveTemplateBtn.addEventListener('click', saveTemplateHandler);
}

import * as bootstrap from 'bootstrap';

import {createTemplate, updateTemplate} from "../fetch";
import {updateTemplateList} from "./template_list";

export function addListenerToSaveTemplateButton() {
    const saveTemplateBtn = document.getElementById('saveTemplateBtn') as HTMLButtonElement;

    const saveTemplateHandler = async () => {
        const templateContentInput = document.getElementById('templateContent') as HTMLInputElement;
        const createTemplateModal = document.getElementById('createTemplateModal') as HTMLInputElement;
        const templateContent = templateContentInput.value.trim();

        const templateId = createTemplateModal.getAttribute("data-template-id");
        const action = createTemplateModal.getAttribute('data-action');

        const isUpdate = action == "update"
        
        if (!templateContent) {
            alert('Введіть умову задачі!');
            return;
        }

        try {
            if (isUpdate && templateId != null) {
                await updateTemplate(templateId, templateContent);
            } else {
                await createTemplate(templateContent);
            }

            // Refresh the template list
            await updateTemplateList();
        } catch (error) {
            alert(`Failed to ${isUpdate ? 'update' : 'create'} template: ${(error as Error).message}`);
        }
    };

    // Attach the event listener dynamically
    saveTemplateBtn.addEventListener('click', saveTemplateHandler);
}

import * as bootstrap from 'bootstrap';

import { getTemplates, updateTemplate, deleteTemplate } from '../fetch';
import {addListenerToSaveTemplateButton} from "./save_template_button";

export async function updateTemplateList() {
    try {
        // Get the template list element
        const templateList = document.getElementById('templateList') as HTMLUListElement;

        // Fetch templates from the API
        const templates = await getTemplates();

        console.log(templates);

        // Clear existing list items
        templateList.innerHTML = '';

        // Populate the list with fetched templates
        templates.forEach((template) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.dataset.templateId = template.id.toString(); // Store the template ID in the list item

            // Create a span for the template content
            const contentSpan = document.createElement('span');
            contentSpan.textContent = template.content;

            // Create an update button
            const updateButton = document.createElement('button');
            updateButton.className = 'btn btn-primary btn-sm me-2 ';
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', () => handleUpdate(template));

            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this template?')) {
                    await handleDelete(template.id);
                }
            });

            // Append elements to the list item
            listItem.appendChild(contentSpan);
            listItem.appendChild(updateButton);
            listItem.appendChild(deleteButton);

            // Append the list item to the template list
            templateList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error updating template list:', (error as Error).message);
        alert('Failed to update template list.');
    }
}

async function handleUpdate(template: { id: number; content: string }) {
    // Open the modal
    const modalElement = document.getElementById('createTemplateModal') as HTMLElement;
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();

    // Fill the modal with the current template content
    const templateContentInput = document.getElementById('templateContent') as HTMLInputElement;
    templateContentInput.value = template.content;

    // Add event listener for save button with update logic
    addListenerToSaveTemplateButton(true, template.id);
}

async function handleDelete(templateId: number) {
    try {
        // Call the delete function
        await deleteTemplate(templateId);

        // Refresh the list
        await updateTemplateList();
    } catch (error) {
        console.error('Error deleting template:', (error as Error).message);
        alert('Failed to delete template.');
    }
}

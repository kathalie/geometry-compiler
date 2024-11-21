import { getTemplates, deleteTemplate } from '../fetch';

export async function updateTemplateList() {
    try {
        // Get the template list element
        const templateList = document.getElementById('templateList') as HTMLUListElement;
        const templateContentInput = document.getElementById('templateContent') as HTMLInputElement;
        const createTemplateModal = document.getElementById('createTemplateModal') as HTMLInputElement;

        // Fetch templates from the API
        const templates = await getTemplates();

        console.log(templates);

        // Clear existing list items
        templateList.innerHTML = '';

        // Populate the list with fetched templates
        templates.forEach((template) => {
            const listItem = document.createElement('li');
            listItem.id = "templateLi";
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center'; // Flex layout for horizontal items
            listItem.dataset.templateId = template.id.toString(); // Store the template ID in the list item

            // Create a span for the template content
            const contentSpan = document.createElement('span');
            contentSpan.textContent = template.content;

            // Create a container for the buttons (aligned horizontally)
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'd-flex'; // Make buttons appear in a horizontal row

            // Create an update button with an icon
            const updateButton = document.createElement('button');
            updateButton.className = 'btn btn-secondary btn-sm me-2'; // Use similar style for all buttons
            updateButton.setAttribute('data-bs-toggle', 'modal');
            updateButton.setAttribute('data-bs-target', '#createTemplateModal');
            updateButton.setAttribute('aria-label', 'Update template');
            updateButton.addEventListener('click', () => {
                templateContentInput.value = template.content;
                createTemplateModal.setAttribute("data-template-id", String(template.id));
                createTemplateModal.setAttribute('data-action', 'update');
            });

            // Add the edit icon from Bootstrap Icons
            updateButton.innerHTML = '<i class="bi bi-pencil"></i>';

            // Create a delete button with an icon
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm me-2'; // Similar style for delete button
            deleteButton.setAttribute('aria-label', 'Delete template');
            deleteButton.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this template?')) {
                    await handleDelete(template.id);
                }
            });

            // Add the trash icon from Bootstrap Icons
            deleteButton.innerHTML = '<i class="bi bi-trash"></i>';

            // Create a button to append template content to the text field with an icon
            const appendContentButton = document.createElement('button');
            appendContentButton.className = 'btn btn-info btn-sm'; // Similar style for append button
            appendContentButton.setAttribute('aria-label', 'Add content');
            appendContentButton.addEventListener('click', () => {
                const templateContentInput = document.getElementById('area_with_task') as HTMLTextAreaElement;
                templateContentInput.value += `${template.content}`;  // Use 'value' to append text
            });

            // Add the plus icon from Bootstrap Icons
            appendContentButton.innerHTML = '<i class="bi bi-plus-circle"></i>';

            // Append buttons to the button container
            buttonContainer.appendChild(updateButton);
            buttonContainer.appendChild(deleteButton);
            buttonContainer.appendChild(appendContentButton);

            // Append content and buttons to the list item
            listItem.appendChild(contentSpan);
            listItem.appendChild(buttonContainer);

            // Append the list item to the template list
            templateList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error updating template list:', (error as Error).message);
        alert('Failed to update template list.');
    }
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

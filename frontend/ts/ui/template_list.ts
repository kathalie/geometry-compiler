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
            listItem.id = "templateLi"
            listItem.className = 'list-group-item d-flex flex-column align-items-start';
            listItem.dataset.templateId = template.id.toString(); // Store the template ID in the list item

            // Create a span for the template content
            const contentSpan = document.createElement('span');
            contentSpan.textContent = template.content;

            // Create a container for the buttons (to organize them in a row)
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'd-flex justify-content-start w-100 mt-2'; // This ensures buttons are in a row

            // Create an update button
            const updateButton = document.createElement('button');
            updateButton.className = 'btn btn-primary btn-sm me-2';
            updateButton.textContent = 'Оновити';
            updateButton.setAttribute('data-bs-toggle', 'modal');
            updateButton.setAttribute('data-bs-target', '#createTemplateModal');
            updateButton.addEventListener('click', () => {
                templateContentInput.value = template.content;
                createTemplateModal.setAttribute("data-template-id", String(template.id));
                createTemplateModal.setAttribute('data-action', 'update');
            });

            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm me-2';
            deleteButton.textContent = 'Видалити';
            deleteButton.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this template?')) {
                    await handleDelete(template.id);
                }
            });

            // Create a button to append template content to the text field
            const appendContentButton = document.createElement('button');
            appendContentButton.className = 'btn btn-info btn-sm';
            appendContentButton.textContent = 'Додати';
            appendContentButton.addEventListener('click', () => {
                const templateContentInput = document.getElementById('area_with_task') as HTMLTextAreaElement;
                templateContentInput.value += `${template.content}`;  // Use 'value' to append text
            });


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

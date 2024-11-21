export function initCreateTemplateButton() {
    const createTemplateBtn = document.getElementById('createTemplateBtn') as HTMLButtonElement;
    const templateContentInput = document.getElementById('templateContent') as HTMLInputElement;
    const createTemplateModal = document.getElementById('createTemplateModal') as HTMLInputElement;

    // Event listener to open the modal
    createTemplateBtn.addEventListener('click', () => {
        // Clear form inputs
        templateContentInput.value = '';
        createTemplateModal.setAttribute('data-action', 'update');
    });
}

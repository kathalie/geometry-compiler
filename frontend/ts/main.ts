import JXG from "jsxgraph";
import {fetchElements} from "./fetch";
import {getById} from "./helpers";

function initedBoard(): JXG.Board {
  return JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-8, 8, 8, -8]});
}

function initDrawImageButton() {

  const drawImageButton = document.getElementById('submit_task') as HTMLElement;

  drawImageButton.addEventListener('click', (event) => {
    event.preventDefault();

    const errorDiv = getById('error_div');
    const boardDiv = getById('jxgbox');
    const board = initedBoard();

    fetchElements()
        .then(async res => {
          if (!res.ok)
            throw Error(await res.text());

          return res.json();
        })
        .then(elements => {
          boardDiv.hidden = false;
          errorDiv.innerText = '';

          for (let element of elements) {
            board.create(element.elementType, element.parents, element.attributes);
          }
        })
        .catch(error => {
          boardDiv.hidden = true;
          errorDiv.innerText = error.message;
        });
  });
}

interface Template {
  id: number;
  name: string;
  content: string;
}

// Store templates in memory (could be replaced by server-side storage)
const templates: Template[] = [];
let templateIdCounter = 1;

function renderTemplateList() {
  const templateList = document.getElementById('templateList') as HTMLElement;
  templateList.innerHTML = ''; // Clear list

  templates.forEach((template) => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

    // Template Name (clickable)
    const nameSpan = document.createElement('span');
    nameSpan.textContent = template.name;
    nameSpan.className = 'text-primary cursor-pointer';
    nameSpan.style.cursor = 'pointer';
    nameSpan.onclick = () => insertTemplateIntoTextField(template.content);

    // Edit and Delete Buttons
    const actionButtons = document.createElement('div');
    actionButtons.innerHTML = `
      <button class="btn btn-sm btn-warning me-2">Edit</button>
      <button class="btn btn-sm btn-danger">Delete</button>
    `;

    const [editButton, deleteButton] = actionButtons.children as any;

    // Edit Template
    editButton.onclick = () => editTemplate(template.id);

    // Delete Template
    deleteButton.onclick = () => deleteTemplate(template.id);

    // Append elements to list item
    listItem.appendChild(nameSpan);
    listItem.appendChild(actionButtons);
    templateList.appendChild(listItem);
  });
}

function insertTemplateIntoTextField(content: string) {
  const textField = document.getElementById('area_with_task') as HTMLTextAreaElement;
  textField.value = content;
}

function createTemplate() {
  const name = prompt('Enter template name:');
  if (name) {
    const content = prompt('Enter template content:');
    if (content) {
      templates.push({ id: templateIdCounter++, name, content });
      renderTemplateList();
    }
  }
}

function editTemplate(id: number) {
  const template = templates.find((t) => t.id === id);
  if (template) {
    const newName = prompt('Edit template name:', template.name);
    const newContent = prompt('Edit template content:', template.content);

    if (newName !== null && newContent !== null) {
      template.name = newName;
      template.content = newContent;
      renderTemplateList();
    }
  }
}

function deleteTemplate(id: number) {
  const index = templates.findIndex((t) => t.id === id);
  if (index > -1) {
    templates.splice(index, 1);
    renderTemplateList();
  }
}

function init() {
  // Initialize templates functionality
  const createTemplateBtn = document.getElementById('createTemplateBtn') as HTMLElement;
  createTemplateBtn.addEventListener('click', createTemplate);

  initedBoard();
  initDrawImageButton();
  renderTemplateList(); // Render templates on load
}

init();

import {Template} from "./model/Template";

const BASE_URL = "http://localhost:3000";

function getInputTaskValue(): string {
  const textArea = document.getElementById('area_with_task') as HTMLTextAreaElement;

  return textArea.value;
}

export async function fetchElements(): Promise<Response> {
  return await fetch(`${BASE_URL}/?task=${getInputTaskValue()}`);
}

export async function getTemplates(): Promise<Template[]> {
  const response = await fetch(`${BASE_URL}/templates`);
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }

  return await response.json();
}

export async function createTemplate(content: string): Promise<Template> {
  const response = await fetch(`${BASE_URL}/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to create template');
  }

  return await response.json();
}

export async function updateTemplate(id: string, content: string): Promise<Template> {
  const response = await fetch(`${BASE_URL}/templates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to update template');
  }
  return await response.json();
}

// 4. Delete a template
export async function deleteTemplate(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/templates/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete template');
  }
}
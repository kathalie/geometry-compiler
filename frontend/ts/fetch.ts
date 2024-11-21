import {ElementDTO} from "./model/ElementDTO";
import {ApiResponse, Template} from "./model/Template";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function getInputTaskValue(): string {
  const textArea = document.getElementById('area_with_task') as HTMLTextAreaElement;

  return textArea.value;
}

export async function fetchElements(): Promise<Response> {
  return await fetch(`${BASE_URL}/?task=${getInputTaskValue()}`);
}

export async function getTemplates(): Promise<ElementDTO[]> {
  const response = await fetch(`${BASE_URL}/templates`);
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  const data: ApiResponse<ElementDTO[]> = await response.json();

  return data.data;
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

  const data: ApiResponse<Template> = await response.json();

  return data.data;
}

export async function updateTemplate(id: number, content: string): Promise<Template> {
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

  const data: ApiResponse<Template> = await response.json();

  return data.data;
}

// 4. Delete a template
async function deleteTemplate(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/templates/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete template');
  }
}
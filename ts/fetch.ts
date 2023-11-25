import {ElementDTO} from "./model/ElementDTO";

function getInputTask(): string {
  const textArea = document.getElementById('area_with_task') as HTMLTextAreaElement;

  return textArea.value;
}

export async function fetchElements(): Promise<ElementDTO[]> {
  const inputTask = getInputTask();
  const res = await fetch(`http://localhost:3000/?task=${inputTask}`);

  return await res.json();
}

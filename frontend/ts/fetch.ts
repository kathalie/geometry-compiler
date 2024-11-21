import {ElementDTO} from "./model/ElementDTO";
function getInputTaskValue(): string {
  const textArea = document.getElementById('area_with_task') as HTMLTextAreaElement;

  return textArea.value;
}

export async function fetchElements(): Promise<Response> {
  return await fetch(`http://localhost:3000/?task=${getInputTaskValue()}`);
}

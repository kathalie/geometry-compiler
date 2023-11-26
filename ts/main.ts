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
    const board = getById('jxgbox');

    fetchElements()
      .then(async res => {
        if (!res.ok)
          throw Error(await res.text());

        return res.json();
      })
      .then(elements => {
        board.hidden = false;
        errorDiv.innerText = '';

        for (let element of elements) {
          initedBoard().create(element.elementType, element.parents, element.attributes);
        }
      })
      .catch(error => {
        board.hidden = true;
        errorDiv.innerText = error.message;
      });
  });
}

function init() {
  initedBoard();
  initDrawImageButton();
}

init();

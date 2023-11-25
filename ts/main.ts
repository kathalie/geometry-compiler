import JXG from "jsxgraph";
import {fetchElements} from "./fetch";

function initDrawImageButton() {

  const drawImageButton = document.getElementById('submit_task') as HTMLElement;

  drawImageButton.addEventListener('click', (event) => {
    event.preventDefault();

    fetchElements().then((elements) => {
      const board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-8, 8, 8, -8]});

      for (let element of elements) {
        board.create(element.elementType, element.parents, element.attributes);
      }
    });
  });
}

function init() {
  initDrawImageButton();
}

init();

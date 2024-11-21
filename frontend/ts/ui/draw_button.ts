import {getById} from "../helpers";
import {fetchElements} from "../fetch";
import {initedBoard} from "./board";

export function initDrawImageButton() {

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

export function initRemoveImageButton() {
    const drawImageButton = document.getElementById('clear_task') as HTMLElement;

    drawImageButton.addEventListener('click', (event) => {
        event.preventDefault();

        const board = initedBoard();

        board.clearTraces();
    });
}
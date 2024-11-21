import {initedBoard} from "./ui/board";
import {initDrawImageButton} from "./ui/draw_button";
import {initCreateTemplateButton} from "./ui/create_template_button";
import {updateTemplateList} from "./ui/template_list";
import {addListenerToSaveTemplateButton} from "./ui/save_template_button";

async function init() {
  await updateTemplateList()
  initedBoard();
  initDrawImageButton();
  initCreateTemplateButton();
  addListenerToSaveTemplateButton();
}

init().then();

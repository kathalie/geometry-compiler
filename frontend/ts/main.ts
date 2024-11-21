import {initedBoard} from "./ui/board";
import {initDrawImageButton} from "./ui/draw_button";
import {initCreateTemplateButton} from "./ui/create_template_button";
import {updateTemplateList} from "./ui/template_list";

async function init() {
  await updateTemplateList()
  initedBoard();
  initDrawImageButton();
  initCreateTemplateButton();
}

init().then();

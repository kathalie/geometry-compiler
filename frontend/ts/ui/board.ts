import JXG from "jsxgraph";

export function initedBoard(): JXG.Board {
    return JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-8, 8, 8, -8]});
}
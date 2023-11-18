"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    //let board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-8, 8, 8, -8]});
    //var p = board.create('point', [1, 3], {name: 'point'});
    //let board: JXG.Board = req.body.board
    //(board: JXG.Board) => board.create('point', [1, 3], {name: 'point'})
    //(board: JXG.Board) => board.create('line',["A","B"], {strokeColor:'#00ff00',strokeWidth:2});
    res.send([
        { elementType: 'point', parents: [-1, 1], attributes: { name: 'A' } },
        { elementType: 'point', parents: [2, -1], attributes: { name: 'B' } },
        { elementType: 'line', parents: ["A", "B"] }
    ]);
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

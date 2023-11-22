import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {LexerIterator} from "./lexer/lexer-iterator.js";
import {lexer} from "./lexer/lexer.js";
import {Parser} from "./syntax_analyzer/parser.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())

app.get('/', (req, res) => {
  let input = "ПОЗНАЧИТИ ТОЧКУ A З КООРДИНАТАМИ (12, 10.9)."
      // +
      // "ПРОВЕСТИ   ПРЯМУ   ЧЕРЕЗ  ДВІ ТОЧКИ A, B.\n" +
      // "\n" +
      // "ПОБУДУВАТИ  ПЕРПЕНДИКУЛЯР  ДО ПРЯМОЇ   (AB)  В ТОЧЦІ C."

  const lexerIterator = new LexerIterator(input, false);

  // while(lexerIterator.hasNext()) {
  //   console.log(lexerIterator.next()?.toString());
  // }

  const tokens = lexer.tokenize(input).tokens
  console.log(tokens)

  const parser = new Parser(lexerIterator);
  const parsedTask = parser.parseTask();

  console.log(parsedTask.toString());

  res.send([
    {elementType: 'point', parents: [-10, 1], attributes: {name: 'C'}},
    {elementType: 'point', parents: [2, -1], attributes: {name: 'B'}},
    {elementType: 'line', parents: ["C", "B"]}
  ]);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
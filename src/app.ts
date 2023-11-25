import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {LexerIterator} from "./lexer/lexer-iterator.js";
import {Parser} from "./syntax_analyzer/parser.js";
import {Translator} from "./semantic_analyzer/translator.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  const input = req.query.task as string;

  const lexerIterator = new LexerIterator(input, false);

  // while(lexerIterator.hasNext()) {
  //   console.log(lexerIterator.next()?.toString());
  // }

  //const tokens = lexer.tokenize(input).tokens
  //console.log(tokens)

  const parser = new Parser(lexerIterator);
  const parsedTask = parser.parseTask();
  const identifiersTable = parser.identifiersTable;

  console.log(parsedTask.toString());

  const translator = new Translator(parsedTask, identifiersTable);

  res.send(translator.translate());
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
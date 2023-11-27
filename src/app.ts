import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {LexerIterator} from "./lexer/lexer-iterator.js";
import {SyntaxError, Parser} from "./syntax_analyzer/parser.js";
import {SemanticError, Translator} from "./semantic_analyzer/translator.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  const input = req.query.task as string;

  const lexerIterator = new LexerIterator(input, false);

///
  lexerIterator.takeSnapshot();
  while(lexerIterator.hasNext()) {
    console.log(lexerIterator.next()?.toString());
  }
  lexerIterator.backToLastSnapshot();
///

  try {

    const parser = new Parser(lexerIterator);
    const parsedTask = parser.parseTask();
    const identifiersTable = parser.identifiersTable;
///
    console.log(JSON.stringify(parsedTask.tree(), null, 2));
///
    const translator = new Translator(parsedTask, identifiersTable);

    const translation = translator.translate();
///
    console.log(translation)
///
    res.status(200).send(translation);
  } catch (e) {
    if (e instanceof SyntaxError)
      res.status(500).send(`Виявлено синтаксичну помилку: ${e.message}`);
    else if (e instanceof SemanticError)
      res.status(500).send(`Виявлено семантичну помилку: ${e.message}`);
    else
      res.status(500).send(`На сервері сталась невідома помилка :(`);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
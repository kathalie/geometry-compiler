import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from "body-parser";

import {LexerIterator} from "./lexer/lexer-iterator.js";
import {SyntaxError, Parser} from "./syntax_analyzer/parser.js";
import {SemanticError, Translator} from "./semantic_analyzer/translator.js";
import templateRoutes from "./router.js";
import { sequelize } from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(templateRoutes);

app.get('/', (req, res) => {
  const input = req.query.task as string;

  const lexerIterator = new LexerIterator(input, false);

  try {

    const parser = new Parser(lexerIterator);
    const parsedTask = parser.parseTask();
    const identifiersTable = parser.identifiersTable;

    console.log(JSON.stringify(parsedTask.tree(), null, 2));

    const translator = new Translator(parsedTask, identifiersTable);

    const translation = translator.translate();

    console.log(translation)

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

// Sync database before starting the server
sequelize.sync().then(() => {
  // Start the server after syncing the database
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
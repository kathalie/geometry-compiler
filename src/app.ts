import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())

app.get('/', (req, res) => {
  res.send([
    {elementType: 'point', parents: [-1, 1], attributes: {name: 'A'}},
    {elementType: 'point', parents: [2, -1], attributes: {name: 'B'}},
    {elementType: 'line', parents: ["A", "B"]}
  ]);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
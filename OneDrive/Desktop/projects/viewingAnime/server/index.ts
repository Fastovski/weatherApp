import express, { Request, Response } from 'express';
import { main } from './parser';

const app = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
  try {
    const links = await main();
    console.log('Extracted links:', links);
    // res.send(`Links: ${links.join(', ')}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error parsing the page');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
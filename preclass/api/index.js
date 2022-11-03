import bodyParser from 'body-parser'
import express from 'express';
import rateLimit from 'express-rate-limit'
import { createWriteStream } from 'node:fs'

const output = createWriteStream('./output.ndjson')
const limiter = rateLimit({
	windowMs: 1000, // 1 seg
	max: 10, // Limit each IP to 10 requests per `window` (here, per 1 sec)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app = express();
const PORT = 3000

app.use(bodyParser.json())
app.use(limiter)

app.post('/', async (req, res) => {
  console.log('received!!', req.body)

  output.write(JSON.stringify(req.body) + "\n")

  return res.send('Received a POST HTTP method');
});

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);
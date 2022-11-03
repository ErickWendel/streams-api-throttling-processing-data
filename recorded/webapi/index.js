/** 
 curl -i \
 -X POST \
 --data '{"name":"erick", "age": 27}' \
 -H 'content-type: application/json' \
 localhost:3000
 * 
*/

import bodyParser from 'body-parser'
import express from 'express'

import { createWriteStream } from 'node:fs'
const output = createWriteStream('output.ndjson')

import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 1000, // 1 sec
	max: 100, // Limit each IP to 10 requests per `window` (here, per second)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app = express()
app.use(bodyParser.json())
app.use(limiter)

const PORT = 3000

app.post('/', async (req, res) => {
  console.log('received!!', req.body)
  output.write(JSON.stringify(req.body) + "\n")

  return res.send('ok!!')
})

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`)
})

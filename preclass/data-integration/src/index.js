/* 
echo "id,name,desc,age" > big.csv
for i in `seq 1 5`; do node -e "process.stdout.write('$i,erick-$i,$i-text,$i\n'.repeat(1e5))" >> big.csv; done # 500K items
*/

import {
  createReadStream
} from 'node:fs'
import {
  pipeline
} from 'node:stream/promises'
import csvtojson from 'csvtojson'
import {
  Transform
} from 'node:stream'
import {
  randomUUID
} from 'node:crypto'

import ThrottleRequest from './throttle.js'
import {
  log,
  makeRequest
} from './util.js'

const throttle = new ThrottleRequest({
  objectMode: true,
  reqsPerSec: 10
})

const dataProcessor = Transform({
  objectMode: true,
  transform(chunk, enc, cb) {
    const now = performance.now()
    const jsonData = chunk.toString().replace(/\d/g, now)

    const data = JSON.parse(jsonData)
    data.id = randomUUID()

    return cb(null, JSON.stringify(data))
  }
})

await pipeline(
  createReadStream('./big.csv'),
  csvtojson(),
  dataProcessor,
  throttle,
  async function* (source) {
    let counter = 0
    for await (const data of source) {
      log(`processed ${++counter} items... - ${new Date().toISOString()}`)
      // console.log(`processed ${++counter} items... - ${new Date().toISOString()}`)

      const status = await makeRequest(data)
      if (status !== 200) {
        throw new Error(`oopps! reached rate limite, stupid - status ${status}`)
      }
    }
  }
)
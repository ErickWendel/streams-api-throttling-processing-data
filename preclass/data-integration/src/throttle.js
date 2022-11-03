import {
  Transform
} from 'node:stream'
const ONE_SECOND = 1000;
export default class ThrottleRequest extends Transform {
  internalCounter = 0
  constructor({
    reqsPerSec = 100,
    objectMode,
  }) {
    super({
      objectMode
    })

    this.reqsPerSec = reqsPerSec
    this.internalCounter = 0
  }

  _transform(chunk, enc, callback) {
    this.internalCounter++

    if (!(this.internalCounter >= this.reqsPerSec)) {
      this.push(chunk)
      return callback()
    }
    // console.count('timeout!')
    setTimeout(() => {
      this.internalCounter = 0;
      this.push(chunk)
      callback()
    }, ONE_SECOND);

  }
}

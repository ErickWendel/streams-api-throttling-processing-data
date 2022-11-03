import { Transform } from 'node:stream'
const ONE_SECOND = 1000
export default class ThrottleRequest extends Transform {
  #requestsPerSecond = 0
  #internalCounter = 0

  constructor({
    objectMode,
    requestsPerSecond
  }) {
    super({
      objectMode
    })
    
    this.#requestsPerSecond = requestsPerSecond
  }
  _transform(chunk, enc, callback) {
    this.#internalCounter ++
    if(! (this.#internalCounter >= this.#requestsPerSecond) ) {
      // this.push(chunk)
      return callback(null, chunk)
    }
    
    // console.count('timeout')
    setTimeout(() => {
      this.#internalCounter = 0
      // this.push(chunk)
      return callback(null, chunk)
    }, ONE_SECOND);
  
  }
}
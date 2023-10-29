import Harmor from './harmor';
import { HARmorRule } from '../types';


export default class HarmorBuilder {

  private rules: HARmorRule[] = []

  constructor() {
  }


  jwt() {
    this.rules.push({
      selector: /eyJ[a-zA-Z0-9-_]+\.eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\b/g,
      action: 'replace',
      replacement: (value) => {
        return value
        // const alg = encrypt(value.split('.')[0], 'davidantoon')
        // const payload = value.split('.')[1];
        // const signature = encrypt(value.split('.')[2], 'davidantoon')
        // return `${alg}.${payload}.${signature}`
      },
    })
    return this
  }

  allCookies() {
    this.rules.push({
      selector: /Set-Cookie: .*/g,
      action: 'remove',
    })
    return this
  }

  allHeaders() {
    this._allHeaders = true
    return this
  }

  cookie(cookie: string) {
    this._cookies.push(cookie)
    return this
  }

  header(header: string) {
    this._cookies.push(cookie)
    return this
  }

  scrub(content: string) {
    this._cookies.push(cookie)
    return this
  }

  build() {
    return new Harmor({
      input, rules
    })
  }

}

import Harmor from './harmor';
import { HARmorRule } from '../types';
import { EncryptionOptions } from '../crypto';
import { Header } from 'har-format';


export default class HarmorBuilder {

  private rules: HARmorRule[] = []
  private encryptionOptions: EncryptionOptions = { enabled: false }


  jwt() {
    this.rules.push({
      type: 'regex',
      selector: /(eyJ[a-zA-Z0-9-_]+)\.(eyJ[a-zA-Z0-9-_]+)\.([a-zA-Z0-9-_]+\b)/g,
      replacement: (value, { shouldEncrypt, encrypt }) => {
        if (shouldEncrypt) {
          const alg = encrypt(value[0])
          const signature = encrypt(value[2])
          return `${alg}.${value[1]}.${signature}`
        }
        return `_harmored_.${value[1]}._harmored_`
      },
    })
    return this
  }

  allCookies() {
    this.rules.push({
      type: 'path',
      selector: {
        'request.cookies': [],
        'response.cookies': [],
        'response.headers': (value) => {
          return value.filter(h =>
            h.name.toLowerCase() !== 'set-cookie' &&
            h.name.toLowerCase() !== 'cookie')
        },
      }
    })
    return this
  }

  allHeaders() {
    this.rules.push({
      type: 'path',
      selector: {
        'request.headers': () => [],
        'response.headers': () => []
      },

    })
    return this
  }

  cookie(cookie: string) {
    this.rules.push({
      type: 'path',
      selector: {
        'request.cookies': (value, harmor) => {
          return value.map(c => {
            if (c.name.toLowerCase() !== cookie.toLowerCase()) {
              return c
            }
            if (harmor.shouldEncrypt) {
              c.value = harmor.encrypt(c.value)
            } else {
              c.value = '_harmored_'
            }
            return c
          })
        }
      }
    })

    this.rules.push({
      type: 'regex',
      selector: new RegExp(`(${cookie}[^=]+=)([^;"]+)`, 'g'),
      replacement: (value, { shouldEncrypt, encrypt }) => {
        if (shouldEncrypt) {
          return value[0] + encrypt(value[1]);
        }
        return value[0] + '_harmored_'
      }
    })
    return this
  }

  encryption(password?: string) {
    this.encryptionOptions = {
      enabled: true,
      password: password ? `${password}` : undefined
    }
    return this
  }

  header(header: string) {
    const armorFn = (value: Header[], harmor: Harmor) => {
      return value.map(h => {
        if (h.name.toLowerCase() !== header.toLowerCase()) {
          return h
        }
        if (harmor.shouldEncrypt) {
          h.value = harmor.encrypt(h.value)
        } else {
          h.value = '_harmored_'
        }
        return h
      })
    }
    this.rules.push({
      type: 'path',
      selector: {
        'request.headers': armorFn,
        'response.headers': armorFn
      },
    })
    return this
  }

  scrub(str: string) {
    this.rules.push({
        type: 'regex',
        selector: new RegExp(`[\\s";,&?]+${str}=([\\w+-_/=#|.%&:!*()\`~'"]+)([&\\\\",\\s"}};])`, 'g')
      }, {
        type: 'regex',
        selector: new RegExp(`"name": "${str}",[\\s\\w+:"-\\%!*()\`~'.,#]*?"value": "([\\w+-_:&\\+=#~/$()\\.\\,\\*\\!|%"'\\s;{}]+?)"\\s+,`, 'g')
      },
      {
        type: 'regex',
        selector: new RegExp(`("value": ")([\\w+-_:&+=#$~/()\\\\.\\,*!|%"\\s;]+)("[,\\s}}]+)([\\s\\w+:"-\\\\%!*\`()~'#.]*"name": "${str}")`, 'g')
      })
    return this
  }


  build() {
    return new Harmor({
      rules: this.rules,
      encryption: this.encryptionOptions
    })
  }

}

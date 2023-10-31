import Harmor from './harmor';
import { HARmorRule } from '../types';
import { EncryptionOptions } from '../crypto';
import { Content, Cookie, Entry, Header, PostData, QueryString, Request } from 'har-format';
import * as setValue from 'set-value';

export default class HarmorBuilder {

  private rules: HARmorRule[] = []
  private encryptionOptions: EncryptionOptions = { enabled: false }


  encryption(password?: string) {
    this.encryptionOptions = {
      enabled: true,
      password: password ? `${password}` : undefined
    }
    return this
  }


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

  authorization() {
    this.header('authorization')
    return this
  }

  allCookies() {

    const headerArmorFn = (value: Header[], { shouldEncrypt, encrypt }: Harmor) => {
      if (shouldEncrypt) {
        return value.map(h => {
          if (h.name.toLowerCase() !== 'set-cookie' ||
            h.name.toLowerCase() !== 'cookie') {
            return h
          }
          h.value = shouldEncrypt ? encrypt(h.value) : '_harmored_'
          return h
        })
      }
    }

    const cookieArmorFn = (value: Cookie[], { shouldEncrypt, encrypt }: Harmor) => {
      if (shouldEncrypt) {
        return value.map(c => {
          c.value = encrypt(c.value)
          return c
        })
      } else {
        return value.map(c => {
          c.value = '_harmored_'
          return c
        })
      }
    }

    this.rules.push({
      type: 'path',
      selector: {
        'request.cookies': cookieArmorFn,
        'response.cookies': cookieArmorFn,
        'response.headers': headerArmorFn,
        'request.headers': headerArmorFn,
      }
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
      selector: new RegExp(`(${cookie}[^="]+=)([^;"=]+)`, 'g'),
      replacement: (value, { shouldEncrypt, encrypt }) => {
        if (shouldEncrypt) {
          return value[0] + encrypt(value[1]);
        }
        return value[0] + '_harmored_'
      }
    })
    return this
  }


  allHeaders() {

    const headerArmorFn = (value: Header[], { shouldEncrypt, encrypt }: Harmor) => {
      if (shouldEncrypt) {
        return value.map(h => {
          h.value = shouldEncrypt ? encrypt(h.value) : '_harmored_'
          return h
        })
      }
    }

    this.rules.push({
      type: 'path',
      selector: {
        'request.headers': headerArmorFn,
        'response.headers': headerArmorFn
      },
    })
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

  allQueryParams() {
    const armorFn = (value: QueryString[], { shouldEncrypt, encrypt }: Harmor) => {
      if (shouldEncrypt) {
        return value.map(h => {
          h.value = shouldEncrypt ? encrypt(h.value) : '_harmored_'
          return h
        })
      }
    }

    this.rules.push({
      type: 'path',
      selector: {
        'request.queryString': armorFn,
      },
    })
    return this
  }

  queryParam(params: string[]) {
    const armorFn = (value: QueryString[], harmor: Harmor) => {
      return value.map(h => {
        if (params.indexOf(h.name.toLowerCase()) === -1) {
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
        'request.queryString': armorFn,
      },
    })
    return this
  }


  private applicationJsonReplacer = (input: string, restrictedKeys: string[], harmor: Harmor): any => {

    try {
      const json = JSON.parse(input)

      const replacer = (key: string, value: any) => {
        if (restrictedKeys.includes(key)) {
          if (harmor.shouldEncrypt) {
            return harmor.encrypt(value)
          } else {
            return '_harmored_'
          }
        }
        return value
      }
      return JSON.stringify(json, replacer)
    } catch (e) {
      return input
    }
  }

  contentKey(restrictedKeys: string[]) {
    const contentArmorFn = (value: Content, harmor: Harmor) => {
      if (value && value.text && value.mimeType === 'application/json') {
        value.text = this.applicationJsonReplacer(value.text, restrictedKeys, harmor)
      }
      return value
    }
    const postDataArmorFn = (value: PostData, harmor: Harmor) => {
      if (value && value.text && value.mimeType === 'application/json') {
        value.text = this.applicationJsonReplacer(value.text, restrictedKeys, harmor)
      }
      return value
    }

    this.rules.push({
      type: 'path',
      selector: {
        'request.postData': postDataArmorFn,
        'response.content': contentArmorFn
      },
    })
  }


  byUrlPath(urlPathPrefix: string[]) {
    this.rules.push({
      type: 'path',
      selector: {
        '*': (value: Entry) => {
          const { pathname } = new URL(value?.request?.url)
          if (urlPathPrefix.find(urlPath => pathname.startsWith(urlPath))) {
            setValue(value, 'request.cookies', [ { name: '_harmored_', value: '_harmored_' } ], { merge: false })
            setValue(value, 'request.headers', [ { name: '_harmored_', value: '_harmored_' } ], { merge: false })
            setValue(value, 'request.queryString', [ { name: '_harmored_', value: '_harmored_' } ], { merge: false })
            setValue(value, 'request.content.text', '_harmored_', { merge: false })

            setValue(value, 'response.cookies', [ { name: '_harmored_', value: '_harmored_' } ], { merge: false })
            setValue(value, 'response.headers', [ { name: '_harmored_', value: '_harmored_' } ], { merge: false })
            setValue(value, 'response.queryString', [ { name: '_harmored_', value: '_harmored_' } ], { merge: false })
            setValue(value, 'response.content.text', '_harmored_', { merge: false })
          }
          return value
        }
      },
    })
  }

  build() {
    return new Harmor({
      rules: this.rules,
      encryption: this.encryptionOptions
    })
  }

}

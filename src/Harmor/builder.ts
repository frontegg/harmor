import Harmor from './harmor';
import { HARmorRule } from '../types';
import { EncryptionOptions } from '../crypto';
import { Content, Cookie, Entry, Header, PostData, QueryString } from 'har-format';
import * as setValue from 'set-value';
import { QuestionerResult } from '../questioner/types';

export default class HarmorBuilder {

  private rules: HARmorRule[] = []
  private encryptionOptions: EncryptionOptions = { enabled: false }

  /**
   * Enable encryption for all sanitized values.
   * @param password
   */
  encryption(password?: string) {
    this.encryptionOptions = {
      enabled: true,
      password: password ? `${password}` : undefined
    }
    return this
  }

  /**
   * Sanitize all JWT in the HAR file by encrypting algorithm and signature
   * parts or replacing them with `_harmored_` if encryption is disabled.
   */
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

  /**
   * Sanitize all cookies in the HAR file by encrypting them
   * or replacing them with `_harmored_` if encryption is disabled.
   */
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

  /**
   * Sanitize a specific cookie in the HAR file by encrypting its value.
   * @param cookie - The name / prefix of the cookie to sanitize.
   */
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

  /**
   * Sanitize all headers in the HAR file by encrypting them
   * or replacing them with `_harmored_` if encryption is disabled.
   */
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

  /**
   * Sanitize a specific header in the HAR file by encrypting its value.
   * @param header - The name / prefix of the header to sanitize.
   */
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

  /**
   * Sanitize all query parameters in the HAR file by encrypting them
   * or replacing them with `_harmored_` if encryption is disabled.
   */
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

  /**
   * Sanitize a specific query parameter in the HAR file by encrypting its value.
   * @param params - The name / prefix of the query parameter to sanitize.
   */
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

  /**
   * Sanitize a specific request / response json body keys.
   * @param restrictedKeys - The name of the json key to sanitize its value.
   */
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

  /**
   * Sanitize all request / response (headers, cookies, queryParams, body) based on provided url path prefix.
   * @param urlPathPrefix - The url path prefix to sanitize.
   */
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

  /**
   * Build the HARmor instance, which can be used to sanitize HAR files.
   */
  build() {
    return new Harmor({
      rules: this.rules,
      encryption: this.encryptionOptions
    })
  }



  fromTemplate = (result: QuestionerResult) => {
    if (result.encryption.enabled) {
      this.encryption(result.encryption.password)
    }

    if (result.allCookies) {
      this.allCookies()
    }
    if (result.cookies.length > 0) {
      result.cookies.forEach(cookie => this.cookie(cookie))
    }

    if (result.allHeaders) {
      this.allHeaders()
    }

    if (result.headers.length > 0) {
      result.headers.forEach(header => this.header(header))
    }

    if (result.allQueryParams) {
      this.allQueryParams()
    }

    if (result.queryParams.length > 0) {
      this.queryParam(result.queryParams)
    }

    if (result.jwt) {
      this.jwt()
    }

    if (result.contentKeys && result.contentKeys.length > 0) {
      this.contentKey(result.contentKeys)
    }

    if (result.urlPathPrefixes && result.urlPathPrefixes.length > 0) {
      this.byUrlPath(result.urlPathPrefixes)
    }

    return this;
  }


}

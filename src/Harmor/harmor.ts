import { HARmorOptions, HARmorRule } from '../types';
import HarmorBuilder from './builder';
import Crypto, { EncryptionOptions } from '../crypto';
import * as getValue from 'get-value'
import * as setValue from 'set-value'


export default class Harmor {
  rules: HARmorRule[];
  encryption: EncryptionOptions;

  private encrypted: [ string, string ][] = []

  static Builder() {
    return new HarmorBuilder()
  }

  constructor(options: HARmorOptions) {
    this.rules = options.rules;
    this.encryption = options.encryption;

    if (this.encryption.enabled && !this.encryption.password) {
      this.encryption.password = Crypto.generateRandomPassword()
    }
  }


  get shouldEncrypt() {
    return this.encryption.enabled
  }

  encrypt = (input: string) => {
    const key = Crypto.generateEntityName()
    this.encrypted.push([ key, input ]);
    return key
  }

  sanitize = (input: string): string => {
    let content = input;
    const [ pathRules, regexRules ] = this.rules.reduce((acc, rule) => {
      if (rule.type === 'path') {
        acc[0].push(rule)
      } else {
        acc[1].push(rule)
      }
      return acc
    }, [ [], [] ])

    const jsonContent = JSON.parse(content);
    for (const rule of pathRules) {
      Object.keys(rule.selector).forEach((path) => {
        rule.selector[path] = rule.selector[path] || (() => null)

        const value = getValue(jsonContent, path)
        const replacement = rule.selector[path]
        const newValue = replacement(value, this)
        setValue(jsonContent, path, newValue)
      });
    }

    for (const rule of regexRules) {
      if (typeof rule.replacement === 'string') {
        content = content.replace(rule.selector, rule.replacement);
      } else {
        const replacement = rule.replacement;
        content = content.replace(rule.selector, (substring) => {
          const items = substring.split(rule.selector).slice(1, -1)
          return replacement(items, this)
        });
      }
    }


    if (this.shouldEncrypt) {
      const jsonContent = JSON.parse(content)
      jsonContent.harmor = Crypto.encrypt(JSON.stringify(this.encrypted), this.encryption.password)
      content = JSON.stringify(jsonContent, null, 2)
    }
    return content
  }
}

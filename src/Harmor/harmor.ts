import { HARmorOptions, HARmorRule } from '../types';
import HarmorBuilder from './builder';
import Crypto, { EncryptionOptions } from '../crypto';
import * as getValue from 'get-value'
import * as setValue from 'set-value'
import { Entry } from 'har-format';
import { QuestionerResult } from '../questioner/types';

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


    const jsonContent = JSON.parse(content);
    const entries = jsonContent.log.entries;
    jsonContent.log.entries = entries.map((entry: Entry) => {
      for (const rule of pathRules) {
        const selectors = Object.keys(rule.selector);
        for (const path of selectors) {
          if (path === '*') {
            const value = entry
            const replacement = rule.selector[path]
            return replacement(value, this)
          } else if (typeof rule.selector[path] === 'function') {
            const value = getValue(entry, path)
            const replacement = rule.selector[path]
            const newValue = replacement(value, this)
            setValue(entry, path, newValue)
          } else {
            setValue(entry, path, rule.selector[path])
          }
        }
      }
      return entry
    });


    if (this.shouldEncrypt) {
      jsonContent.harmor = Crypto.encrypt(JSON.stringify(this.encrypted), this.encryption.password)
    }

    return JSON.stringify(jsonContent, null, 2)
  }

}

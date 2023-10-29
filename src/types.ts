import { EncryptionOptions } from './crypto';

export interface HARmorOptions {
  /**
   * The HAR file content
   */
  input: string;

  /**
   * The rules to apply to the HAR file.
   */
  rules: HARmorRule[];


  encryption?: EncryptionOptions;
}


export interface HARmorJWTRule {
  type: 'jwt',
  /**
   * whether to replace the token or just remove it.
   *
   * @default replace
   */
  action?: 'replace' | 'remove',
  /**
   * whether to replace the whole token or just the signature.
   *
   *  @default partial
   */
  selector?: 'full' | 'partial'
}


export interface HARmorReplaceRule {
  action: 'replace',
  selector: RegExp | string;
  replacement: string | ((value: string) => string);
}

export interface HARmorRemoveRule {
  action: 'remove',
  selector: RegExp | string;
}

export type HARmorRegexRule = HARmorReplaceRule | HARmorRemoveRule;


export interface HARmorPathRule {
  action: 'replace' | 'remove'
  selector: string; // request.url.pathname
  value: any | ((value: any) => boolean);
  replacement: string | ((value: string) => string);
}

export type HARmorRule = HARmorRegexRule | HARmorPathRule;

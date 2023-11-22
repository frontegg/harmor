import { EncryptionOptions } from './crypto';
import { Entry, Request, Response, Timings } from 'har-format';
import Harmor from './Harmor';

export interface HARmorOptions {

  /**
   * The rules to apply to the HAR file.
   */
  rules: HARmorRule[];

  /**
   * Encryption options
   * @default { enabled: true, password: generateRandomPassword() }
   */
  encryption?: EncryptionOptions;
}

export type HARmorRegexRule = {
  type: 'regex';
  selector: RegExp;
  replacement?: string | ((value: string[], harmor: Harmor) => string);
}

type RecursivePartial<T> = {
  [P in keyof T]?:
  (T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P]) |
  ((value: (T[P] extends (infer U)[] ? RecursivePartial<U> : T[P] extends object ? RecursivePartial<T[P]> : T[P])) => boolean) | '*';
};


type Replacer<T> = T | ((value: T, harmor: Harmor) => string | number | null | undefined | unknown | never);

type PathSelectors = Partial<{
  [K in keyof Response as `response.${K}`]: Replacer<Response[K]>
} & {
  [K in keyof Request as `request.${K}`]: Replacer<Request[K]>
} & {
  [K in keyof Timings as `timings.${K}`]: Replacer<Timings[K]>
} & {
  [K in keyof Entry as `${K}`]: Replacer<Entry[K]>
} & {
  "*": Replacer<Entry>
}>


export type HARmorPathRule = {
  type: 'path';
  selector: PathSelectors;
}

export type HARmorRule = HARmorRegexRule | HARmorPathRule;


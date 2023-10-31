import { EncryptionOptions } from '../crypto';

export type QuestionerResult = {
  encryption: EncryptionOptions;

  allCookies: boolean;
  cookies: string[];
  allHeaders: boolean;
  headers: string[];
  allQueryParams: boolean;
  queryParams: string[];

  jwt: boolean;
  contentKeys: string[]
  urlPathPrefixes: string[];
}

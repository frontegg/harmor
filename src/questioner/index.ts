import { printLogo } from '../logo';
import cookiesQuestioner from './cookies';
import headersQuestioner from './headers';
import { Har } from 'har-format';
import queryParamsQuestioner from './queryParams';
import generalQuestioner from './general';
import { EncryptionOptions } from '../crypto';


type QuestionerResult = {
  encryption?: EncryptionOptions;

  allCookies: boolean;
  cookies: string[];
  allHeaders: boolean;
  headers: string[];
  allQueryParams: boolean;
  queryParams: string[];

  jwt?: boolean;
  authorization?: boolean;
  contentKey?: string;
  urlPathPrefix?: string;
  pass?: string;

}


const questioner = async (harFile: Har): Promise<QuestionerResult> => {
  printLogo()

  return {
    ...(await generalQuestioner()),
    ...(await cookiesQuestioner(harFile)),
    ...(await headersQuestioner(harFile)),
    ...(await queryParamsQuestioner(harFile)),
  }
}


export default questioner;

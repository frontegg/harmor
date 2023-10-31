import { printLogo } from '../logo';
import cookiesQuestioner from './cookies';
import headersQuestioner from './headers';
import { Har } from 'har-format';
import queryParamsQuestioner from './queryParams';
import generalQuestioner from './general';
import { QuestionerResult } from './types';
import defaultsQuestioner from './defaults';
import contentKeysQuestioner from './contentKeys';
import urlPathsQuestioner from './urlPathPrefix';


const questioner = async (harFile: Har): Promise<QuestionerResult> => {
  printLogo()

  const result = {
    ...(await generalQuestioner()),
    ...(await cookiesQuestioner(harFile)),
    ...(await headersQuestioner(harFile)),
    ...(await queryParamsQuestioner(harFile)),
    ...(await urlPathsQuestioner(harFile)),
    ...(await contentKeysQuestioner()),
  }

  return await defaultsQuestioner(result)
}


export default questioner;

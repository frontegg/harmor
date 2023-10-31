import * as prompts from 'prompts';
import { QuestionerResult } from './types';
import {
  commonJsonRestrictedKeys,
  commonQueryParams,
  commonSensitiveCookies,
  commonSensitiveHeaders, promptOptions
} from './constants';


const defaultsQuestioner = async (result: QuestionerResult): Promise<QuestionerResult> => {
  console.log('');

  if (!result.allCookies) {
    const cookiesToAdd = await prompts({
      type: 'multiselect',
      name: 'cookie',
      message: 'Do you want to add default security "Cookies" ?',
      choices: commonSensitiveCookies
        .filter(cookie => result.cookies.indexOf(cookie) === -1)
        .map((title) => ({ title, selected: true, value: title })),
    }, promptOptions)
    result.cookies = [ ...result.cookies, ...cookiesToAdd.cookie ]
  }

  if (!result.allHeaders) {
    const headersToAdd = await prompts({
      type: 'multiselect',
      name: 'headers',
      message: 'Do you want to add default security "Headers" ?',
      choices: commonSensitiveHeaders
        .filter(cookie => result.headers.indexOf(cookie) === -1)
        .map((title) => ({ title, selected: true, value: title })),
    }, promptOptions)
    result.headers = [ ...result.headers, ...headersToAdd.headers ]
  }

  if (!result.allQueryParams) {
    const queryParamsToAdd = await prompts({
      type: 'multiselect',
      name: 'queryParams',
      message: 'Do you want to add default security "Query Params" ?',
      choices: commonQueryParams
        .filter(queryParam => result.queryParams.indexOf(queryParam) === -1)
        .map((title) => ({ title, selected: true, value: title })),
    }, promptOptions)
    result.queryParams = [ ...result.queryParams, ...queryParamsToAdd.queryParams ]
  }


  const contentKeysChoices = commonJsonRestrictedKeys
    .filter(contentKey => result.contentKeys?.indexOf(contentKey) === -1)
    .map((title) => ({ title, selected: true, value: title }))
  if (contentKeysChoices.length > 0) {
    const contentKeysToAdd = await prompts({
      type: 'multiselect',
      name: 'contentKeys',
      message: 'Do you want to add default security "Content Restricted Keys" ?',
      choices: contentKeysChoices,
    }, promptOptions)
    result.contentKeys = [ ...result.contentKeys, ...contentKeysToAdd.contentKeys ]
  }


  return result
}
export default defaultsQuestioner

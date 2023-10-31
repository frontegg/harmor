import * as prompts from 'prompts';
import { gray } from 'kolorist';
import { Har } from 'har-format';
import { Choice } from 'prompts';
import { createAutocompleteSuggestion, SuggestionKeys } from './helpers';

type QueryParamsQuestionerResult = {
  allQueryParams: boolean;
  queryParams: string[];
}

const extractQueryParams = (harFile: Har): Choice[] => {
  const headers: Set<string> = new Set()
  harFile.log.entries.forEach((entry) => {
    entry.request.queryString.map(({ name }) => headers.add(name))
  })
  return Array.from(headers).map((title) => ({ title }))
}

const queryParamsQuestioner = async (harFile: Har): Promise<QueryParamsQuestionerResult> => {
  console.log('');

  const selected: string[] = [];
  const choices = extractQueryParams(harFile)
  let lastSelected = ''
  while (lastSelected != null) {
    lastSelected = (await prompts({
      type: 'autocomplete',
      name: 'param',
      message: selected.length > 0 ? '' : 'Which query parameter do you want to sanitize?' + gray(' - press enter to submit\n  '),
      instructions: false,
      choices,
      suggest: createAutocompleteSuggestion({
        selected,
        skipLabel: 'Skip query sanitization',
        allLabel: 'All query params'
      })
    })).param
    if (lastSelected === SuggestionKeys.all) {
      return {
        allQueryParams: true,
        queryParams: []
      }
    }
    if (lastSelected === SuggestionKeys.skip) {
      return {
        allQueryParams: false,
        queryParams: []
      }
    }
    if (lastSelected === SuggestionKeys.done) {
      return {
        allQueryParams: false,
        queryParams: selected
      }
    }
    selected.push(lastSelected)
  }

  return {
    allQueryParams: false,
    queryParams: selected
  }

}
export default queryParamsQuestioner

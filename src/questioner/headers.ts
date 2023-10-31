import * as prompts from 'prompts';
import { gray } from 'kolorist';
import { Har } from 'har-format';
import { Choice } from 'prompts';
import { createAutocompleteSuggestion, SuggestionKeys } from './helpers';
import { promptOptions } from './constants';

type HeaderQuestionerResult = {
  allHeaders: boolean;
  headers: string[];
}

const extractHeaders = (harFile: Har): Choice[] => {
  const headers: Set<string> = new Set()
  harFile.log.entries.forEach((entry) => {
    entry.request.headers.map(({ name }) => headers.add(name))
    entry.response.headers.map(({ name }) => headers.add(name))
  })
  return Array.from(headers).map((title) => ({ title }))
}

const headersQuestioner = async (harFile: Har): Promise<HeaderQuestionerResult> => {
  console.log('');

  const selected: string[] = [];
  const choices = extractHeaders(harFile)
  let lastSelected = ''
  while (lastSelected != null) {
    lastSelected = (await prompts({
      type: 'autocomplete',
      name: 'header',
      message: selected.length > 0 ? '' : 'Which headers do you want to sanitize?' + gray(' - press enter to submit\n  '),
      instructions: false,
      choices,
      suggest: createAutocompleteSuggestion({
        selected,
        skipLabel: 'Skip headers sanitization',
        allLabel: 'All headers'
      })
    }, promptOptions)).header
    if (lastSelected === SuggestionKeys.all) {
      return {
        allHeaders: true,
        headers: []
      }
    }
    if (lastSelected === SuggestionKeys.skip) {
      return {
        allHeaders: false,
        headers: []
      }
    }
    if (lastSelected === SuggestionKeys.done) {
      return {
        allHeaders: false,
        headers: selected
      }
    }
    selected.push(lastSelected)
  }

  return {
    allHeaders: false,
    headers: selected
  }

}
export default headersQuestioner

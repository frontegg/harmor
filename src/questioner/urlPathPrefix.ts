import * as prompts from 'prompts';
import { gray } from 'kolorist';
import { Har } from 'har-format';
import { Choice } from 'prompts';
import { createAutocompleteSuggestion, SuggestionKeys } from './helpers';

type UrlPathsQuestionerResult = {
  urlPathPrefixes: string[];
}

const extractUrlPaths = (harFile: Har): Choice[] => {
  const paths: Set<string> = new Set()
  harFile.log.entries.forEach((entry) => {
    paths.add(new URL(entry.request.url).pathname)
  })
  return Array.from(paths).map((title) => ({ title }))
}

const urlPathsQuestioner = async (harFile: Har): Promise<UrlPathsQuestionerResult> => {
  console.log('');

  const selected: string[] = [];
  const choices = extractUrlPaths(harFile)
  let lastSelected = ''
  while (lastSelected != null) {
    lastSelected = (await prompts({
      type: 'autocomplete',
      name: 'param',
      message: selected.length > 0 ? '' : 'Which url pathname do you want to full sanitize?' + gray(' - press enter to submit\n  '),
      instructions: false,
      choices,
      suggest: createAutocompleteSuggestion({
        selected,
        skipLabel: 'Skip full sanitization by url'
      })
    })).param
    if (lastSelected === SuggestionKeys.all) {
      return {
        urlPathPrefixes: [],
      }
    }
    if (lastSelected === SuggestionKeys.skip) {
      return {
        urlPathPrefixes: [],
      }
    }
    if (lastSelected === SuggestionKeys.done) {
      return {
        urlPathPrefixes: selected,
      }
    }
    selected.push(lastSelected)
  }

  return {
    urlPathPrefixes: selected,
  }

}
export default urlPathsQuestioner

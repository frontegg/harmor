import * as prompts from 'prompts';
import { gray } from 'kolorist';
import { createAutocompleteSuggestion, SuggestionKeys } from './helpers';
import { commonJsonRestrictedKeys, promptOptions } from './constants';

type ContentKeysQuestionerResult = {
  contentKeys: string[];
}

const contentKeysQuestioner = async (): Promise<ContentKeysQuestionerResult> => {
  console.log('');

  const selected: string[] = [];
  let lastSelected = ''
  while (lastSelected != null) {
    lastSelected = (await prompts({
      type: 'autocomplete',
      name: 'key',
      message: selected.length > 0 ? '' : 'Which body json keys do you want to sanitize?' + gray(' - press enter to submit\n  '),
      instructions: false,
      choices: commonJsonRestrictedKeys.map((title) => ({ title })),
      suggest: createAutocompleteSuggestion({
        selected,
        skipLabel: 'Skip json sanitization',
        allLabel: 'All defaults'
      })
    }, promptOptions)).key
    if (lastSelected === SuggestionKeys.all) {
      return {
        contentKeys: commonJsonRestrictedKeys,
      }
    }
    if (lastSelected === SuggestionKeys.skip) {
      return {
        contentKeys: [],
      }
    }
    if (lastSelected === SuggestionKeys.done) {
      return {
        contentKeys: selected,
      }
    }
    selected.push(lastSelected)
  }

  return {
    contentKeys: selected
  }

}
export default contentKeysQuestioner

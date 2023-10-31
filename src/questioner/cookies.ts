import * as prompts from 'prompts';
import { gray } from 'kolorist';
import { Har } from 'har-format';
import { Choice } from 'prompts';
import { createAutocompleteSuggestion, SuggestionKeys } from './helpers';

type CookieQuestionerResult = {
  allCookies: boolean;
  cookies: string[];
}

const extractCookies = (harFile: Har): Choice[] => {
  const cookies: Set<string> = new Set()
  harFile.log.entries.forEach((entry) => {
    entry.request.cookies.map(({ name }) => cookies.add(name))
    entry.response.cookies.map(({ name }) => cookies.add(name))
  })
  return Array.from(cookies).map((title) => ({ title }))
}


const cookiesQuestioner = async (harFile: Har): Promise<CookieQuestionerResult> => {
  console.log('');

  const selected: string[] = [];
  const choices = extractCookies(harFile)
  let lastSelected = ''
  while (lastSelected != null) {
    lastSelected = (await prompts({
      type: 'autocomplete',
      name: 'cookie',
      message: selected.length > 0 ? '' : 'Which cookies do you want to sanitize?' + gray(' - press enter to submit\n  '),
      instructions: false,
      choices,
      suggest: createAutocompleteSuggestion({
        selected,
        skipLabel: 'Skip cookies sanitization',
        allLabel: 'All cookies'
      })
    })).cookie
    if (lastSelected === SuggestionKeys.all) {
      return {
        allCookies: true,
        cookies: []
      }
    }
    if (lastSelected === SuggestionKeys.skip) {
      return {
        allCookies: false,
        cookies: []
      }
    }
    if (lastSelected === SuggestionKeys.done) {
      return {
        allCookies: false,
        cookies: selected
      }
    }
    selected.push(lastSelected)
  }

  return {
    allCookies: false,
    cookies: selected
  }

}
export default cookiesQuestioner

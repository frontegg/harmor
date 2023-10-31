import { Choice } from 'prompts'
import { green, lightGray, yellow } from 'kolorist';

type Options = {
  selected: string[],
  skipLabel: string;
  allLabel: string;
}

export const SuggestionKeys = {
  skip: '__harmor__skip__',
  all: '__harmor__all__',
  done: '__harmor__done__',
}

export const createAutocompleteSuggestion = ({
  selected, skipLabel, allLabel
}: Options) => async (input: string, _choices: Choice[]): Promise<Choice[]> => {

  const choices = _choices.filter(({ title }) => !selected.includes(title))
  if (input.length === 0) {
    if (selected.length === 0) {
      return [ { title: lightGray(skipLabel), value: '__harmor__skip__' }, { title: yellow(allLabel), value: '__harmor__all__' }, ...choices ]
    } else {
      return [ { title: green('Done'), value: '__harmor__done__' }, ...choices ]
    }
  }
  const filteredChoices = choices.filter(({ title }) => title.startsWith(input));
  if (filteredChoices.length === 0) {
    return input.length > 0 ? [ { title: `${input}*`, value: input } ] : []
  }
  if (filteredChoices[0].title !== input && input.length > 0) {
    filteredChoices.unshift({ title: `${input}*`, value: input })
  }
  return filteredChoices
}

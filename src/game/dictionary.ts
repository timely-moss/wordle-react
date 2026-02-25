import { WORDLE_MERGED_DICTIONARY } from './wordlists/wordle-merged'

const dictionarySet = new Set(WORDLE_MERGED_DICTIONARY)

export function isWordInDictionary(word: string): boolean {
  return dictionarySet.has(word.toUpperCase())
}

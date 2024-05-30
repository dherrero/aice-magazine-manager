import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightQuery',
  standalone: true,
})
export class HighlightQueryPipe implements PipeTransform {
  transform(
    originalText: string,
    searchValues: string,
    caseSensitive = false,
    cssClass = 'highlight'
  ): string {
    if (typeof originalText !== 'string' || !searchValues) {
      return originalText;
    }

    if (caseSensitive) {
      return this._transformWithCaseSensitive(
        originalText,
        searchValues,
        cssClass
      );
    }
    return this._transformWithoutCaseSensitive(
      originalText,
      searchValues,
      cssClass
    );
  }

  /**
   * Transform function when caseSensitive is false
   *
   * @param {string} originalText original text where to search
   * @param {string} searchValues values to search
   * @param {string} cssClass css class, used to modify styles of results of search
   * @returns {string} original text or modified text with search results
   */
  private _transformWithoutCaseSensitive(
    originalText: string,
    searchValues: string,
    cssClass: string
  ): string {
    const foundWords: Map<number, string> = new Map<number, string>();

    const normalizedText = originalText
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    let wordIndex = normalizedText.length - 1;
    const searchNormalized = searchValues
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');

    while (wordIndex > 0) {
      wordIndex = normalizedText.lastIndexOf(searchNormalized, wordIndex - 1);
      const foundWord = originalText.substring(
        wordIndex,
        wordIndex + searchValues.length
      );

      if (wordIndex > -1) {
        foundWords.set(wordIndex, foundWord);
      }
    }

    const reverseFoundWords = new Map<number, string>(
      Array.from(foundWords.entries()).reverse()
    );
    const reverseIterator = reverseFoundWords.entries();
    let currentValue = reverseIterator.next().value;
    let nextValue = reverseIterator.next().value;
    while (nextValue !== undefined) {
      const [currentKey] = currentValue;
      const [nextKey] = nextValue;

      if (currentKey + foundWords.get(currentKey)?.length >= nextKey) {
        foundWords.delete(nextKey);
      }
      currentValue = nextValue;
      nextValue = reverseIterator.next().value;
    }

    let output = originalText;
    foundWords.forEach((foundWord, foundIndex) => {
      output =
        (foundIndex > 0 ? output.substring(0, foundIndex) : '') +
        `<span class="${cssClass}">${foundWord}</span>` +
        output.substring(foundIndex + searchValues.length);
    });

    return output;
  }

  /**
   * Transform function when caseSensitive is true
   *
   * @param {string} originalText original text where to search
   * @param {string} searchValues values to search
   * @param {string} cssClass css class, used to modify styles of results of search
   * @returns {string} original text or modified text with search results
   */
  private _transformWithCaseSensitive(
    originalText: string,
    searchValues: string,
    cssClass: string
  ): string {
    const regex = new RegExp(searchValues, 'g');
    return originalText.replace(
      regex,
      (match) => `<span class="${cssClass}">${match}</span>`
    );
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlightQuery',
  standalone: true,
})
export class HighlightQueryPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(
    originalText: string,
    searchValues: string,
    cssClass = 'highlight'
  ): SafeHtml {
    if (typeof originalText !== 'string' || !searchValues) {
      return originalText;
    }
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

    return this.sanitizer.bypassSecurityTrustHtml(output);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightQuery',
  standalone: true,
})
export class HighlightQueryPipe implements PipeTransform {
  transform(content: string, query: string): string {
    const words = content.split(' ').flat();
    const lowerWords = content.toLowerCase().split(' ').flat();
    const queryIndex = lowerWords.indexOf(query.toLowerCase());

    const regex = new RegExp(query, 'gmi');
    const match = content.match(regex);

    if (!match) {
      return content;
    }

    if (queryIndex === -1) {
      // Si la consulta no se encuentra en el contenido, simplemente devuelve el contenido truncado
      return (
        words
          .slice(0, 50)
          .join(' ')
          .replace(regex, `<span class='highlight'>${match[0]}</span>`) +
        (words.length > 50 ? '...' : '')
      );
    } else {
      // Si la consulta se encuentra en el contenido, devuelve una porción del contenido centrada en la consulta
      const start = Math.max(0, queryIndex - 25);
      const end = Math.min(words.length, queryIndex + 25);
      return (
        (start > 0 ? '...' : '') +
        words
          .slice(start, end)
          .join(' ')
          .replace(regex, `<span class='highlight'>${match[0]}</span>`) +
        (end < words.length ? '...' : '')
      );
    }
  }
}

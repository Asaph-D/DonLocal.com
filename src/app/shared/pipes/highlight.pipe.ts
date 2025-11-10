// ========================
// HIGHLIGHT PIPE - shared/pipes/highlight.pipe.ts
// ========================

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, search: string): SafeHtml {
    if (!search || !value) {
      return value;
    }

    const regex = new RegExp(search, 'gi');
    const highlighted = value.replace(
      regex,
      (match) => `<mark class="bg-emerald-500/30 text-white">${match}</mark>`
    );

    return this.sanitizer.sanitize(1, highlighted) || value;
  }
}
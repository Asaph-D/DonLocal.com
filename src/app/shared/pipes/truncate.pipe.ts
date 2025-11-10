// ========================
// TRUNCATE PIPE - shared/pipes/truncate.pipe.ts
// ========================

import { Pipe, PipeTransform } from '@angular/core';
import { FilterPipe } from './filter.pipe';
import { HighlightPipe } from './highlight.pipe';
import { PhoneFormatPipe } from './phone-format.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, trail: string = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit).trim() + trail;
  }
}


// ========================
// EXPORT ALL PIPES
// ========================

export const SHARED_PIPES = [
  TruncatePipe,
  FilterPipe,
  TimeAgoPipe,
  SafeHtmlPipe,
  PhoneFormatPipe,
  HighlightPipe
];
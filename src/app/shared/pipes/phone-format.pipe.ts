// ========================
// PHONE FORMAT PIPE - shared/pipes/phone-format.pipe.ts
// ========================

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');

    // Format Cameroon phone numbers (+237 6XX XX XX XX)
    if (cleaned.startsWith('237')) {
      const number = cleaned.substring(3);
      if (number.length === 9) {
        return `+237 ${number.substring(0, 3)} ${number.substring(3, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
      }
    }

    // Format local numbers (6XX XX XX XX)
    if (cleaned.length === 9 && cleaned.startsWith('6')) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7)}`;
    }

    return value;
  }
}
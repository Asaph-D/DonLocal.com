// ========================
// FILTER PIPE - shared/pipes/filter.pipe.ts
// ========================

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], searchText: string, properties: string[]): T[] {
    if (!items || !searchText || !properties || properties.length === 0) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return properties.some(property => {
        const value = this.getNestedProperty(item, property);
        return value && value.toString().toLowerCase().includes(searchText);
      });
    });
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}

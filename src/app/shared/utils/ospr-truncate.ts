import { Pipe, PipeTransform } from '@angular/core';
import { hasValue } from '../empty.util';

/**
 * Pipe to truncate a value in Angular. (Take a substring, starting at 0)
 * Default value: 10
 */
@Pipe({
  name: 'OSPRTruncate'
})
export class OSPRTruncatePipe implements PipeTransform {

  /**
   *
   */
  transform(value: string, firstOccurrence: boolean, ...patterns: string[]): string {
    if (hasValue(value)) {
      if(firstOccurrence) {
        patterns.forEach((pattern: string) => {
          value = value.replace(new RegExp(pattern), '');
        });
      } else {
        patterns.forEach((pattern: string) => {
          value = value.replace(new RegExp(pattern, "g"), '');
        });
      }
    }
    return value;
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { hasValue } from '../empty.util';

/**
 * Pipe to truncate a string by words. Default value: 10
 */

@Pipe({
  name: 'dsTruncateString'
})
export class TruncateStringPipe implements PipeTransform {
  transform(value: string, limit = 10, trail = '...'): string {

    if (hasValue(value)) {
      const words = value.split(/\s+/);
      if (words.length <= limit) {
        return value;
      }
      return words.slice(0, limit).join(' ') + trail;
    }
    else{
      return value;
    }
  }
}

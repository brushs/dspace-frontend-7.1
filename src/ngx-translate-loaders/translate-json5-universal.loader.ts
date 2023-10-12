import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as JSON5 from 'json5'
import * as fs from 'fs';

export class TranslateJson5UniversalLoader  implements TranslateLoader {

  constructor(public resources: Array<{prefix?: string, suffix?: string}>) { }

  public getTranslation(lang: string): Observable<any> {
    let mergedTranslation = this.resources.reduce((prev, {prefix, suffix}) => {
      let parsedValue = JSON5.parse(fs.readFileSync(`${prefix}${lang}${suffix}`, 'utf8'));
      Object.assign(prev, parsedValue);
      return prev;
    }, {})

    return Observable.create((observer: any) => {
      observer.next(mergedTranslation);
      observer.complete();
    });
  }

}

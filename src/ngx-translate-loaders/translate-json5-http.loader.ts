import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';

import * as JSON5 from 'json5';

export class TranslateJson5HttpLoader implements TranslateLoader {

  constructor(private http: HttpClient, public resources: Array<{prefix?: string, suffix?: string}>) {
  }

  getTranslation(lang: string): Observable<any> {
    return zip(
        ...this.resources.map( ({prefix, suffix}) =>
          this.http.get('' + prefix + lang + suffix, {responseType: 'text'})
            .pipe(map((json: any) => JSON5.parse(json))))
      ).pipe(map((x)=> x.reduce((prev, curr) => {
        Object.assign(prev, curr);
        return prev;
      }, {}) ));
    }
}

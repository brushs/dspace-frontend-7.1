import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import JSON5 from 'json5';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TranslationJsonService  {
  private parsedDataEnglish: any;
  private parsedDataFrench: any;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) protected platformId: any,
  ) {}

  loadJson5File(lang: string, prefix?: string): Promise<void> {

    if (isPlatformBrowser(this.platformId)) {
      const filePath = `assets/i18n/${prefix ?? 'core'}/${lang}.json5`;
    
      return this.http.get(filePath, { responseType: 'text' })
        .toPromise()
        .then(json5Content => {
          const parsedData = JSON5.parse(json5Content);
          // Store the parsed data based on the language
          if (lang === 'en') {
            this.parsedDataEnglish = parsedData;
          } else if (lang === 'fr') {
            this.parsedDataFrench = parsedData;
          }
        })
        .catch(error => {
          console.error('Error reading or parsing JSON5 file:', error.message);
          throw error;
        });

    }

    return Promise.resolve();
    
  }


  getValueByKey<T>(key: string, lang: string): T | undefined {
    let parsedData: any;
  
    // Choose the parsed data based on the language
    if (lang === 'en') {
      parsedData = this.parsedDataEnglish;
    } else if (lang === 'fr') {
      parsedData = this.parsedDataFrench;
    }
  
    return parsedData && parsedData[key];
  }

  getKeyByValue<T>(value: T, lang: string): string | undefined {
    let parsedData: any;
  
    if (lang === 'en') {
      parsedData = this.parsedDataEnglish;
    } else if (lang === 'fr') {
      parsedData = this.parsedDataFrench;
    }
  
    if (parsedData) {
      const entry = Object.entries(parsedData).find(([key, val]) => val === value);
      return entry ? entry[0] : undefined;
    }
  
    return undefined;
  }

  getKeysByValue<T>(value: T, lang: string): string[] | undefined {
    let parsedData: any;
  
    if (lang === 'en') {
      parsedData = this.parsedDataEnglish;
    } else if (lang === 'fr') {
      parsedData = this.parsedDataFrench;
    }
  
    if (parsedData) {
      return Object.entries(parsedData).filter(([key, val]) => val === value)
        .map(([key, val]) => {
          return key;
        });
    }
  
    return undefined;
  }
  
}

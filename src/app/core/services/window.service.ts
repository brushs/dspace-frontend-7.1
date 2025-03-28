import { 
  DOCUMENT, 
  // isPlatformBrowser
} from '@angular/common';
import { 
  InjectionToken, 
  // PLATFORM_ID
} from '@angular/core';
import {
  Inject,
  Injectable
} from '@angular/core';

export const NativeWindowService = new InjectionToken('NativeWindowService');

type DocumentType = Document;

export class NativeWindowRef {

  get nativeWindow(): any {
    if (typeof window !== 'undefined') {
      return window;
    } else {
      return false;
    }
  }
  
}

export function NativeWindowFactory() {
  return new NativeWindowRef();
}

@Injectable({ providedIn: 'root' })
// @Injectable()
export class CustomNativeWindowService {
  constructor(
    @Inject(DOCUMENT) private document: DocumentType,
    // @Inject(PLATFORM_ID) private platformId: any,
  ){

    // console.log(`platform ID: ${this.platformId}`);

    // if(this.document){
    //   console.log("document injected: " + this.document.location + "\nhost: " + this.document.location.host);
    // }else{
    //   console.log(" document undefined");
    // }
  }

  get nativeWindow(): any {
    if (typeof window !== 'undefined') {
      return window;
    } else {
      return false;
    }
  }

  get nativeDocument(): any {
    if (typeof this.document !== 'undefined') {
      return this.document;
    } else {
      return false;
    }
  }
  
}
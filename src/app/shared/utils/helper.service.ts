import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

const LOCAL_STORAGE_FOCUS_KEY = 'ELEM_TO_FOCUS';
@Injectable()
export class HelperService {

  private focusElement: BehaviorSubject<string> = new BehaviorSubject(null);
  focusElement$ = this.focusElement.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
  ) {}

  setFocusElement(selector: string) {
      this.focusElement.next(selector)
  }

  setSelectorOfElementToFocusOnAfterRedirect(value) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(LOCAL_STORAGE_FOCUS_KEY, value);
    }
  }

  getSelectorOfElementToFocusOnAfterRedirect() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(LOCAL_STORAGE_FOCUS_KEY);
    }
  }

  setFocusAfterRedirect(remove = true) {

    let elemToFocus;

    if (isPlatformBrowser(this.platformId)) {
      elemToFocus = localStorage.getItem(LOCAL_STORAGE_FOCUS_KEY);
    }

    if(elemToFocus) {

      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem(LOCAL_STORAGE_FOCUS_KEY);
      }

      let iId = setInterval(() => {
        let focusEl = (document.querySelector(elemToFocus) as HTMLElement);
        if(focusEl) {
          focusEl.setAttribute('tabindex', '-1');
          focusEl.focus();

          focusEl.removeAttribute('tabindex');
          clearInterval(iId);
        }
      }, 250);
      return;
    }
  }

}

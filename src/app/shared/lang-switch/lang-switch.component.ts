import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LangConfig } from '../../../config/lang-config.interface';
import { environment } from '../../../environments/environment';
import { LocaleService } from '../../core/locale/locale.service';
import { HostWindowService } from '../host-window.service';

@Component({
  selector: 'ds-lang-switch',
  styleUrls: ['lang-switch.component.scss'],
  templateUrl: 'lang-switch.component.html',
})

/**
 * Component representing a switch for changing the interface language throughout the application
 * If only one language is active, the component will disappear as there are no languages to switch to.
 */
export class LangSwitchComponent implements OnInit {

  // All of the languages that are active, meaning that a user can switch between them.
  activeLangs: LangConfig[];

  // A language switch only makes sense if there is more than one active language to switch between.
  moreThanOneLanguage: boolean;

  isXsOrSm$: Observable<boolean>;
  constructor(
    public translate: TranslateService,
    private localeService: LocaleService,
    protected windowService: HostWindowService
  ) {
    this.isXsOrSm$ = windowService.isXsOrSm();
  }

  ngOnInit(): void {
    this.activeLangs = environment.languages.filter((MyLangConfig) => MyLangConfig.active === true);
    this.moreThanOneLanguage = (this.activeLangs.length > 1);
  }

  /**
   * Returns the label for the current language
   */
  currentLangLabel(): string {
    return this.activeLangs.find((MyLangConfig) => MyLangConfig.code === this.translate.currentLang).label;
  }

  /**
   * Returns the label for a specific language code
   */
  langLabel(langcode: string): string {
    return this.activeLangs.find((MyLangConfig) => MyLangConfig.code === langcode).label;
  }

  /**
   * Switch to a language and store it in a cookie
   * @param lang    The language to switch to
   */
  useLang(lang: string, event: any) {
    event.preventDefault();
    // document.querySelector('html').setAttribute('lang', lang)
    this.localeService.setCurrentLanguageCode(lang);
    this.localeService.refreshAfterChangeLanguage();
  }

    /**
   * Gets alternate official language code English/French
   */
    getAlternateLanguageCode(langcode: string): string {
      return langcode === "en" ? "fr" : "en"
    }

}

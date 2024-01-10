import { delay, distinctUntilChanged, filter, take, withLatestFrom } from 'rxjs/operators';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnInit,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { MetadataService } from './core/metadata/metadata.service';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { HostWindowState } from './shared/search/host-window.reducer';
import { NativeWindowRef, NativeWindowService } from './core/services/window.service';
import { isAuthenticationBlocking } from './core/auth/selectors';
import { AuthService } from './core/auth/auth.service';
import { CSSVariableService } from './shared/sass-helper/sass-helper.service';
import { MenuService } from './shared/menu/menu.service';
import { HostWindowService } from './shared/host-window.service';
import { ThemeConfig } from '../config/theme.model';
import { Angulartics2DSpace } from './statistics/angulartics/dspace-provider';
import { environment } from '../environments/environment';
import { models } from './core/core.module';
import { LocaleService } from './core/locale/locale.service';
import { hasValue, isEmpty, isNotEmpty } from './shared/empty.util';
import { KlaroService } from './shared/cookies/klaro.service';
import { GoogleAnalyticsService } from './statistics/google-analytics.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ThemeService } from './shared/theme-support/theme.service';
import { BASE_THEME_NAME } from './shared/theme-support/theme.constants';
import { DEFAULT_THEME_CONFIG } from './shared/theme-support/theme.effects';
import { BreadcrumbsService } from './breadcrumbs/breadcrumbs.service';
import { IdleModalComponent } from './shared/idle-modal/idle-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  sidebarVisible: Observable<boolean>;
  slideSidebarOver: Observable<boolean>;
  collapsedSidebarWidth: Observable<string>;
  totalSidebarWidth: Observable<string>;
  theme: Observable<ThemeConfig> = of({} as any);
  notificationOptions = environment.notifications;
  models;

  /**
   * Whether or not the authentication is currently blocking the UI
   */
  isAuthBlocking$: Observable<boolean>;

  /**
   * Whether or not the app is in the process of rerouting
   */
  isRouteLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * Whether or not the theme is in the process of being swapped
   */
  isThemeLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);


  /**
   * Whether or not the idle modal is is currently open
   */
  idleModalOpen: boolean;

  /**
   * Whether or not load Welcome page
   */
   loadWelcome$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: any,
    private themeService: ThemeService,
    private translate: TranslateService,
    private store: Store<HostWindowState>,
    private metadata: MetadataService,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2DSpace: Angulartics2DSpace,
    private authService: AuthService,
    private router: Router,
    private cssService: CSSVariableService,
    private menuService: MenuService,
    private windowService: HostWindowService,
    private localeService: LocaleService,
    private breadcrumbsService: BreadcrumbsService,
    private modalService: NgbModal,
    @Optional() private cookiesService: KlaroService,
    @Optional() private googleAnalyticsService: GoogleAnalyticsService,
  ) {

    /* Use models object so all decorators are actually called */
    this.models = models;

    this.themeService.getThemeName$().subscribe((themeName: string) => {
      if (isPlatformBrowser(this.platformId)) {
        // the theme css will never download server side, so this should only happen on the browser
        this.isThemeLoading$.next(true);
      }
      if (hasValue(themeName)) {
        this.setThemeCss(themeName);
      } else if (hasValue(DEFAULT_THEME_CONFIG)) {
        this.setThemeCss(DEFAULT_THEME_CONFIG.name);
      } else {
        this.setThemeCss(BASE_THEME_NAME);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.authService.trackTokenExpiration();
      this.trackIdleModal();
    }

    // Load all the languages that are defined as active from the config file
    translate.addLangs(environment.languages.filter((LangConfig) => LangConfig.active === true).map((a) => a.code));

    // Load the default language from the config file
    // translate.setDefaultLang(environment.defaultLanguage);

    // set the current language code
    //this.localeService.setCurrentLanguageCode();

    // set loadWelcome$ for template, and pass to root.component template to decide loading welcome page.
    let cookieLang = this.localeService.getLanguageCodeFromCookie();
    if (isEmpty(cookieLang)) {
        this.loadWelcome$.next(true);
    } else {
      this.loadWelcome$.next(false);
      this.localeService.setCurrentLanguageCode();
    }


    // analytics
    if (hasValue(googleAnalyticsService)) {
      googleAnalyticsService.addTrackingIdToPage();
    }
    angulartics2DSpace.startTracking();

    metadata.listenForRouteChange();
    breadcrumbsService.listenForRouteChanges();

    if (environment.debug) {
      console.info(environment);
    }
    this.storeCSSVariables();

  }

  ngOnInit() {
    this.isAuthBlocking$ = this.store.pipe(select(isAuthenticationBlocking)).pipe(
      distinctUntilChanged()
    );

    /* Start FOSRC Changes - 1620 
    // disable cookie consent klaro service
    this.isAuthBlocking$
      .pipe(
        filter((isBlocking: boolean) => isBlocking === false),
        take(1)
      ).subscribe(() => this.initializeKlaro());
    End of FOSRC changes */
    const env: string = environment.production ? 'Production' : 'Development';
    const color: string = environment.production ? 'red' : 'green';
    console.info(`Environment: %c${env}`, `color: ${color}; font-weight: bold;`);
    this.dispatchWindowSize(this._window.nativeWindow.innerWidth, this._window.nativeWindow.innerHeight);
  }

  private storeCSSVariables() {
    this.cssService.addCSSVariable('xlMin', '1200px');
    this.cssService.addCSSVariable('mdMin', '768px');
    this.cssService.addCSSVariable('lgMin', '576px');
    this.cssService.addCSSVariable('smMin', '0');
    this.cssService.addCSSVariable('adminSidebarActiveBg', '#0f1b28');
    this.cssService.addCSSVariable('sidebarItemsWidth', '250px');
    this.cssService.addCSSVariable('collapsedSidebarWidth', '53.234px');
    this.cssService.addCSSVariable('totalSidebarWidth', '303.234px');
    // const vars = variables.locals || {};
    // Object.keys(vars).forEach((name: string) => {
    //   this.cssService.addCSSVariable(name, vars[name]);
    // })
  }

  ngAfterViewInit() {
    this.router.events.pipe(
      // This fixes an ExpressionChangedAfterItHasBeenCheckedError from being thrown while loading the component
      // More information on this bug-fix: https://blog.angular-university.io/angular-debugging/
      delay(0)
    ).subscribe((event) => {

      if (event instanceof NavigationStart) {
        this.isRouteLoading$.next(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel
      ) {

        this.isRouteLoading$.next(false);

        //if the event url does not contain a hash fragment
        if(!event.url.includes("#")){

          //get the unordered list element containing the skip to links elements in
          // the DOM
          let skipToLinksListEl = (document.querySelector('#wb-tphp') as HTMLElement);

          //if the unordered list element exists
          if(skipToLinksListEl) {

            //set the tab index to -1 to allow for focusability
            skipToLinksListEl.setAttribute('tabindex', '-1');

            //focus on the element
            skipToLinksListEl.focus();

            //scroll the element into view
            skipToLinksListEl.scrollIntoView();

            //remove the tabindex attribute once the focus is set
            skipToLinksListEl.removeAttribute('tabindex');
          }
        }

        //if the URL has query parameters
        if(event.url.includes("?")){
          let queryParams = this.parseQueryParametersFromUrl(event.url);

          //if the 'useLang' query parameter exists
          if(queryParams["useLang"]){
            let queryParams = this.parseQueryParametersFromUrl(event.url);

            //remove the 'useLang' query parameter
            this.router.navigate([this.router.url.split("?")[0]], { queryParams: {...queryParams, useLang: null},
            queryParamsHandling: 'merge' })
            .then(() => {
              this.localeService.setCurrentLanguageCode(queryParams["useLang"]);
              this.localeService.refreshAfterChangeLanguage();
            });
          };
        }

        if(this.translate.currentLang !== this.localeService.getLanguageCodeFromCookie()){
          this.localeService.setCurrentLanguageCode(this.localeService.getLanguageCodeFromCookie());
          this.localeService.refreshAfterChangeLanguage();
        }
      }
    });

  }

  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    this.dispatchWindowSize(event.target.innerWidth, event.target.innerHeight);
  }

  private dispatchWindowSize(width, height): void {
    this.store.dispatch(
      new HostWindowResizeAction(width, height)
    );
  }

  private initializeKlaro() {
    if (hasValue(this.cookiesService)) {
      this.cookiesService.initialize();
    }
  }

  /**
   * Update the theme css file in <head>
   *
   * @param themeName The name of the new theme
   * @private
   */
  private setThemeCss(themeName: string): void {
    const head = this.document.getElementsByTagName('head')[0];
    // Array.from to ensure we end up with an array, not an HTMLCollection, which would be
    // automatically updated if we add nodes later
    const currentThemeLinks = Array.from(this.document.getElementsByClassName('theme-css'));
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('class', 'theme-css');
    link.setAttribute('href', `/${encodeURIComponent(themeName)}-theme.css`);
    // wait for the new css to download before removing the old one to prevent a
    // flash of unstyled content
    link.onload = () => {
      if (isNotEmpty(currentThemeLinks)) {
        currentThemeLinks.forEach((currentThemeLink: any) => {
          if (hasValue(currentThemeLink)) {
            currentThemeLink.remove();
          }
        });
      }
      // the fact that this callback is used, proves we're on the browser.
      this.isThemeLoading$.next(false);
    };
    head.appendChild(link);
  }

  private trackIdleModal() {
    const isIdle$ = this.authService.isUserIdle();
    const isAuthenticated$ = this.authService.isAuthenticated();
    isIdle$.pipe(withLatestFrom(isAuthenticated$))
      .subscribe(([userIdle, authenticated]) => {
        if (userIdle && authenticated) {
          if (!this.idleModalOpen) {
            const modalRef = this.modalService.open(IdleModalComponent, { ariaLabelledBy: 'idle-modal.header' });
            this.idleModalOpen = true;
            modalRef.componentInstance.response.pipe(take(1)).subscribe((closed: boolean) => {
              if (closed) {
                this.idleModalOpen = false;
              }
            });
          }
        }
      });
  }

  /**
   * Method to parse the query parameter segment from a URL string
   * @param url The URL string value
   * @returns Query parameters as an object
   */
  parseQueryParametersFromUrl(url){
    if(url){
      let queryParamsString = url.split("?")[1];
      if(url.split("?")[1]){
        let queryParamsStringSegments = queryParamsString.split("&");
        let queryParamsObject = {};
        queryParamsStringSegments.forEach((segment) => {
          let splitSegment = segment.split("=");
          queryParamsObject[splitSegment[0]] = decodeURIComponent(splitSegment[1]);
        });
        return queryParamsObject;
      }
    }
    return {};
    
  }
}

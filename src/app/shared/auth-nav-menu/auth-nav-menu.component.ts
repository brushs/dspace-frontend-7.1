import { Observable, of as observableOf, Subscription } from 'rxjs';

import { filter, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { fadeInOut, fadeOut } from '../animations/fade';
import { HostWindowService } from '../host-window.service';
import { AppState, routerStateSelector } from '../../app.reducer';
import { isNotUndefined } from '../empty.util';
import { isAuthenticated, isAuthenticationLoading, isWithinIpRange } from '../../core/auth/selectors';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { AuthService, LOGIN_ROUTE, LOGOUT_ROUTE } from '../../core/auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'ds-auth-nav-menu, [ds-auth-nav-menu]',
  templateUrl: './auth-nav-menu.component.html',
  styleUrls: ['./auth-nav-menu.component.scss'],
  animations: [fadeInOut, fadeOut]
})
export class AuthNavMenuComponent implements OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;

  /**
   * True if the authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  public isWithinIpRange: Observable<boolean>;

  public isXsOrSm$: Observable<boolean>;

  public showAuth = observableOf(false);
  //TODO: Here is the place to control display or not the login button

  public user: Observable<EPerson>;

  public sub: Subscription;

  showButton = true;

  constructor(private store: Store<AppState>,
              private windowService: HostWindowService,
              private authService: AuthService,
              private router: Router
  ) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  ngOnInit(): void {
    this.setShowButton()
    this.router.events.pipe(filter( event => event instanceof NavigationEnd)).subscribe(x => {
      this.setShowButton()
    })
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    this.isWithinIpRange = this.store.pipe(select(isWithinIpRange));

    this.user = this.authService.getAuthenticatedUserFromStore();

    this.showAuth = this.store.pipe(
      select(routerStateSelector),
      filter((router: RouterReducerState) => isNotUndefined(router) && isNotUndefined(router.state)),
      map((router: RouterReducerState) => (!router.state.url.startsWith(LOGIN_ROUTE)
        && !router.state.url.startsWith(LOGOUT_ROUTE))
      )
    );
  }

  setShowButton() {
    let { url } = this.router;
    this.showButton = !(url.includes('/sign-in') || url.includes('sign-out') || url.includes('se-connecter') || url.includes('de-connecter'));

  }
}

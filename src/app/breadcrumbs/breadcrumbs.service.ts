import { Injectable } from '@angular/core';
import {combineLatest, Observable, of as observableOf, ReplaySubject} from 'rxjs';
import {Breadcrumb} from './breadcrumb/breadcrumb.model';
import {BreadcrumbOptions} from './breadcrumb/breadcrumb-options.model';
import {ActivatedRoute, NavigationEnd, provideRoutes, Router} from '@angular/router';
import {filter, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {hasNoValue, hasValue, isUndefined} from '../shared/empty.util';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {

  /**
   * Observable of the list of breadcrumbs for this page
   */
  breadcrumbs$: ReplaySubject<Breadcrumb[]> = new ReplaySubject(1);

  /**
   * Whether or not to show breadcrumbs on this page
   */
  showBreadcrumbs$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Observable of breadcrumb options object passed as data with route
   */
  breadcrumbOptions$: ReplaySubject<BreadcrumbOptions> = new ReplaySubject(1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  /**
   * Called by {@link AppComponent#constructor} (i.e. before routing)
   * such that no routing events are missed.
   */
  listenForRouteChanges() {
    // supply events to this.breadcrumbs$
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      tap(() => this.reset()),
      switchMap(() => {
        return this.resolveBreadcrumbs(this.route.root)
      }),
    ).pipe(
      tap(() => {
        let breadcrumbOptions = this.getRouteBreadcrumbOptionsDataFromRoute(this.route.root);
        this.breadcrumbOptions$.next(breadcrumbOptions);
      }),
      //get latest query parameters
      withLatestFrom(this.route.queryParams),
      map(([breadcrumbs, queryParameters]) => {
        
        let breadCrumbOptions = this.getRouteBreadcrumbOptionsDataFromRoute(this.route.root);
        let breadCrumbsToAdd = breadCrumbOptions?.addBreadcrumbElements;
        if(breadCrumbsToAdd){
          breadCrumbsToAdd.forEach(element => {
            //add breadcrumb at the specified position
            breadcrumbs.splice(element.position, 0, element.breadcrumb);
          });
        }

        //if the "fromSearchPage" query parameter exists
        if(queryParameters["fromSearchPage"]){
          //add the search page breadcrumb second from the end
          breadcrumbs.splice(-1, 0, new Breadcrumb('search.page.breadcrumbs', localStorage.getItem("previousSearchPageUrlPath")));
        }
        
        return breadcrumbs;
      })
    ).subscribe(this.breadcrumbs$);
  }

  /**
   * Method that recursively checks if an ActivatedRoute
   * or any of its ActivatedRoute children have
   * 'breadCrumbOptions' data, and the first instance of
   * the data is returned
   * @param route An ActivatedRoute object
   */
  getRouteBreadcrumbOptionsDataFromRoute(route: ActivatedRoute): BreadcrumbOptions{
    let breadcrumbOptionsData;
    const data = route.snapshot.data;
    if(data.breadcrumbOptions){
      breadcrumbOptionsData = data.breadcrumbOptions;
      return breadcrumbOptionsData;
    }else{
      if(route.firstChild){
        return this.getRouteBreadcrumbOptionsDataFromRoute(route.firstChild);
      }else {
        return null;
      }
    }
  }

  /**
   * Method that recursively resolves breadcrumbs
   * @param route The route to get the breadcrumb from
   */
  private resolveBreadcrumbs(route: ActivatedRoute): Observable<Breadcrumb[]> {
    const data = route.snapshot.data;
    const routeConfig = route.snapshot.routeConfig;
    const last: boolean = hasNoValue(route.firstChild);
    if (last) {
      if (hasValue(data.showBreadcrumbs)) {
        this.showBreadcrumbs$.next(data.showBreadcrumbs);
      } else if (isUndefined(data.breadcrumb)) {
        this.showBreadcrumbs$.next(false);
      }
    }

    if (
      hasValue(data) && hasValue(data.breadcrumb) &&
      hasValue(routeConfig) && hasValue(routeConfig.resolve) && hasValue(routeConfig.resolve.breadcrumb)
    ) {
      const { provider, key, url, lang } = data.breadcrumb;
      if (!last) {
        return combineLatest(provider.getBreadcrumbs(key, url, lang), this.resolveBreadcrumbs(route.firstChild))
          .pipe(map((crumbs) => [].concat.apply([], crumbs)));
      } else {
        return provider.getBreadcrumbs(key, url);
      }
    }
    return !last ? this.resolveBreadcrumbs(route.firstChild) : observableOf([]);
  }

  /**
   * Resets the state of the breadcrumbs
   */
  private reset() {
    this.breadcrumbOptions$.next(
      {
        // addFederalScienceLibrariesNetworkBreadcrumb: false,
        omitHomeBreadcrumb: false,
        omitBreadcrumbElements: [],
        addBreadcrumbElements: []
      }
      );
    this.showBreadcrumbs$.next(true);
  }

}

import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, OnDestroy} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { hasValue, isEmpty } from '../shared/empty.util';
import { getFirstSucceededRemoteData } from '../core/shared/operators';
import { RouteService } from '../core/services/route.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchResult } from '../shared/search/search-result.model';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SearchService } from '../core/shared/search/search.service';
import { currentPath } from '../shared/utils/route.utils';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Context } from '../core/shared/context.model';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { followLink } from '../shared/utils/follow-link-config.model';
import { Item } from '../core/shared/item.model';
import { lte, map } from 'lodash';

/**
 * Page with title and the community list tree, as described in community-list.component;
 * navigated to with community-list.page.routing.module
 */
@Component({
  selector: 'ds-community-list-page',
  templateUrl: './community-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
})
export class CommunityListPageComponent implements OnInit, OnDestroy {
  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);

  searchSubmit: any;

  /**
   * The current paginated search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;
 
  /**
   * The current available sort options
   */
  sortOptions$: Observable<SortOptions[]>;
 
  /**
   * The current relevant scopes
   */
  scopeListRD$: Observable<DSpaceObject[]>;
 
  /**
   * Emits true if were on a small screen
   */
  isXsOrSm$: Observable<boolean>;
 
  /**
   * Subscription to unsubscribe from
   */
  sub: Subscription;
 
  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch = true;
 
  /**
   * Whether or not the search bar should be visible
   */
  @Input() searchEnabled = true;
 
  /**
   * The width of the sidebar (bootstrap columns)
   */
  @Input() sideBarWidth = 3;
 
  /**
   * The currently applied configuration (determines title of search)
   */
  @Input() configuration$: Observable<string>;
 
  /**
   * The current context
   */
  @Input() context: Context;

  /**
   * Link to the search page
   */
  searchLink: string;

  /**
   * Observable for whether or not the sidebar is currently collapsed
   */
  isSidebarCollapsed$: Observable<boolean>;

  myParams : Observable<any[]>;

  constructor(protected service: SearchService,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService,
              protected routeService: RouteService,
              protected activatedRoute: ActivatedRoute,
              protected router: Router) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  pageUrls: Observable<UrlSegment[]>;

  /**
   * Listening to changes in the paginated search options
   * If something changes, update the search results
   *
   * Listen to changes in the scope
   * If something changes, update the list of scopes for the dropdown
   */
   ngOnInit(): void {
    this.isSidebarCollapsed$ = this.isSidebarCollapsed();
    this.searchLink = this.getSearchLink();
    this.searchOptions$ = this.getSearchOptions();
    this.sub = this.searchOptions$.pipe(
      switchMap((options) => this.service.search(
          options, undefined, true, true, followLink<Item>('thumbnail', { isOptional: true })
        ).pipe(getFirstSucceededRemoteData(), startWith(undefined))
      )
    ).subscribe((results) => {
        this.resultsRD$.next(results);
      });

    console.log("search link=" + this.router.url);
    //ERROR TypeError: Cannot read properties of undefined (reading 'path')
    //console.log("page URL1=" + this.activatedRoute['_routerState'].snapshot.url[0].path);
    //ERROR TypeError: Cannot read properties of undefined (reading 'path')
    //console.log("page URL2=" + this.activatedRoute.snapshot.url[0].path);
    //ERROR TypeError: Cannot read properties of undefined (reading 'path')
    //console.log("page URL3=" + this.activatedRoute.url[0].path);
    this.pageUrls = this.activatedRoute.url;
    let pageUrlSeg = this.activatedRoute['_routerState'].snapshot.url;
    console.log("snapshot URL=" + pageUrlSeg);
    //below line, pageUrlSeg get undefined
    pageUrlSeg = this.activatedRoute.snapshot.url[0];
    //below line, pageUrlSeg get undefined
    pageUrlSeg = this.activatedRoute.url[0];

    //this.activatedRoute.snapshot.url[0].path;
    this.activatedRoute.url.subscribe((urls) => {
      //the console.log is not executed. Not subscribed???
      urls.map(url => console.log("page URL=" + url.path));
      //urls.map(this.checkURL);
    });

      //this.activatedRoute.paramMap.pipe(
    //  switchMap((params) => params.get('query'))
    //).subscribe((query) => {
    //  console.log("params=" + query);
    //});
    //this.activatedRoute.paramMap.subscribe((parameter) => {
    //  console.log(parameter.get('query'));
    //});
    //console.log("route=" + this.activatedRoute.paramMap.toString());

    this.scopeListRD$ = this.searchConfigService.getCurrentScope('').pipe(
      switchMap((scopeId) => this.service.getScopes(scopeId))
    );
    if (isEmpty(this.configuration$)) {
      this.configuration$ = this.searchConfigService.getCurrentConfiguration('default');
    }

    const searchConfig$ = this.searchConfigService.getConfigurationSearchConfigObservable(this.configuration$, this.service);

    this.sortOptions$ = this.searchConfigService.getConfigurationSortOptionsObservable(searchConfig$);
    this.searchConfigService.initializeSortOptionsFromConfiguration(searchConfig$);
    this.searchSubmit = null;
  }

  checkURL(url : UrlSegment) {
    console.log("page URL=" + url.path);
    if (url.path === 'community-list') {
      this.searchSubmit = null;
    }
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
      this.searchSubmit = null;
    }
  }

  onSeachSubmit(newSearchEvent : any) {
    this.searchSubmit = newSearchEvent;
  }

  /**
   * Get the current paginated search options
   * @returns {Observable<PaginatedSearchOptions>}
   */
  protected getSearchOptions(): Observable<PaginatedSearchOptions> {
    return this.searchConfigService.paginatedSearchOptions;
  }

  /**
   * Set the sidebar to a collapsed state
   */
  public closeSidebar(): void {
    this.sidebarService.collapse();
  }

  /**
   * Set the sidebar to an expanded state
   */
  public openSidebar(): void {
    this.sidebarService.expand();
  }

  /**
   * Check if the sidebar is collapsed
   * @returns {Observable<boolean>} emits true if the sidebar is currently collapsed, false if it is expanded
   */
  private isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  private getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.service.getSearchLink();
  }

}

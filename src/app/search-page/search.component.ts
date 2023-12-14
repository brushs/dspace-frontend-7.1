import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../shared/empty.util';
import { getFirstSucceededRemoteData } from '../core/shared/operators';
import { RouteService } from '../core/services/route.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchResult } from '../shared/search/search-result.model';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SearchService } from '../core/shared/search/search.service';
import { currentPath } from '../shared/utils/route.utils';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Context } from '../core/shared/context.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { followLink } from '../shared/utils/follow-link-config.model';
import { Item } from '../core/shared/item.model';
import { PaginationService } from '../core/pagination/pagination.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { AppInjector } from '../app.injector';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { stripOperatorFromFilterValue } from '../shared/search/search.utils';
@Component({
  selector: 'ds-search',
  styleUrls: ['../../themes/wetoverlay/styles/static-pages.scss', './search.component.scss', ],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

/**
 * This component renders a sidebar, a search input bar and the search results.
 */
export class SearchComponent implements OnInit {
  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);

  /**
   * The current available results per page options
   */
  paginationOptions$: Observable<PaginationComponentOptions>
  
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
  @Input()
  searchEnabled = true;

  /**
   * The width of the sidebar (bootstrap columns)
   */
  @Input()
  sideBarWidth = 3;

  /**
   * The currently applied configuration (determines title of search)
   */
  @Input()
  configuration$: Observable<string>;

  /**
   * The current context
   */
  @Input()
  context: Context;

  /**
   * Link to the search page
   */
  searchLink: string;

  /**
   * Observable for whether or not the sidebar is currently collapsed
   */
  isSidebarCollapsed$: Observable<boolean>;
  /* Start FOSRC Changes - 1619 */
  adminSearch: boolean;
  /* End of FOSRC Changes */
  
  paginationService: PaginationService;
  dsoNameService: DSONameService;
  hasNoValue = hasNoValue;
  stripOperatorFromFilterValue = stripOperatorFromFilterValue
  
  /**
   * Emits the currently active filters
   */
  appliedFilters: Observable<Params>;
  mainSearchValue :string;
 
  constructor(protected service: SearchService,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService,
              protected router: Router,
              protected route: ActivatedRoute,
              ) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  /**
   * Listening to changes in the paginated search options
   * If something changes, update the search results
   *
   * Listen to changes in the scope
   * If something changes, update the list of scopes for the dropdown
   */
  ngOnInit(): void {
    // this.router = AppInjector.get(Router);
    this.isSidebarCollapsed$ = this.isSidebarCollapsed();
    this.searchLink = this.getSearchLink();
    /* Start FOSRC Changes - 1619 */
    this.adminSearch = false;
    if (this.searchLink == "/admin/search") {
      this.adminSearch = true;
    }
    /* End of FOSRC Changes */
    this.searchOptions$ = this.getSearchOptions();
    this.sub = this.searchOptions$.pipe(
      switchMap((options) => this.service.search(
          options, undefined, true, true, followLink<Item>('thumbnail', { isOptional: true })
        ).pipe(getFirstSucceededRemoteData(), startWith(undefined))
      )
    ).subscribe((results) => {
        this.resultsRD$.next(results);
      });
    this.scopeListRD$ = this.searchConfigService.getCurrentScope('').pipe(
      switchMap((scopeId) => this.service.getScopes(scopeId))
    );
    if (isEmpty(this.configuration$)) {
      this.configuration$ = this.searchConfigService.getCurrentConfiguration('default');
    }

    const searchConfig$ = this.searchConfigService.getConfigurationSearchConfigObservable(this.configuration$, this.service);

    this.sortOptions$ = this.searchConfigService.getConfigurationSortOptionsObservable(searchConfig$);
    this.searchConfigService.initializeSortOptionsFromConfiguration(searchConfig$);

    this.paginationService = AppInjector.get(PaginationService);
    this.dsoNameService = AppInjector.get(DSONameService);

    this.paginationOptions$ = this.searchConfigService.paginatedSearchOptions.pipe(map((options: PaginatedSearchOptions) => options.pagination));

    this.routeService.getQueryParameterValue("query").subscribe(query =>{
      this.mainSearchValue = query;
    });
  }

  // this.dsoOfficialTitle = this.dsoNameService.getOfficialName(this.dso, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
  // this.dsoTranslatedTitle = this.dsoNameService.getTranslatedName(this.dso, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
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

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }


    /**
   * Method to change the given string by surrounding it by quotes if not already present.
   */
    surroundStringWithQuotes(input: string): string {
      let result = input;
  
      if (isNotEmpty(result) && !(result.startsWith('\"') && result.endsWith('\"'))) {
        result = `"${result}"`;
      }
  
      return result;
    }


    applyQuery(term) {
      const queryParams =  {query: term};
      const pageParam = this.paginationService.getPageParam(this.searchConfigService.paginationID);
      queryParams[pageParam] = 1;
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: queryParams, queryParamsHandling: 'merge'});
    }

    redirectToAnchor(anchor) {
      if(window.location.hash === anchor) {
        window.location.hash = '';
        setTimeout(()=> {
          window.location.hash = anchor
        }, 150)
      } else {
        window.location.hash = anchor;
      }
    }
    
    scrollToSearchRepository() {
      this.redirectToAnchor('#search-repository');
    }

    scrollToSearchResults() {
      this.redirectToAnchor('#search-results');
    }

}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { PaginatedList } from '../../../../../app/core/data/paginated-list.model'          //../core/data/paginated-list.model';
import { RemoteData } from '../../../../../app/core/data/remote-data';
import { DSpaceObject } from '../../../../../app/core/shared/dspace-object.model';
import { pushInOut } from '../../../../../app/shared/animations/push';
import { HostWindowService } from '../../../../../app/shared/host-window.service';
import { SidebarService } from '../../../../../app/shared/sidebar/sidebar.service';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../../../../app/shared/empty.util';
import { getFirstSucceededRemoteData } from '../../../../../app/core/shared/operators';
import { RouteService } from '../../../../../app/core/services/route.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../app/my-dspace-page/my-dspace-page.component';
import { PaginatedSearchOptions } from '../../../../../app/shared/search/paginated-search-options.model';
import { SearchResult } from '../../../../../app/shared/search/search-result.model';
import { SearchConfigurationService } from '../../../../../app/core/shared/search/search-configuration.service';
import { SearchService } from '../../../../../app/core/shared/search/search.service';
import { currentPath } from '../../../../../app/shared/utils/route.utils';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Context } from '../../../../../app/core/shared/context.model';
import { SortDirection, SortOptions } from '../../../../../app/core/cache/models/sort-options.model';
import { followLink } from '../../../../../app/shared/utils/follow-link-config.model';
import { Item } from '../../../../../app/core/shared/item.model';
import { PaginationService } from '../../../../../app/core/pagination/pagination.service';
import { PaginationComponentOptions } from '../../../../../app/shared/pagination/pagination-component-options.model';
import { AppInjector } from '../../../../../app/app.injector';
import { DSONameService } from '../../../../../app/core/breadcrumbs/dso-name.service';
import { stripOperatorFromFilterValue } from '../../../../../app/shared/search/search.utils';
import { GeoSearchPageComponent } from '../../geo-search-page/geo-search-page.component';
import { DynamicFiltersComponent } from '../dynamic-filters/dynamic-filters.component';

@Component({
  selector: 'ds-search',
  styleUrls: ['../../../../../themes/wetoverlay/styles/static-pages.scss', './my-search.component.scss', ],
  templateUrl: './my-search.component.html',
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
export class MySearchComponent implements OnInit {
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

  geoChange$:Observable<PaginatedSearchOptions>;

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

  //gdata: any;
  @ViewChild(GeoSearchPageComponent) geoComponent: GeoSearchPageComponent;

  @ViewChild(DynamicFiltersComponent) dynamicFiltersComponent: DynamicFiltersComponent;
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

  isMapVisible: boolean = false; // Initially hidden
  showHideMapnLabel: string = "Show Map";

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
    console.log("my-search.component.ts: ngOnInit");
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
    console.log("this.searchOptions$ = " + this.searchOptions$);
    var geoquery = '';
    var realSearchTerm = '';
    this.sub = this.searchOptions$.pipe(
      map((options) => {

        let optionsCopy = Object.create(
          Object.getPrototypeOf(options),
          Object.getOwnPropertyDescriptors(options)
        );

        console.log('retrieve geo data');
        var geoquery = this.getGeoData();
        //if (options.geoQuery != undefined )
        if (geoquery != '')
        {
          var query = options.query;
          if (options.query == '')
            optionsCopy.query = geoquery;
          else
            optionsCopy.query =  geoquery + ' ' + options.query;

        }
        else
          optionsCopy.query = options.query;
        //var [lat1,lng1,lat2,lng2] = geodata.split(',');
        //var newquery = 'nrcan.geospatial.bbox:%5B' + lat1 +','+ lng1 + ' TO '+ lat2+ ','+ lng2 + '%5D';
        console.log("geoquery = " + geoquery);
        return optionsCopy;
      }),


      switchMap((optionsCopy) => this.service.search(
          //options, undefined, true, true, followLink<Item>('thumbnail', { isOptional: true })
          optionsCopy, undefined, true, true, followLink<Item>('thumbnail', { isOptional: true })
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


  onGeoChanged(value: string) {
    console.log("###" + value);
    var geoquery = null;
    geoquery  = this.getGeoData();

    var oldValue = this.searchConfigService.paginatedSearchOptions.getValue();
    // oldValue.geoQuery = geoquery;
    this.searchConfigService.paginatedSearchOptions.next(oldValue);

  }

  private getGeoData() {
    var geodata = '';
    var geoquery = '';
    if (this.geoComponent != null && this.geoComponent.getGeoData() != null && this.geoComponent.getGeoData() != '') {
      geodata = this.geoComponent.getGeoData();
      var [lat1, lng1, lat2, lng2] = geodata.split(',');
      //var geoquery = 'nrcan.geospatial.bbox:[' + lat1 +','+ lng1 + ' TO '+ lat2+ ','+ lng2 + ']';
      geoquery = 'geospatial.bbox:[' + lat1 + ',' + lng1 + ' TO ' + lat2 + ',' + lng2 + ']';
      if (lat1 == undefined || lng1 == undefined || lat2 == undefined || lng2 == undefined) {
        geoquery = ''; // reset geoquery
      }
    }
    return geoquery ;
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
      this.dynamicFiltersComponent.printFormValues();
      console.log(this.route)
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: {query: term}, queryParamsHandling: 'merge'})
    }

    toggleMapVisibility(): void {
      this.isMapVisible = !this.isMapVisible;
      if (this.isMapVisible) {
        this.showHideMapnLabel = "Hide Map";
      }else {
        this.showHideMapnLabel = "Show Map";
      }
    }
}


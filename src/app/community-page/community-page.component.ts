import { mergeMap, filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { CommunityDataService } from '../core/data/community-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';

import { Community } from '../core/shared/community.model';

import { MetadataService } from '../core/metadata/metadata.service';

import { fadeInOut } from '../shared/animations/fade';
import { hasValue, isEmpty } from '../shared/empty.util';
import { getAllSucceededRemoteDataPayload, redirectOn4xx } from '../core/shared/operators';
import { AuthService } from '../core/auth/auth.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getCommunityPageRoute } from './community-page-routing-paths';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { SearchResult } from '../shared/search/search-result.model';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { Context } from '../core/shared/context.model';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { SearchService } from '../core/shared/search/search.service';
import { HostWindowService } from '../shared/host-window.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { RouteService } from '../core/services/route.service';
import { currentPath, getScope } from '../shared/utils/route.utils';
import { followLink } from '../shared/utils/follow-link-config.model';
import { Item } from '../core/shared/item.model';
import { getFirstSucceededRemoteData } from '../core/shared/operators';
import { PaginatedList } from '../core/data/paginated-list.model';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-community-page',
  styleUrls: ['./community-page.component.scss'],
  templateUrl: './community-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
/**
 * This component represents a detail page for a single community
 */
export class CommunityPageComponent implements OnInit {
  /**
   * The community displayed on this page
   */
  communityRD$: Observable<RemoteData<Community>>;

  /**
   * Whether the current user is a Community admin
   */
  isCommunityAdmin$: Observable<boolean>;

  /**
   * The logo of this community
   */
  logoRD$: Observable<RemoteData<Bitstream>>;

  /**
   * Route to the community page
   */
  communityPageRoute$: Observable<string>;

  /**
   * The current search results
   */
   resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);

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
   
  /*
   * Flag used to switch display contents between search results to communities list.
   * It is an output from search-form component.
   */
  searchSubmit: any;

  /*
   * current scope of this community page. It is passed to the search form and
   * it can be changed by user selecting a scope in the search form.
   */
  currentScope: string;

   constructor(
    private communityDataService: CommunityDataService,
    private metadata: MetadataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authorizationDataService: AuthorizationDataService,
    protected service: SearchService,
    protected sidebarService: SidebarService,
    protected windowService: HostWindowService,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
    protected routeService: RouteService,
    public translate: TranslateService
  ) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();

  }

  ngOnInit(): void {
    // console.log("currentLang: " + this.translate.currentLang);
    this.communityRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService)
    );
    this.logoRD$ = this.communityRD$.pipe(
      map((rd: RemoteData<Community>) => rd.payload),
      filter((community: Community) => hasValue(community)),
      mergeMap((community: Community) => community.logo));
    this.communityPageRoute$ = this.communityRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((community) => getCommunityPageRoute(community.id))
    );
    this.isCommunityAdmin$ = this.authorizationDataService.isAuthorized(FeatureID.IsCommunityAdmin);

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

    /*
     * Observe query parameter's change. When the url has no query parameter, 
     * switch display contents from search results to community page.
     */
    this.route.queryParams.subscribe(qparams => {
      if(typeof qparams === 'undefined' || qparams === null || 
         typeof qparams['spc.sf'] === 'undefined' || qparams['spc.sf'] === null)
          this.initParams()
    });

    /*
     * Observe the community page route change, i.e. user clicked a sub-community 
     * in the community page.
     */
    this.communityPageRoute$.subscribe(communityRoute => {
      const newScope = getScope(communityRoute);
      if(newScope != this.currentScope){
        this.currentScope = newScope;
        this.initParams();
      }
    });

    this.initParams();
  }

  initParams() {
    this.scopeListRD$ = this.searchConfigService.getCurrentScope(this.currentScope).pipe(
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

  /*
   * Change display between communities list and search results based on 
   * the query field of the search form.
   */
  onSeachSubmit(newSearchEvent : any) {
    if (isEmpty(newSearchEvent['query'])) {
      this.searchSubmit = null;
    } else {
      this.searchSubmit = newSearchEvent;
    }
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
    this.searchSubmit = null;

  }

}

import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { SearchService } from '../../../core/shared/search/search.service';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchFilterConfig } from '../search-filter-config.model';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { currentPath } from '../../utils/route.utils';
import { Router } from '@angular/router';
import { hasValue } from '../../empty.util';
import { RouteService } from '../../../core/services/route.service';

@Component({
  selector: 'ds-search-filters',
  styleUrls: ['./search-filters.component.scss'],
  templateUrl: './search-filters.component.html',

})

/**
 * This component represents the part of the search sidebar that contains filters.
 */
export class SearchFiltersComponent implements OnInit, OnDestroy {
  /**
   * An observable containing configuration about which filters are shown and how they are shown
   */
  filters: Observable<RemoteData<SearchFilterConfig[]>>;

  /**
   * List of all filters that are currently active with their value set to null.
   * Used to reset all filters at once
   */
  clearParams;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: Observable<any>;

  /**
   * Use gcweb template
   */
  @Input() useGcWeb = false;

  /**
   * Link to the search page
   */
  searchLink: string;

  subs = [];
  currentFilterOptions :any;

  /**
   * Initialize instance variables
   * @param {SearchService} searchService
   * @param {SearchConfigurationService} searchConfigService
   * @param {SearchFilterService} filterService
   */
  constructor(
    private searchService: SearchService,
    private filterService: SearchFilterService,
    private router: Router,
    @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService,
    private routeService :RouteService) {
  }

  ngOnInit(): void {

    this.initFilters();

    if (this.refreshFilters) {
      this.subs.push(this.refreshFilters.subscribe(() => this.initFilters()));
    }

    this.clearParams = this.searchConfigService.getCurrentFrontendFilters().pipe(map((filters) => {
      Object.keys(filters).forEach((f) => filters[f] = null);
      return filters;
    }));
    this.searchLink = this.getSearchLink();
  }

  initFilters() {
    if (this.routeService.checkForReset()) {
        // FORSC change to apply filter on button click;
      this.filterService.selectedFilterOptions$.next([]);
    }
    this.filters = this.searchConfigService.searchOptions.pipe(
      switchMap((options) => this.searchService.getConfig(options.scope, options.configuration).pipe(getFirstSucceededRemoteData())),
    );
  }

  applyFilter(): void {
    // FORSC change to apply filter on button click;
    const allfilters = this.filterService.getSelectedFilters();

    if (allfilters) {
      Object.keys(allfilters).forEach(key => {
        if (key.indexOf('f.')> -1) {
          //checking for unique filters
          allfilters[key] = allfilters[key]?.filter((ele, index) => allfilters[key]?.indexOf(ele) == index );
        }
      });
      this.router.navigate([this.searchLink], {queryParamsHandling : 'merge', queryParams: allfilters});
    }
  }

  resetFilter() {
    // passing empty array to set selected filters empty
    this.filterService.selectedFilterOptions$.next([]);
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * Prevent unnecessary rerendering
   */
  trackUpdate(index, config: SearchFilterConfig) {
    return config ? config.name : undefined;
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      if (hasValue(sub)) {
        sub.unsubscribe();
      }
    });
  }
}

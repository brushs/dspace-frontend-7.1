import { combineLatest as observableCombineLatest, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { FilterType } from '../../../filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { SearchFilterConfig } from '../../../search-filter-config.model';
import { FILTER_CONFIG, IN_PLACE_SEARCH, SearchFilterService, USE_GC_WEB } from '../../../../../core/shared/search/search-filter.service';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { RouteService } from '../../../../../core/services/route.service';
import { hasValue } from '../../../../empty.util';
import * as e from 'express';

/**
 * The suffix for a range filters' minimum in the frontend URL
 */
export const RANGE_FILTER_MIN_SUFFIX = '.min';

/**
 * The suffix for a range filters' maximum in the frontend URL
 */
export const RANGE_FILTER_MAX_SUFFIX = '.max';

/**
 * The date formats that are possible to appear in a date filter
 */
const dateFormats = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'];

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-search-range-filter',
  styleUrls: ['./search-range-filter.component.scss'],
  templateUrl: './search-range-filter.component.html',
  animations: [facetLoad]
})

/**
 * Component that represents a range facet for a specific filter configuration
 */
@renderFacetFor(FilterType.range)
export class SearchRangeFilterComponent extends SearchFacetFilterComponent implements OnInit, OnDestroy {
  /**
   * Fallback minimum for the range
   */
  min_limit = 1000;

  /**
   * Fallback maximum for the range
   */
  max_limit = new Date().getUTCFullYear();

  /**
   * The current range of the filter
   */
  range = [];

  /**
   * Subscription to unsubscribe from
   */
  sub: Subscription;

  /**
   * Whether the sider is being controlled by the keyboard.
   * Supresses any changes until the key is released.
   */
  keyboardControl: boolean;

  endDateError: boolean;

  startDateError: boolean;

  startDateRangeError: boolean;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected router: Router,
              protected rdbs: RemoteDataBuildService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              @Inject(IN_PLACE_SEARCH) public inPlaceSearch: boolean,
              @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig,
              @Inject(PLATFORM_ID) private platformId: any,
              private route: RouteService,
              @Inject(USE_GC_WEB) public useGcWeb: any,
              ) {
    super(searchService, filterService, rdbs, router, searchConfigService, inPlaceSearch, filterConfig);
  }

  /**
   * Initialize with the min_limit and max_limit values as configured in the filter configuration
   * Set the initial values of the range
   */
  ngOnInit(): void {
    super.ngOnInit();
    //this.range[0] = new Number(this.min_limit).toString();
    //this.range[1] = new Number(this.max_limit).toString();
    this.min_limit = moment(this.filterConfig.minValue, dateFormats).year() || this.min_limit;
    this.max_limit = moment(this.filterConfig.maxValue, dateFormats).year() || this.max_limit;
    const iniMin = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX).pipe(startWith(undefined));
    const iniMax = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX).pipe(startWith(undefined));
    this.sub = observableCombineLatest(iniMin, iniMax).pipe(
      map(([min_limit, max_limit]) => {
        const minimum = hasValue(min_limit) ? min_limit : this.min_limit;
        const maximum = hasValue(max_limit) ? max_limit : this.max_limit;
        return [minimum, maximum];
      })
    ).subscribe((minmax) => this.range = minmax);

    this.filterService.selectedFilterOptions$.subscribe(data =>{
      if(data && data.length === 0){
        this.startDateError = false;
        this.startDateRangeError = false;
        this.endDateError = false;
        this.range[0] = this.min_limit;
        this.range[1] = this.max_limit;
      }
    })
  }

  validateAndSubmit() {

    var newMin = new Number(this.range[0] <= this.min_limit ? new Number(this.min_limit) : this.range[0]);
    //this.range[0] = newMin;
    var newMax = new Number(this.range[1] >= this.max_limit ? new Number(this.max_limit) : this.range[1]);
    //this.range[1] = newMax;

    if(isNaN(newMin.valueOf()) || isNaN(this.range[0]) || this.range[0] < this.min_limit) {
      // add error label on top of start date field
      this.startDateError = true;
    } else {
      this.startDateError = false;
    }

    if(newMin > this.max_limit) {
      // add error label on top of start date field
      this.startDateRangeError = true;
    } else {
      this.startDateRangeError = false;
    }

    if(!(this.startDateError || this.startDateRangeError) && (isNaN(newMax.valueOf()) || isNaN(this.range[1]) || newMax < newMin || this.range[1] > this.max_limit)) {
      // add error label on top of end date field
      this.endDateError = true;
    } else {
      this.endDateError = false;
    }

    if(!this.startDateError && !this.startDateRangeError && !this.endDateError) {
      this.onSubmit();
    }
  }

  /**
   * Submits new custom range values to the range filter from the widget
   */
  onSubmit() {
    if (this.keyboardControl) {
      return;  // don't submit if a key is being held down
    }

    var newMin = new Number(this.range[0] <= this.min_limit ? new Number(this.min_limit) : this.range[0]);
    var newMax = new Number(this.range[1] >= this.max_limit ? new Number(this.max_limit) : this.range[1]);

    // this.router.navigate(this.getSearchLinkParts(), {
    //   queryParams:
    //     {
    //       [this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX]: newMin,
    //       [this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX]: newMax
    //     },
    //   queryParamsHandling: 'merge'
    // });

    // FORSC Changes for apply filter
    const filterSelections = this.filterService.getSelectedFilters() ?? [];

    const dateFilters = {};
    if (newMin !== null) {
      dateFilters[this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX] = [newMin];
    }

    if (newMax !== null) {
      dateFilters[this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX] = [newMax];
    }

    const modifiedFilters = { ...filterSelections, ...dateFilters };
    this.filterService.selectedFilterOptions$.next(modifiedFilters);

    this.filter = '';
  }

  startKeyboardControl(): void {
    this.keyboardControl = true;
  }

  stopKeyboardControl(): void {
    this.keyboardControl = false;
  }

  /**
   * TODO when upgrading nouislider, verify that this check is still needed.
   * Prevents AoT bug
   * @returns {boolean} True if the platformId is a platform browser
   */
  shouldShowSlider(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}

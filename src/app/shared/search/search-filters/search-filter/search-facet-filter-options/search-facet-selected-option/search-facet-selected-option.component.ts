import { combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchFilterConfig } from '../../../../search-filter-config.model';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { SearchFilterService } from '../../../../../../core/shared/search/search-filter.service';
import { hasValue } from '../../../../../empty.util';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { FacetValue } from '../../../../facet-value.model';
import { currentPath } from '../../../../../utils/route.utils';
import { getFacetValueForType } from '../../../../search.utils';
import { PaginationService } from '../../../../../../core/pagination/pagination.service';

@Component({
  selector: 'ds-search-facet-selected-option',
  styleUrls: ['./search-facet-selected-option.component.scss'],
  templateUrl: './search-facet-selected-option.component.html',
})

/**
 * Represents a single selected option in a filter facet
 */
export class SearchFacetSelectedOptionComponent implements OnInit, OnDestroy {
  /**
   * The value for this component
   */
  @Input() selectedValue: FacetValue;

  /**
   * The filter configuration for this facet option
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * Emits the active values for this filter
   */
  @Input() selectedValues$: Observable<FacetValue[]>;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Use GC Web Template
   */
  @Input() useGcWeb = false;

  /**
   * Name of facet
   */
  @Input() facetTerm;

  /**
   * UI parameters when this filter is removed
   */
  removeQueryParams;

  /**
   * Subscription to unsubscribe from on destroy
   */
  sub: Subscription;

  /**
   * Link to the search page
   */
  searchLink: string;

  addQueryParams;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              private searchConfigService: SearchConfigurationService,
              protected router: Router,
              protected paginationService: PaginationService
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.sub = observableCombineLatest(this.selectedValues$, this.searchConfigService.searchOptions)
      .subscribe(([selectedValues, searchOptions]) => {
        this.updateRemoveParams(selectedValues);
      });
    this.searchLink = this.getSearchLink();
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  private getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * Calculates the parameters that should change if a given value for this filter would be removed from the active filters
   * @param {string[]} selectedValues The values that are currently selected for this filter
   */
  private updateRemoveParams(selectedValues: FacetValue[]): void {
    const page = this.paginationService.getPageParam(this.searchConfigService.paginationID);
    this.removeQueryParams = {
      [this.filterConfig.paramName]: selectedValues
        .filter((facetValue: FacetValue) => facetValue.label !== this.selectedValue.label)
        .map((facetValue: FacetValue) => this.getFacetValue(facetValue)),
      [page]: 1
    };
  }
  /**
   * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
   * Retrieve facet value related to facet type
   */
  private getFacetValue(facetValue: FacetValue): string {
    return getFacetValueForType(facetValue, this.filterConfig);
  }

  /**
   * Make sure the subscription is unsubscribed from when this component is destroyed
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

  // FORSC Changes
  private generateAddParams(selectedValues: FacetValue): void {
    const page = this.paginationService.getPageParam(this.searchConfigService.paginationID);
    this.addQueryParams = {
      [this.filterConfig.paramName]: [this.getFacetValue(selectedValues)],
      [page]: 1
    };
  }

  onSelect(event: any, facetValue: any, facetName: string) {
    // this.router.navigate([this.searchLink], { queryParams: this.removeQueryParams, queryParamsHandling: 'merge' })

    // FORSC Changes
    this.filterConfig.name = facetName;
    const filterSelections = this.filterService.getSelectedFilters() ?? [];
    const modifiedFilters = { ...filterSelections };
    const isChecked = event.target.checked;
    this.updateRemoveParams([facetValue]);
    if (isChecked) {
      this.generateAddParams(facetValue);
      Object.keys(filterSelections).forEach(key =>{
        if(key.indexOf('f.')> -1)
        {
          if (this.addQueryParams[key]) {
            this.addQueryParams[key] =[... modifiedFilters[key] , ... this.addQueryParams[key]];
          }
          else {
            if(modifiedFilters[key]) {
              this.addQueryParams[key] = [...modifiedFilters[key]];
            }
          }
        }
      })
      this.filterService.selectedFilterOptions$.next(this.addQueryParams);
    }
    else {
      if (modifiedFilters) {
        Object.keys(modifiedFilters).forEach(key => {
          if (key === `f.${facetName}` && key.indexOf('f.') > -1) {
            modifiedFilters[key] = modifiedFilters[key].filter(item => {
              if (facetValue.value.includes('equals')) {
                return !item.includes(facetValue.value);
              } else {
                return item !== facetValue.value && !item.includes(`${facetValue.value},equals`);
              }
            });
          }
        });
        this.filterService.selectedFilterOptions$.next(modifiedFilters);
      }
    }
  }

   formatID(value) {
    return value
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9 ,]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .join('-')
    .toLowerCase();
   }
}

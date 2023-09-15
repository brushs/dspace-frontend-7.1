import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { SearchFilter } from './comcol-search-filter.model';
import { isNotEmpty } from '../empty.util';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from '../../core/shared/search/search.service';
import { currentPath } from '../utils/route.utils';
import { PaginationService } from '../../core/pagination/pagination.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';

@Component({
  selector: 'ds-comcol-search-filter',
  templateUrl: './comcol-search-filter.component.html',
  styleUrls: [
    '../../../themes/wetoverlay/styles/static-pages.scss', 
    './comcol-search-filter.component.scss'
  ]
})
export class ComcolSearchFilterComponent implements OnInit, OnDestroy {

  /**
   * Array of search filters
   */
  searchFilters: Array<SearchFilter>;

  /**
   * The search query
   */
  @Input() query: string;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * The currently selected scope object's UUID
   */
  @Input()
  scope = '';

  /**
   * Output the scope on scope change
   */
  @Output() scopeChange = new EventEmitter<any>();

  /**
   * Output the search data on submit
   */
  @Output() submitSearch = new EventEmitter<any>();

  constructor(
    private router: Router, 
    private searchService: SearchService,
    private paginationService: PaginationService,
    private searchConfig: SearchConfigurationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.searchFilters = [];

    const titleFilterQueryParam: string = this.route.snapshot.queryParamMap.get('f.title');
    if(titleFilterQueryParam){
      let titleFilterQueryParamSegments = titleFilterQueryParam.split(",");
      let filterItemInfo: any = titleFilterQueryParamSegments[0];
      let filterOperator: any = titleFilterQueryParamSegments.pop();
      this.searchFilters.push(new SearchFilter("title", filterOperator, filterItemInfo));
    };

    const authorFilterQueryParam: string = this.route.snapshot.queryParamMap.get('f.author');
    if(authorFilterQueryParam){
      let authorFilterQueryParamSegments = authorFilterQueryParam.split(",");
      let filterItemInfo: any = authorFilterQueryParamSegments[0];
      let filterOperator: any = authorFilterQueryParamSegments.pop();
      this.searchFilters.push(new SearchFilter("author", filterOperator, filterItemInfo));
    };

    const subjectFilterQueryParam: string = this.route.snapshot.queryParamMap.get('f.subject');
    if(subjectFilterQueryParam){
      let subjectFilterQueryParamSegments = subjectFilterQueryParam.split(",");
      let filterItemInfo: any = subjectFilterQueryParamSegments[0];
      let filterOperator: any = subjectFilterQueryParamSegments.pop();
      this.searchFilters.push(new SearchFilter("subject", filterOperator, filterItemInfo));
    };

    const dateIssuedFilterQueryParam: string = this.route.snapshot.queryParamMap.get('f.dateIssued');
    if(dateIssuedFilterQueryParam){
      let dateIssuedFilterQueryParamSegments = dateIssuedFilterQueryParam.split(",");
      let filterItemInfo: any = dateIssuedFilterQueryParamSegments[0];
      let filterOperator: any = dateIssuedFilterQueryParamSegments.pop();
      this.searchFilters.push(new SearchFilter("dateIssued", filterOperator, filterItemInfo));
    };

    if(this.searchFilters.length == 0){
      this.searchFilters.push(new SearchFilter("", "", ""));
    };

    //Fix OSPR issue 264: keep the page in search result when changing language.
    if(typeof this.query !== 'undefined' && isNotEmpty(this.query)){
      this.submitSearch.emit({query: this.query});
    }
    if(isNotEmpty(this.scope)) {
      this.onScopeChange(this.scope);
    }

  }

  addFilter(){
    this.searchFilters.push(new SearchFilter("", "", ""));
  }

  removeFilter(index: number){
    this.searchFilters.splice(index, 1);
    if(this.searchFilters.length == 0){
      this.searchFilters.push(new SearchFilter("", "", ""));
    };
    this.removeFilterQueryParamters();
  }

  resetFilters(){
    this.searchFilters.splice(0);
    if(this.searchFilters.length == 0){
      this.searchFilters.push(new SearchFilter("", "", ""));
    };
    this.removeFilterQueryParamters();
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
   */
  public getSearchLinkParts(): string[] {
    if (this.inPlaceSearch) {
      return [];
    }
    return this.getSearchLink().split('/');
  }

  generateQueryParamsFromSearchFilters(){
    let generatedQueryParams = {};

    let validSearchFiltersArray = this.searchFilters.filter((searchFilterElem) => {
      return searchFilterElem["filterItem"]
        && searchFilterElem["filterOperator"]
        && searchFilterElem["filterItemInfo"];
    });

    validSearchFiltersArray.forEach((searchFilterElem) => {
      let newKey, newValue;
      newKey = `f.${searchFilterElem["filterItem"]}`;
      newValue = searchFilterElem["filterItemInfo"];
      newValue = newValue + `,${searchFilterElem["filterOperator"]}`;
      generatedQueryParams[newKey] = newValue;
    })

    return generatedQueryParams;
  }

  filterItemExists(filterItem: string){
    let filterItemExists = this.searchFilters.findIndex((searchFilter) => {
      return searchFilter.filterItem === filterItem;
    });
    return filterItemExists !== -1;
  }

  /**
   * Updates the search URL
   * @param data Updated parameters
   */
  updateSearch(data: any) {
    const queryParams =  Object.assign({}, data);
    const pageParam = this.paginationService.getPageParam(this.searchConfig.paginationID);
    queryParams[pageParam] = 1;
    
    return this.router.navigate(this.getSearchLinkParts(), {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    })
    .then(() => {
      delete queryParams[pageParam];
      return this.paginationService.updateRouteWithUrl(this.searchConfig.paginationID, this.getSearchLinkParts(), { page: 1 }, queryParams);
    })
    .then(() => {
      this.submitSearch.emit({query: this.query});
    });
    
  }

  removeFilterQueryParamters(){
    let generatedQueryParams = this.generateQueryParamsFromSearchFilters();
    let generatedQueryParamsKeys = Object.keys(generatedQueryParams);
    let queryParametersToRemoveKeys = ["f.title", "f.author", "f.subject", "f.dateIssued"].filter((queryParam) => {
      return !generatedQueryParamsKeys.includes(queryParam);
    });
    let queryParametersToRemove = {};
    queryParametersToRemoveKeys.forEach((queryParamKey) => {
      queryParametersToRemove[queryParamKey] = [];
    });
    const queryParams =  Object.assign({}, {"query": this.query, "scope": this.scope, ...generatedQueryParamsKeys, ...queryParametersToRemove});
    const pageParam = this.paginationService.getPageParam(this.searchConfig.paginationID);
    queryParams[pageParam] = 1;

    return this.router.navigate(this.getSearchLinkParts(), {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
    .then(() => {
      this.submitSearch.emit({query: this.query});
    });
    
  }

  /**
   * Updates the search when the form is submitted
   * @param data Values submitted using the form
   */
  onSubmit(data: any) {
    this.removeFilterQueryParamters()
    .then(() => {
      return this.updateSearch(this.generateQueryParamsFromSearchFilters());
    })
    .catch((error) => {
      console.log(error);
    });
  }

  /**
   * Updates the search when the current scope has been changed
   * @param {string} scope The new scope
   */
  onScopeChange(scope: string) {
    this.updateSearch({ scope });
    this.scope = scope;

    //scopeChange emit currently not picked up by community page component;
    // may not be useful
    this.scopeChange.emit(scope);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
  }

}

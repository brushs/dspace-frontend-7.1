import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Router } from '@angular/router';
import { isNotEmpty } from '../empty.util';
import { SearchService } from '../../core/shared/search/search.service';
import { currentPath } from '../utils/route.utils';
import { PaginationService } from '../../core/pagination/pagination.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html'
})

/**
 * Component that represents the search form
 */
export class SearchFormComponent implements OnInit {
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

  @Input() currentUrl: string;

  /**
   * The available scopes
   */
  @Input() scopes: DSpaceObject[];

  /**
   * Whether or not the search button should be displayed large
   */
  @Input() large = false;

  /**
   * The brand color of the search button
   */
  @Input() brandColor = 'primary';

  /**
   * The placeholder of the search input
   */
  @Input() searchPlaceholder: string;

  /**
   * Output the search data on submit
   */
  @Output() submitSearch = new EventEmitter<any>();

  constructor(private router: Router, private searchService: SearchService,
              private paginationService: PaginationService,
              private searchConfig: SearchConfigurationService
              ) {
  }

  ngOnInit(): void {
    //Fix OSPR issue 264: keep the page in search result when changing language.
    if(typeof this.query !== 'undefined' && isNotEmpty(this.query)){
      this.submitSearch.emit({query: this.query});
    }
    if(isNotEmpty(this.scope)) {
      this.onScopeChange(this.scope);
    }
  }

  /**
   * Updates the search when the form is submitted
   * @param data Values submitted using the form
   */
  onSubmit(data: any) {
    this.updateSearch(data);
    this.submitSearch.emit(data);
  }

  /**
   * Updates the search when the current scope has been changed
   * @param {string} scope The new scope
   */
  onScopeChange(scope: string) {
    this.updateSearch({ scope });
    this.scope = scope;
    this.scopeChange.emit(scope);
  }

  /**
   * Updates the search URL
   * @param data Updated parameters
   */
  updateSearch(data: any) {
      const queryParams =  Object.assign({}, data);
      const pageParam = this.paginationService.getPageParam(this.searchConfig.paginationID);
      queryParams[pageParam] = 1;

      this.router.navigate(this.getSearchLinkParts(), {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
    this.paginationService.updateRouteWithUrl(this.searchConfig.paginationID, this.getSearchLinkParts(), { page: 1 }, data);
  }

  /**
   * For usage of the isNotEmpty function in the template
   */
  isNotEmpty(object: any) {
    return isNotEmpty(object);
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
}

import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { fadeIn } from '../../shared/animations/fade';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchResult } from '../../shared/search/search-result.model';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'gc-search-result',
  templateUrl: './search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
})

/**
 * This component renders a sidebar, a search input bar and the search results.
 */
export class GCSearchResultComponent implements OnInit {

  @Input() searchResult: SearchResult<DSpaceObject>;

  dso: DSpaceObject;
  itemLink: string;
  constructor(){
  }

  ngOnInit(): void {
    this.dso = this.searchResult.indexableObject;
    this.itemLink = getItemPageRoute(<Item>this.searchResult.indexableObject);
  }
}

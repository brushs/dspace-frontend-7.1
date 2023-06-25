import { Component, Input } from "@angular/core";
import { SearchFilterComponent } from "../../../shared/search/search-filters/search-filter/search-filter.component";


@Component({
  selector: 'gc-search-filter',
  templateUrl: './search-filter.component.html',
  // styleUrls: ['../../../themes/wetoverlay/styles/static-pages.scss'],
})

/**
 * This component renders a sidebar, a search input bar and the search results.
 */
export class GCFilterComponent extends SearchFilterComponent {

  @Input() open: boolean = false;
}

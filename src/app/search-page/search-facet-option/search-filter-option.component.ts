import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { fadeIn } from '../../shared/animations/fade';
import { SearchLabelComponent } from '../../shared/search/search-labels/search-label/search-label.component';

@Component({
  selector: 'gc-search-facet-option',
  templateUrl: './search-filter-option.component.html',
  // styleUrls: ['../../../themes/wetoverlay/styles/static-pages.scss'],
})

/**
 * This component renders a sidebar, a search input bar and the search results.
 */
export class GCSearchLabelComponent extends SearchLabelComponent {
}

@Component({
  selector: 'gc-search-facet-selected-option',
  templateUrl: './search-filter-option-selected.component.html',
  // styleUrls: ['../../../themes/wetoverlay/styles/static-pages.scss'],
})

/**
 * This component renders a sidebar, a search input bar and the search results.
 */
export class GCSearchSelectedOptionComponent extends SearchLabelComponent {
}

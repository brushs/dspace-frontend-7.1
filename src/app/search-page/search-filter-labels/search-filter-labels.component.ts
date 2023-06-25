import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { fadeIn } from '../../shared/animations/fade';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchResult } from '../../shared/search/search-result.model';
import { SearchLabelsComponent } from '../../shared/search/search-labels/search-labels.component';
import { Router } from '@angular/router';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';

@Component({
  selector: 'gc-search-labels',
  templateUrl: './search-filter-labels.component.html',
  // styleUrls: ['../../../themes/wetoverlay/styles/static-pages.scss'],
})

/**
 * This component renders a sidebar, a search input bar and the search results.
 */
export class GCSearchLabelsComponent extends SearchLabelsComponent {}

import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../app/my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../app/core/shared/search/search-configuration.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'ds-advanced-search-page',
  // styleUrls: ['./search-page.component.scss'],
  templateUrl: './advanced-search-page.component.html',
  //templateUrl: '../../../../app/search-page/search-page.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

/**
 * This component represents the whole search page
 * It renders search results depending on the current search options
 */
export class AdvancedSearchPageComponent implements OnInit {
  constructor(private titleService: Title) {}
  ngOnInit() {
    this.titleService.setTitle('Advanced Search');
  }
}

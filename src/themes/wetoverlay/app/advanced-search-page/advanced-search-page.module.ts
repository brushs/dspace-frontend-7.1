import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../../app/core/core.module';
import { SharedModule } from '../../../../app/shared/shared.module';
import { SearchComponent } from '../../../../app/search-page/search.component';
import { SidebarService } from '../../../../app/shared/sidebar/sidebar.service';
import { ConfigurationSearchPageGuard } from '../../../../app/search-page/configuration-search-page.guard';
import { SearchTrackerComponent } from '../../../../app/search-page/search-tracker.component';
//import { StatisticsModule } from '../statistics/statistics.module';
//import { SearchPageComponent } from './search-page.component';
//import { SidebarFilterService } from '../shared/sidebar/filter/sidebar-filter.service';
import { SearchFilterService } from '../../../../app/core/shared/search/search-filter.service';
import { SearchConfigurationService } from '../../../../app/core/shared/search/search-configuration.service';
//import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
//import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
//import { ThemedSearchPageComponent } from './themed-search-page.component';
import { AdvancedSearchPageComponent } from './advanced-search-page.component';
import { MyThemedSearchComponent } from './mythemed-search.component';
import { MySearchComponent } from './my-search-component/my-search.component';
import { GeoSearchPageComponent } from '../geo-search-page/geo-search-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DynamicFiltersComponent } from './dynamic-filters/dynamic-filters.component';

const components = [
  //SearchPageComponent,
  //SearchComponent,
  AdvancedSearchPageComponent,
  MyThemedSearchComponent,
  MySearchComponent,
  GeoSearchPageComponent,
  DynamicFiltersComponent
  //SearchTrackerComponent,
  //ThemedSearchPageComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    CoreModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    //StatisticsModule.forRoot(),
    //JournalEntitiesModule.withEntryComponents(),
    //ResearchEntitiesModule.withEntryComponents()
  ],
  declarations: components,
  providers: [
    SidebarService,
    //SidebarFilterService,
    SearchFilterService,
    ConfigurationSearchPageGuard,
    SearchConfigurationService,
  ],
  exports: components,
})

/**
 * This module handles all components and pipes that are necessary for the search page
 */
export class AdvancedSearchPageModule {}

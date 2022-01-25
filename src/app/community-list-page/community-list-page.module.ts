import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommunityListPageComponent } from './community-list-page.component';
import { CommunityListPageRoutingModule } from './community-list-page.routing.module';
import { CommunityListComponent } from './community-list/community-list.component';
import { ThemedCommunityListPageComponent } from './themed-community-list-page.component';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { ConfigurationSearchPageGuard } from '../search-page/configuration-search-page.guard';
import { SidebarFilterService } from '../shared/sidebar/filter/sidebar-filter.service';
import { SearchFilterService } from '../core/shared/search/search-filter.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { SearchService } from '../core/shared/search/search.service';
import { HostWindowService } from '../shared/host-window.service';
import { RouteService } from '../core/services/route.service';



const DECLARATIONS = [
  CommunityListPageComponent,
  CommunityListComponent,
  ThemedCommunityListPageComponent
];
/**
 * The page which houses a title and the community list, as described in community-list.component
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CommunityListPageRoutingModule
  ],
  declarations: [
    ...DECLARATIONS
  ],
  providers: [
//    SidebarService,
//    SidebarFilterService,
//    SearchFilterService,
//    ConfigurationSearchPageGuard,
//    SearchService,
//    HostWindowService,
//    RouteService,
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ],
  exports: [
    ...DECLARATIONS,
  ],
})
export class CommunityListPageModule {

}

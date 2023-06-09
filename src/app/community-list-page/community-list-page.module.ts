import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommunityListPageComponent } from './community-list-page.component';
import { CommunityListPageRoutingModule } from './community-list-page.routing.module';
import { CommunityListComponent } from './community-list/community-list.component';
import { ThemedCommunityListPageComponent } from './themed-community-list-page.component';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';


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

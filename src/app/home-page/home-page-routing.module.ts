import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomePageResolver } from './home-page.resolver';
import { MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedHomePageComponent } from './themed-home-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedHomePageComponent,
        pathMatch: 'full',
        data: {
          // title: 'home.title',
          titleOverride: 'Federal Open Science Repository of Canada (FOSRC) / Le Dépôt fédéral de science ouverte du Canada (DFSOC)',
          menu: {
            public: [],
          },
        },
        resolve: {
          site: HomePageResolver
        }
      }
    ])
  ],
  providers: [
    HomePageResolver
  ]
})
export class HomePageRoutingModule {
}

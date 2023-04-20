import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { ThemedLogoutPageComponent } from './themed-logout-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard],
        path: '',
        component: ThemedLogoutPageComponent,
        resolve:  { breadcrumb: I18nBreadcrumbResolver },
        data: { title: 'logout.title', breadcrumbKey: 'logout' }
      }
    ])
  ],
  providers : [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService
  ]
})
export class LogoutPageRoutingModule { }

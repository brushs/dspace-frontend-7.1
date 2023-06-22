import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthBlockingGuard } from './core/auth/auth-blocking.guard';

import { AuthenticatedGuard } from './core/auth/authenticated.guard';
import { SiteAdministratorGuard } from './core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import {
  ACCESS_CONTROL_MODULE_PATH,
  ADMIN_MODULE_PATH,
  BITSTREAM_MODULE_PATH,
  FORBIDDEN_PATH,
  FORGOT_PASSWORD_PATH,
  INFO_MODULE_PATH,
  PROFILE_MODULE_PATH,
  REGISTER_PATH,
  WORKFLOW_ITEM_MODULE_PATH,
  LEGACY_BITSTREAM_MODULE_PATH,
} from './app-routing-paths';
import { COLLECTION_MODULE_PATH } from './collection-page/collection-page-routing-paths';
import { COMMUNITY_MODULE_PATH } from './community-page/community-page-routing-paths';
import { ITEM_MODULE_PATH } from './item-page/item-page-routing-paths';
import { PROCESS_MODULE_PATH } from './process-page/process-page-routing.paths';
import { ReloadGuard } from './core/reload/reload.guard';
import { EndUserAgreementCurrentUserGuard } from './core/end-user-agreement/end-user-agreement-current-user.guard';
import { SiteRegisterGuard } from './core/data/feature-authorization/feature-authorization-guard/site-register.guard';
import { ThemedPageNotFoundComponent } from './pagenotfound/themed-pagenotfound.component';
import { ThemedForbiddenComponent } from './forbidden/themed-forbidden.component';
import { GroupAdministratorGuard } from './core/data/feature-authorization/feature-authorization-guard/group-administrator.guard';
import { SearchTipsPageComponent } from '../themes/wetoverlay/app/search-tips-page/search-tips-page.component';

@NgModule({
  imports: [
    RouterModule.forRoot([{
      path: '', canActivate: [AuthBlockingGuard],
        children: [
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          // Start FOSRC Changes- 1386
          // Remove 'End User Agreement'
          { path: 'info/end-user-agreement', redirectTo:'404', pathMatch: 'full' },
          // End of FOSRC changes
          { path: 'reload/:rnd', component: ThemedPageNotFoundComponent, pathMatch: 'full', canActivate: [ReloadGuard] },
          {
            path: 'home',
            loadChildren: () => import('./home-page/home-page.module')
              .then((m) => m.HomePageModule),
            data: { showBreadcrumbs: false },
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'about-us',
            loadChildren: () => import('./about-us-page/about-us-page.module')
              .then((m) => m.AboutUsPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'a-propos',
            loadChildren: () => import('./about-us-page/about-us-page.module')
              .then((m) => m.AboutUsPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'policies-and-standards',
            loadChildren: () => import('./policies-and-standards-page/policies-and-standards-page.module')
              .then((m) => m.PoliciesAndStandardsPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'politiques-et-normes',
            loadChildren: () => import('./policies-and-standards-page/policies-and-standards-page.module')
              .then((m) => m.PoliciesAndStandardsPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'contact-us',
            loadChildren: () => import('./contact-us-page/contact-us-page.module')
              .then((m) => m.ContactUsPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'contactez-nous',
            loadChildren: () => import('./contact-us-page/contact-us-page.module')
              .then((m) => m.ContactUsPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          { path: 'tips-for-searching', pathMatch: 'full', component: SearchTipsPageComponent },
          {
            path: 'community-list',
            loadChildren: () => import('./community-list-page/community-list-page.module')
              .then((m) => m.CommunityListPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'liste-des-communautés',
            loadChildren: () => import('./community-list-page/community-list-page.module')
              .then((m) => m.CommunityListPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'id',
            loadChildren: () => import('./lookup-by-id/lookup-by-id.module')
              .then((m) => m.LookupIdModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'handle',
            loadChildren: () => import('./lookup-by-id/lookup-by-id.module')
              .then((m) => m.LookupIdModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          // Start FOSRC Changes- 1396 
          // note: path array oder matters
          // register-page.module need to load below
          {
            path: REGISTER_PATH, component: ThemedPageNotFoundComponent
          },
          // End of FOSRC changes
          {
            path: REGISTER_PATH,
            loadChildren: () => import('./register-page/register-page.module')
              .then((m) => m.RegisterPageModule),
            canActivate: [SiteRegisterGuard]
          },         
          {
            path: FORGOT_PASSWORD_PATH,
            loadChildren: () => import('./forgot-password/forgot-password.module')
              .then((m) => m.ForgotPasswordModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: COMMUNITY_MODULE_PATH,
            loadChildren: () => import('./community-page/community-page.module')
              .then((m) => m.CommunityPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: COLLECTION_MODULE_PATH,
            loadChildren: () => import('./collection-page/collection-page.module')
              .then((m) => m.CollectionPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: ITEM_MODULE_PATH,
            loadChildren: () => import('./item-page/item-page.module')
              .then((m) => m.ItemPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          { path: 'entities/:entity-type',
            loadChildren: () => import('./item-page/item-page.module')
              .then((m) => m.ItemPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: LEGACY_BITSTREAM_MODULE_PATH,
            loadChildren: () => import('./bitstream-page/bitstream-page.module')
              .then((m) => m.BitstreamPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: BITSTREAM_MODULE_PATH,
            loadChildren: () => import('./bitstream-page/bitstream-page.module')
              .then((m) => m.BitstreamPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'mydspace',
            loadChildren: () => import('./my-dspace-page/my-dspace-page.module')
              .then((m) => m.MyDSpacePageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'search',
            loadChildren: () => import('./search-page/search-page-routing.module')
              .then((m) => m.SearchPageRoutingModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'browse',
            loadChildren: () => import('./browse-by/browse-by-page.module')
              .then((m) => m.BrowseByPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: ADMIN_MODULE_PATH,
            loadChildren: () => import('./admin/admin.module')
              .then((m) => m.AdminModule),
            canActivate: [SiteAdministratorGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'login',
            redirectTo: 'sign-in',
          },
          {
            path: 'sign-in',
            loadChildren: () => import('./login-page/login-page.module')
              .then((m) => m.LoginPageModule),
          },
          {
            path: 'logout',
            redirectTo: 'sign-out'
          },
          {
            path: 'sign-out',
            loadChildren: () => import('./logout-page/logout-page.module')
              .then((m) => m.LogoutPageModule),
          },
          {
            path: 'submit',
            loadChildren: () => import('./submit-page/submit-page.module')
              .then((m) => m.SubmitPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'import-external',
            loadChildren: () => import('./import-external-page/import-external-page.module')
              .then((m) => m.ImportExternalPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'workspaceitems',
            loadChildren: () => import('./workspaceitems-edit-page/workspaceitems-edit-page.module')
              .then((m) => m.WorkspaceitemsEditPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: WORKFLOW_ITEM_MODULE_PATH,
            loadChildren: () => import('./workflowitems-edit-page/workflowitems-edit-page.module')
              .then((m) => m.WorkflowItemsEditPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: PROFILE_MODULE_PATH,
            loadChildren: () => import('./profile-page/profile-page.module')
              .then((m) => m.ProfilePageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: PROCESS_MODULE_PATH,
            loadChildren: () => import('./process-page/process-page.module')
              .then((m) => m.ProcessPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: INFO_MODULE_PATH,
            loadChildren: () => import('./info/info.module').then((m) => m.InfoModule),
          },
          {
            path: FORBIDDEN_PATH,
            component: ThemedForbiddenComponent
          },
          {
            path: 'statistics',
            loadChildren: () => import('./statistics-page/statistics-page-routing.module')
              .then((m) => m.StatisticsPageRoutingModule),
          },
          {
            path: ACCESS_CONTROL_MODULE_PATH,
            loadChildren: () => import('./access-control/access-control.module').then((m) => m.AccessControlModule),
            canActivate: [GroupAdministratorGuard],
          },
          { path: '**', pathMatch: 'full', component: ThemedPageNotFoundComponent },
      ]}
    ],{
      onSameUrlNavigation: 'reload',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}

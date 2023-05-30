import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PoliciesAndStandardsPageComponent } from './policies-and-standards-page.component';
import { PoliciesAndStandardsPageRoutingModule } from './policies-and-standards-page-routing.module';
import { ThemedPoliciesAndStandardsComponent } from './themed-policies-and-standards-page.component';

@NgModule({
  imports: [
    PoliciesAndStandardsPageRoutingModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    PoliciesAndStandardsPageComponent,
    ThemedPoliciesAndStandardsComponent
  ]
})
export class PoliciesAndStandardsPageModule {

}

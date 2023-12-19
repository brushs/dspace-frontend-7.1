import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ContactUsPageComponent } from './contact-us-page.component';
import { ContactUsPageRoutingModule } from './contact-us-page-routing.module';
import { ThemedContactUsPageComponent } from './themed-contact-us-page.component';

@NgModule({
  imports: [
    ContactUsPageRoutingModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    ContactUsPageComponent,
    ThemedContactUsPageComponent
  ]
})
export class ContactUsPageModule {

}

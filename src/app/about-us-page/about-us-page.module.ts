import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AboutUsPageComponent } from './about-us-page.component';
import { AboutUsPageRoutingModule } from './about-us-page-routing.module';
import { ThemedAboutUsPageComponent } from './themed-about-us-page.component';

@NgModule({
  imports: [
    AboutUsPageRoutingModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    AboutUsPageComponent,
    ThemedAboutUsPageComponent
  ]
})
export class AboutUsPageModule {

}

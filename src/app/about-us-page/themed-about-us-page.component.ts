import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { AboutUsPageComponent } from './about-us-page.component';

/**
 * Themed wrapper for LoginPageComponent
 */
@Component({
  selector: 'ds-themed-about-us-page',
  styleUrls: [],
  templateUrl: './../shared/theme-support/themed.component.html'
})
export class ThemedAboutUsPageComponent extends ThemedComponent<AboutUsPageComponent> {

  protected getComponentName(): string {
    return 'AboutUsPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/about-us-page/about-us-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./about-us-page.component`);
  }
  
}

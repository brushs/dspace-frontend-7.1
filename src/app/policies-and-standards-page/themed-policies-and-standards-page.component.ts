import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { PoliciesAndStandardsPageComponent } from './policies-and-standards-page.component';

/**
 * Themed wrapper for LoginPageComponent
 */
@Component({
  selector: 'ds-themed-about-us-page',
  styleUrls: [],
  templateUrl: './../shared/theme-support/themed.component.html'
})
export class ThemedPoliciesAndStandardsComponent extends ThemedComponent<PoliciesAndStandardsPageComponent> {

  protected getComponentName(): string {
    return 'PoliciesAndStandardsPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/policies-and-standards-page/policies-and-standards-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./policies-and-standards-page.component`);
  }
  
}

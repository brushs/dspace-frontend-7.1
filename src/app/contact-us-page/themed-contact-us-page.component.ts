import { Component } from '@angular/core';
import { ThemedComponent } from '../shared/theme-support/themed.component';
import { ContactUsPageComponent } from './contact-us-page.component';

/**
 * Themed wrapper for LoginPageComponent
 */
@Component({
  selector: 'ds-themed-contact-us-page',
  styleUrls: [],
  templateUrl: './../shared/theme-support/themed.component.html'
})
export class ThemedContactUsPageComponent extends ThemedComponent<ContactUsPageComponent> {
  protected getComponentName(): string {
    return 'ContactUsPageComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/contact-us-page/contact-us-page.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./contact-us-page.component`);
  }
}

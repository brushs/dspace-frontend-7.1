import { Component } from '@angular/core';
import { LocaleService } from '../core/locale/locale.service';
import { TranslateService } from '@ngx-translate/core';
/**
 * This component represents the contact us page
 */
@Component({
  selector: 'ds-about-us-page',
  styleUrls: ['./about-us-page.component.scss'],
  templateUrl: './about-us-page.component.html'
})
export class AboutUsPageComponent {
  constructor(public translate: TranslateService) {}
}

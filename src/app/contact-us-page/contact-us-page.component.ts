import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
/**
 * This component represents the contact us page
 */
@Component({
  selector: 'ds-contact-us-page',
  styleUrls: ['../../themes/wetoverlay/styles/static-pages.scss'],
  templateUrl: './contact-us-page.component.html'
})
export class ContactUsPageComponent {

  constructor(public translate: TranslateService) {}

}

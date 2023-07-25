import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(public translate: TranslateService,
    private router: Router
  ) {
    if (this.translate.currentLang === 'en' && this.router.url.includes('contactez-nous')) {
      this.router.navigate(['/contact-us'])
    } else if (this.translate.currentLang === 'fr' && this.router.url.includes('contact-us')) {
      this.router.navigate(['/contactez-nous'])
    }
  }
}

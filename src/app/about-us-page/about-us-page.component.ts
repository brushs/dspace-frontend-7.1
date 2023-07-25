import { Component } from '@angular/core';
import { LocaleService } from '../core/locale/locale.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
/**
 * This component represents the contact us page
 */
@Component({
  selector: 'ds-about-us-page',
  styleUrls: ['../../themes/wetoverlay/styles/static-pages.scss'],
  templateUrl: './about-us-page.component.html'
})
export class AboutUsPageComponent {
  constructor(public translate: TranslateService,
    private router: Router
  ) {
    if (this.translate.currentLang === 'en' && this.router.url.includes('a-propos')) {
      this.router.navigate(['/about-us'])
    } else if (this.translate.currentLang === 'fr' && this.router.url.includes('about-us')) {
      this.router.navigate(['/a-propos'])
    }
  }
}

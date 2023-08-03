import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
/**
 * This component represents the contact us page
 */
@Component({
  selector: 'ds-policies-and-standards-page',
  styleUrls: ['../../themes/wetoverlay/styles/static-pages.scss'],
  templateUrl: './policies-and-standards-page.component.html'
})
export class PoliciesAndStandardsPageComponent {
  constructor(public translate: TranslateService,
    private router: Router
  ) {
    if (this.translate.currentLang === 'en' && this.router.url.includes('politiques-et-normes')) {
      this.router.navigate(['/policies-and-standards'])
    } else if (this.translate.currentLang === 'fr' && this.router.url.includes('policies-and-standards')) {
      this.router.navigate(['/politiques-et-normes'])
    }
  }
}

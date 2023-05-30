import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
/**
 * This component represents the contact us page
 */
@Component({
  selector: 'ds-policies-and-standards-page',
  styleUrls: ['./policies-and-standards-page.component.scss'],
  templateUrl: './policies-and-standards-page.component.html'
})
export class PoliciesAndStandardsPageComponent {
  constructor(public translate: TranslateService) {}
}

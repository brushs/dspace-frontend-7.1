
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-page-details, [ds-page-details]',
  styleUrls: ['./page-details.component.scss'],
  templateUrl: './page-details.component.html'
})
export class PageDetailsComponent {
  lastModified;
  constructor(public translate: TranslateService) {}

  ngOnInit(){
    this.lastModified = document.lastModified;
  }
}

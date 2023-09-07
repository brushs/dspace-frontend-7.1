import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-comcol-page-header',
  styleUrls: ['./comcol-page-header.component.scss', '../../../themes/wetoverlay/styles/static-pages.scss'],
  templateUrl: './comcol-page-header.component.html',
})
export class ComcolPageHeaderComponent {
  @Input() name: string;
  @Input() lang: string;
  @Input() browseField: string;
}


import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { initShareBtn } from './initShareButton';

@Component({
  selector: 'ds-page-details, [ds-page-details]',
  styleUrls: ['./page-details.component.scss'],
  templateUrl: './page-details.component.html'
})


export class PageDetailsComponent {
  lastModified;


  constructor(public translate: TranslateService,
    ) {
    }

  ngOnInit(){
    this.lastModified = document.lastModified;
  }

  ngAfterViewInit() {
    // Reinitialize the share button every time a refresh occurs. This prevents the share button from disappearing.
   if(globalThis.wb && globalThis.jQuery) {
      initShareBtn(globalThis.jQuery, window, document, globalThis.wb);
    }
  }

}

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { initShareBtn } from './initShareButton';
import { 
  CustomNativeWindowService
} from '../../core/services/window.service';
import { PLATFORM_ID } from '@angular/core';
import {
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'ds-page-details, [ds-page-details]',
  styleUrls: ['./page-details.component.scss'],
  templateUrl: './page-details.component.html'
})


export class PageDetailsComponent {
  lastModified;


  constructor(
    public translate: TranslateService,
    private customNativeWindowService: CustomNativeWindowService,
    @Inject(PLATFORM_ID) private platformId: any,
    ) {
    }

  ngOnInit(){
    this.lastModified = isPlatformBrowser(this.platformId) ? this.customNativeWindowService.nativeDocument.lastModified : "";
  }

  ngAfterViewInit() {
    // Reinitialize the share button every time a refresh occurs. This prevents the share button from disappearing.
   if(globalThis.wb && globalThis.jQuery) {
      initShareBtn(globalThis.jQuery, this.customNativeWindowService.nativeWindow, this.customNativeWindowService.nativeDocument, globalThis.wb);
    }
  }

}

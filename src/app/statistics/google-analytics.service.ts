import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { isEmpty } from '../shared/empty.util';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  CustomNativeWindowService
} from '../core/services/window.service';

/**
 * Set up Google Analytics on the client side.
 * See: {@link addTrackingIdToPage}.
 */
@Injectable()
export class GoogleAnalyticsService {

  constructor(
    private angulartics: Angulartics2GoogleAnalytics,
    private configService: ConfigurationDataService,
    // @Inject(DOCUMENT) private document: any,
    private customNativeWindowService: CustomNativeWindowService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) { }

  /**
   * Call this method once when Angular initializes on the client side.
   * It requests a Google Analytics tracking id from the rest backend
   * (property: google.analytics.key), adds the tracking snippet to the
   * page and starts tracking.
   */
  addTrackingIdToPage(): void {
    this.configService.findByPropertyName('google.analytics.key').pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((remoteData) => {
      // make sure we got a success response from the backend
      if (!remoteData.hasSucceeded) { return; }

      const trackingId = remoteData.payload.values[0];

      // make sure we received a tracking id
      if (isEmpty(trackingId)) { return; }

      if (this.isGTagVersion(trackingId)) {

        // add GTag snippet to page
        const keyScript = this.customNativeWindowService.nativeDocument.createElement('script');
        keyScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        this.customNativeWindowService.nativeDocument.body.appendChild(keyScript);

        const libScript = this.customNativeWindowService.nativeDocument.createElement('script');
        libScript.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){window.dataLayer.push(arguments);}
                             gtag('js', new Date());gtag('config', '${trackingId}');`;
        this.customNativeWindowService.nativeDocument.body.appendChild(libScript);

        // start tracking
        this.angulartics.startTracking();
      } else {
        // add trackingId snippet to page
        const keyScript = this.customNativeWindowService.nativeDocument.createElement('script');
        keyScript.innerHTML =   `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                                ga('create', '${trackingId}', 'auto');`;
        this.customNativeWindowService.nativeDocument.body.appendChild(keyScript);

        // start tracking
        this.angulartics.startTracking();
      }
    });
  }

  private isGTagVersion(trackingId: string) {
    return trackingId && trackingId.startsWith('G-');
  }

  addTrackingIdToPageOstr(trackingId: string): void {
    // make sure we received a tracking id
    if (isEmpty(trackingId)) { return; }

    // add GTag snippet to head
    const keyScriptHead = this.customNativeWindowService.nativeDocument.createElement('script');
    keyScriptHead.innerHTML = `
      <!-- Google Tag Manager -->
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(${isPlatformBrowser(this.platformId) ? 'window' : 'this'},document,'script','dataLayer','${trackingId}');
      <!-- End Google Tag Manager -->
    `;
    this.customNativeWindowService.nativeDocument.head.appendChild(keyScriptHead);

    // Add file download tracking script
    const downloadTrackingScript = this.customNativeWindowService.nativeDocument.createElement('script');
    downloadTrackingScript.innerHTML = `
      (function() {
        var doc = ${isPlatformBrowser(this.platformId) ? 'window.document' : 'document'};
        doc.addEventListener('click', function(e) {
          var target = e.target;
          var linkElement = e.target.closest('a');
          if (linkElement && linkElement.href) {
            if (linkElement.href.includes('/bitstreams/') && linkElement.href.includes('/download'))
            {
              var alter_ref = linkElement.href + '.zip';
              ${isPlatformBrowser(this.platformId) ? 'window.dataLayer' : 'dataLayer'}.push({
                'event': "gtm.linkClick",
                'eventTimeout': 2000,
                'gtm.element': {},
                'gtm.elementClasses': linkElement.className,
                'gtm.elementId': linkElement.id,
                //'gtm.elementTarget': linkElement.target,
                'gtm.elementTarget': '',
                'gtm.elementText': linkElement.textContent.trim(),
                'gtm.elementUrl': alter_ref,
                'gtm.triggers': '230338310_5,5,6',
                'gtm.willOpenInNewWindow': false
              });
            }
          }
        });
      })();
    `;
    this.customNativeWindowService.nativeDocument.head.appendChild(downloadTrackingScript);

    // add trackingId snippet to body
    const keyScript = this.customNativeWindowService.nativeDocument.createElement('noscript');
    keyScript.innerHTML =   `
      <!-- Google Tag Manager (noscript) -->
      <iframe src="https://www.googletagmanager.com/ns.html?id=${trackingId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
      <!-- End Google Tag Manager (noscript) --> `;
      this.customNativeWindowService.nativeDocument.body.appendChild(keyScript);

    // Start tracking only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics.startTracking();
    }
  }
}

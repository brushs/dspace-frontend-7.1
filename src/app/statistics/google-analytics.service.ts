import { Inject, Injectable } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { isEmpty } from '../shared/empty.util';
import { DOCUMENT } from '@angular/common';

/**
 * Set up Google Analytics on the client side.
 * See: {@link addTrackingIdToPage}.
 */
@Injectable()
export class GoogleAnalyticsService {

  constructor(
    private angulartics: Angulartics2GoogleAnalytics,
    private configService: ConfigurationDataService,
    @Inject(DOCUMENT) private document: any,
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
        const keyScript = this.document.createElement('script');
        keyScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        this.document.body.appendChild(keyScript);

        const libScript = this.document.createElement('script');
        libScript.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){window.dataLayer.push(arguments);}
                             gtag('js', new Date());gtag('config', '${trackingId}');`;
        this.document.body.appendChild(libScript);

        // start tracking
        this.angulartics.startTracking();
      } else {
        // add trackingId snippet to page
        const keyScript = this.document.createElement('script');
        keyScript.innerHTML =   `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                                ga('create', '${trackingId}', 'auto');`;
        this.document.body.appendChild(keyScript);
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
      const keyScriptHead = this.document.createElement('script');
      keyScriptHead.innerHTML = `
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${trackingId}');</script>
        <!-- End Google Tag Manager -->
        `;

      this.document.head.appendChild(keyScriptHead);

      // add trackingId snippet to body
      const keyScript = this.document.createElement('script');
      keyScript.innerHTML =   `
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${trackingId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) --> `;
      this.document.body.appendChild(keyScript);
  }
}

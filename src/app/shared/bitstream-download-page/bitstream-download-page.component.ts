import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue, isNotEmpty } from '../empty.util';
import { getRemoteDataPayload, redirectOn4xx } from '../../core/shared/operators';
import { Bitstream } from '../../core/shared/bitstream.model';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { AuthService } from '../../core/auth/auth.service';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { FileService } from '../../core/shared/file.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { getForbiddenRoute } from '../../app-routing-paths';
import { RemoteData } from '../../core/data/remote-data';
import { Title } from '@angular/platform-browser';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

@Component({
  selector: 'ds-bitstream-download-page',
  templateUrl: './bitstream-download-page.component.html'
})
/**
 * Page component for downloading a bitstream
 */
export class BitstreamDownloadPageComponent implements OnInit {

  bitstream$: Observable<Bitstream>;
  bitstreamRD$: Observable<RemoteData<Bitstream>>;


  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private authorizationService: AuthorizationDataService,
    private auth: AuthService,
    private fileService: FileService,
    private hardRedirectService: HardRedirectService,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  ngOnInit(): void {

    this.bitstreamRD$ = this.route.data.pipe(
      map((data) => data.bitstream));

    this.bitstream$ = this.bitstreamRD$.pipe(
      redirectOn4xx(this.router, this.auth),
      getRemoteDataPayload(),
      tap((bitstream: Bitstream) => {
        if (bitstream && bitstream.name) {
          this.titleService.setTitle(bitstream.name);
        }
      })
    );

    this.bitstream$.pipe(
      switchMap((bitstream: Bitstream) => {
        const isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(bitstream) ? bitstream.self : undefined);
        const isLoggedIn$ = this.auth.isAuthenticated();
        return observableCombineLatest([isAuthorized$, isLoggedIn$, observableOf(bitstream)]);
      }),
      filter(([isAuthorized, isLoggedIn, bitstream]: [boolean, boolean, Bitstream]) => hasValue(isAuthorized) && hasValue(isLoggedIn)),
      take(1),
      switchMap(([isAuthorized, isLoggedIn, bitstream]: [boolean, boolean, Bitstream]) => {
        if (isAuthorized && isLoggedIn) {
          return this.fileService.retrieveFileDownloadLink(bitstream._links.content.href).pipe(
            filter((fileLink) => hasValue(fileLink)),
            take(1),
            map((fileLink) => {
              return [isAuthorized, isLoggedIn, bitstream, fileLink];
            }));
        } else {
          return [[isAuthorized, isLoggedIn, bitstream, '']];
        }
      })
    ).subscribe(([isAuthorized, isLoggedIn, bitstream, fileLink]: [boolean, boolean, Bitstream, string]) => {
      if (isAuthorized && isLoggedIn && isNotEmpty(fileLink)) {
        this.trackDownloadAndRedirect(bitstream, fileLink);
      } else if (isAuthorized && !isLoggedIn) {
        this.trackDownloadAndRedirect(bitstream, bitstream._links.content.href);
      } else if (!isAuthorized && isLoggedIn) {
        this.router.navigateByUrl(getForbiddenRoute(), {skipLocationChange: true});
      } else if (!isAuthorized && !isLoggedIn) {
        this.auth.setRedirectUrl(this.router.url);
        this.router.navigateByUrl('login');
      }
    });
  }

  /**
   * Track download event in GA4 and then redirect to file
   * This ensures GA4 captures the download event even with SSR
   */
  private trackDownloadAndRedirect(bitstream: Bitstream, downloadUrl: string): void {
    // Only run GA tracking in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      this.hardRedirectService.redirect(downloadUrl);
      return;
    }

    // Get current route path for virtual page view
    const pagePath = this.router.url;
    const pageLocation = `${location.origin}${pagePath}`;

    // Function to perform the redirect
    const navigate = () => {
      this.hardRedirectService.redirect(downloadUrl);
    };

    // Check if gtag is available
    if (typeof window !== 'undefined' && window.gtag) {
      // 1) Send virtual page_view so the download URL shows in GA4 "Pages"
      window.gtag('event', 'page_view', {
        page_title: `Download: ${bitstream.name || 'Unknown File'}`,
        page_path: pagePath,
        page_location: pageLocation,
      });

      // 2) Send custom download event with bitstream metadata
      window.gtag('event', 'bitstream_download', {
        bitstream_uuid: bitstream.uuid,
        file_name: bitstream.name,
        file_size: bitstream.sizeBytes,
        link_url: pageLocation,
        // Use beacon transport to ensure event is sent before navigation
        transport_type: 'beacon',
        event_timeout: 1000,
        event_callback: navigate,
      });

      // Fallback timeout in case event_callback doesn't fire
      setTimeout(navigate, 1000);
    } else {
      // If gtag is not available, redirect immediately
      navigate();
    }
  }
}

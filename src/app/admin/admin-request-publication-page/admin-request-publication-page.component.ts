import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DspaceRestService } from '../../core/dspace-rest/dspace-rest.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RESTURLCombiner } from '../../core/url-combiner/rest-url-combiner';
import { LocaleService } from '../../core/locale/locale.service';
import { hasValue, isEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ds-admin-request-publication-page',
  templateUrl: './admin-request-publication-page.component.html',
  styleUrls: ['./admin-request-publication-page.component.scss']
})
export class AdminRequestPublicationPageComponent implements OnInit, OnDestroy {
  labelPrefix = 'admin.request.publication.';

  requests$ = new BehaviorSubject<PublicationRequest[]>([]);
  pageInfoState$ = new BehaviorSubject<PageInfo>(new PageInfo());
  loading$ = new BehaviorSubject<boolean>(false);

  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'prp',
    pageSize: 20,
    currentPage: 1
  });

  private subscriptions: Subscription[] = [];

  constructor(
    private restService: DspaceRestService,
    private paginationService: PaginationService,
    private notificationsService: NotificationsService,
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
        tap(() => this.loading$.next(true)),
        switchMap((pagination) => this.loadRequests(pagination)),
      ).subscribe({
        next: (response) => {
          const requests = response._embedded?.publicationrequests ?? [];
          const page = response.page ?? { size: 0, totalElements: 0, totalPages: 0, number: 0 };
          this.requests$.next(requests);
          this.pageInfoState$.next(new PageInfo({
            elementsPerPage: page.size,
            totalElements: page.totalElements,
            totalPages: page.totalPages,
            currentPage: page.number
          }));
          this.loading$.next(false);
        },
        error: (error) => {
          this.requests$.next([]);
          this.pageInfoState$.next(new PageInfo());
          this.loading$.next(false);
          this.notificationsService.error(
            this.labelPrefix + 'notification.error',
            error?.message || error?.statusText || 'Request failed'
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.paginationService.clearPagination(this.config.id);
  }

  private loadRequests(pagination: PaginationComponentOptions) {
    const page = Math.max(0, pagination.currentPage - 1);
    const size = pagination.pageSize;
    const baseUrl = new RESTURLCombiner('request', 'publicationrequests').toString();
    const url = `${baseUrl}?page=${page}&size=${size}`;
    return this.restService.get(url).pipe(
      map((response) => response.payload as PublicationRequestsResponse)
    );
  }

  getTitle(request: PublicationRequest): string {
    const currentLang = this.localeService.getCurrentLanguageCode();
    const primary = currentLang === 'fr' ? request.titleFr : request.titleEn;
    const fallback = currentLang === 'fr' ? request.titleEn : request.titleFr;
    if (hasValue(primary) && !isEmpty(primary)) {
      return primary;
    }
    if (hasValue(fallback) && !isEmpty(fallback)) {
      return fallback;
    }
    return '';
  }
}

interface PublicationRequestsResponse {
  _embedded?: {
    publicationrequests?: PublicationRequest[];
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface PublicationRequest {
  id: number;
  publicationGUID: string;
  userEmailAddress: string;
  language: string;
  status: string | null;
  type: string;
  titleEn?: string | null;
  titleFr?: string | null;
}

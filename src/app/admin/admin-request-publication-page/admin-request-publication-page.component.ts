import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { LocaleService } from '../../core/locale/locale.service';
import { hasValue, isEmpty } from '../../shared/empty.util';
import { FindListOptions } from '../../core/data/request.models';
import {
  PublicationRequestDataService,
} from '../../core/request/publication-request-data.service';
import { PublicationRequest } from '../../core/request/models/publication-request.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';

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
    pageSize: 5,
    currentPage: 1
  });

  private subscriptions: Subscription[] = [];

  searchForm;
  currentSearchQuery = '';
  currentSearchScope = 'title';
  searchParams$ = new BehaviorSubject<{ scope: string; query: string }>({ scope: 'title', query: '' });

  constructor(
    private paginationService: PaginationService,
    private notificationsService: NotificationsService,
    private localeService: LocaleService,
    private formBuilder: FormBuilder,
    private publicationRequestDataService: PublicationRequestDataService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group(({
      scope: 'title',
      query: '',
    }));
    this.subscriptions.push(
      combineLatest([
        this.paginationService.getCurrentPagination(this.config.id, this.config),
        this.searchParams$
      ]).pipe(
        switchMap(([pagination, search]) => this.loadRequests(pagination, search)),
      ).subscribe((response: RemoteData<PaginatedList<PublicationRequest>>) => {
        if (response?.isLoading) {
          this.loading$.next(true);
          return;
        }
        if (response?.hasSucceeded) {
          const payload = response.payload;
          this.requests$.next(payload?.page ?? []);
          this.pageInfoState$.next(payload?.pageInfo ?? new PageInfo());
          this.loading$.next(false);
          return;
        }
        if (response?.hasFailed) {
          this.requests$.next([]);
          this.pageInfoState$.next(new PageInfo());
          this.loading$.next(false);
          this.notificationsService.error(
            this.labelPrefix + 'notification.error',
            response?.errorMessage || 'Request failed'
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.paginationService.clearPagination(this.config.id);
  }

  private loadRequests(
    pagination: PaginationComponentOptions,
    search: { scope: string; query: string }
  ) {
    const options = new FindListOptions();
    options.currentPage = pagination.currentPage;
    options.elementsPerPage = pagination.pageSize;
    return this.publicationRequestDataService.searchByScope(search.scope, search.query, options);
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

  search(data: { scope: string; query: string }) {
    this.currentSearchScope = data?.scope || this.currentSearchScope;
    this.currentSearchQuery = data?.query || '';
    this.paginationService.resetPage(this.config.id);
    this.searchParams$.next({
      scope: this.currentSearchScope,
      query: this.currentSearchQuery
    });
  }

  clearFormAndResetResult() {
    if (this.searchForm) {
      this.searchForm.patchValue({ query: '' });
    }
    this.currentSearchQuery = '';
    this.paginationService.resetPage(this.config.id);
    this.searchParams$.next({
      scope: this.currentSearchScope,
      query: this.currentSearchQuery
    });
  }
}

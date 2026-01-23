import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { LocaleService } from '../../core/locale/locale.service';
import { hasValue, isEmpty } from '../../shared/empty.util';
import { FindListOptions } from '../../core/data/request.models';
import { TranslationRequestDataService } from '../../core/request/translation-request-data.service';
import { TranslationRequest } from '../../core/request/models/translation-request.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { RequestService } from '../../core/data/request.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { NoContent } from '../../core/shared/NoContent.model';

@Component({
  selector: 'ds-admin-request-translation-page',
  templateUrl: './admin-request-translation-page.component.html',
  styleUrls: ['./admin-request-translation-page.component.scss']
})
export class AdminRequestTranslationPageComponent implements OnInit, OnDestroy {
  labelPrefix = 'admin.request.translation.';
  labelPrefixSpecific = 'admin.request.translation.';
  selectedRequest: TranslationRequest | null = null;

  requests$ = new BehaviorSubject<TranslationRequest[]>([]);
  pageInfoState$ = new BehaviorSubject<PageInfo>(new PageInfo());
  loading$ = new BehaviorSubject<boolean>(false);

  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'trp',
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
    private translationRequestDataService: TranslationRequestDataService,
    private modalService: NgbModal,
    private requestService: RequestService
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
      ).subscribe((response: RemoteData<PaginatedList<TranslationRequest>>) => {
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
    return this.translationRequestDataService.searchByScope(search.scope, search.query, options);
  }

  getTitle(request: TranslationRequest): string {
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

  getLanguageLabel(language: string): string {
    if (language === 'en') {
      return 'English';
    }
    if (language === 'fr') {
      return 'French';
    }
    return language || '';
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

  deleteRequest(request: TranslationRequest) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.headerLabel = 'confirmation-modal.delete-translation-request.header';
    modalRef.componentInstance.infoLabel = 'confirmation-modal.delete-translation-request.info';
    modalRef.componentInstance.cancelLabel = 'item.edit.delete.cancel';
    modalRef.componentInstance.confirmLabel = 'item.edit.delete.confirm';
    modalRef.componentInstance.brandColor = 'danger';
    modalRef.componentInstance.confirmIcon = 'fas fa-trash';
    modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
      if (confirm) {
        this.translationRequestDataService.deleteTranslationRequest(request)
          .pipe(getFirstCompletedRemoteData())
          .subscribe((response: RemoteData<NoContent>) => {
            if (response.hasSucceeded) {
              this.notificationsService.success(this.labelPrefix + 'notification.deleted.success');
              this.resetList();
            } else {
              this.notificationsService.error(this.labelPrefix + 'notification.deleted.error');
            }
          });
      }
    });
  }

  openViewModal(request: TranslationRequest, content: TemplateRef<unknown>) {
    this.selectedRequest = request;
    this.modalService.open(content, { size: 'lg' });
  }

  private resetList() {
    this.translationRequestDataService.getBrowseEndpoint().pipe(take(1)).subscribe((href: string) => {
      this.requestService.setStaleByHrefSubstring(href).pipe(take(1)).subscribe(() => {
        this.searchParams$.next({
          scope: this.currentSearchScope,
          query: this.currentSearchQuery
        });
      });
    });
  }
}

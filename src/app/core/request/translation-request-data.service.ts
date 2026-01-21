import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DataService } from '../data/data.service';
import { FindListOptions } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { NoContent } from '../shared/NoContent.model';
import { TranslationRequest } from './models/translation-request.model';
import { TRANSLATION_REQUEST } from './models/translation-request.resource-type';

@Injectable({
  providedIn: 'root'
})
@dataService(TRANSLATION_REQUEST)
export class TranslationRequestDataService extends DataService<TranslationRequest> {
  protected linkPath = 'request/translationrequests';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<TranslationRequest>
  ) {
    super();
  }

  protected getEndpoint(): Observable<string> {
    return observableOf(new RESTURLCombiner('request', 'translationrequests').toString());
  }

  protected getSearchEndpoint(searchMethod: string): Observable<string> {
    return observableOf(new RESTURLCombiner('request', 'translationrequests', 'search', searchMethod).toString());
  }

  public searchByScope(
    scope: string,
    query: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true
  ): Observable<RemoteData<PaginatedList<TranslationRequest>>> {
    const trimmedQuery = (query || '').trim();
    if (trimmedQuery.length === 0) {
      return this.findAll(options, useCachedVersionIfAvailable);
    }
    switch (scope) {
      case 'title':
        return this.getTranslationRequestsByTitle(trimmedQuery, options, useCachedVersionIfAvailable);
      case 'status':
        return this.getTranslationRequestsByStatus(trimmedQuery, options, useCachedVersionIfAvailable);
      case 'language':
      default:
        return this.getTranslationRequestsByLanguage(trimmedQuery, options, useCachedVersionIfAvailable);
    }
  }

  public deleteTranslationRequest(request: TranslationRequest): Observable<RemoteData<NoContent>> {
    return this.delete(String(request.id));
  }

  private getTranslationRequestsByTitle(
    query: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true
  ): Observable<RemoteData<PaginatedList<TranslationRequest>>> {
    return this.getTranslationRequestsBy('byTitle', 'title', query, options, useCachedVersionIfAvailable);
  }

  private getTranslationRequestsByLanguage(
    query: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true
  ): Observable<RemoteData<PaginatedList<TranslationRequest>>> {
    return this.getTranslationRequestsBy('byLanguage', 'language', query, options, useCachedVersionIfAvailable);
  }

  private getTranslationRequestsByStatus(
    query: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true
  ): Observable<RemoteData<PaginatedList<TranslationRequest>>> {
    return this.getTranslationRequestsBy('byStatus', 'status', query, options, useCachedVersionIfAvailable);
  }

  private getTranslationRequestsBy(
    searchMethod: string,
    paramName: string,
    query: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true
  ): Observable<RemoteData<PaginatedList<TranslationRequest>>> {
    let findListOptions = Object.assign(new FindListOptions(), options);
    const searchParams = [new RequestParam(paramName, encodeURIComponent(query))];
    if (findListOptions.searchParams) {
      findListOptions.searchParams = [...findListOptions.searchParams, ...searchParams];
    } else {
      findListOptions.searchParams = searchParams;
    }
    return this.searchBy(searchMethod, findListOptions, useCachedVersionIfAvailable);
  }
}

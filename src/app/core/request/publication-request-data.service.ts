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
import { NoContent } from '../shared/NoContent.model';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { PublicationRequest } from './models/publication-request.model';
import { PUBLICATION_REQUEST } from './models/publication-request.resource-type';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';

@Injectable({
  providedIn: 'root'
})
@dataService(PUBLICATION_REQUEST)
export class PublicationRequestDataService extends DataService<PublicationRequest> {
  protected linkPath = 'request/publicationrequests';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<PublicationRequest>
  ) {
    super();
  }

  protected getEndpoint(): Observable<string> {
    return observableOf(new RESTURLCombiner('request', 'publicationrequests').toString());
  }

  protected getSearchEndpoint(searchMethod: string): Observable<string> {
    return observableOf(new RESTURLCombiner('request', 'publicationrequests', 'search', searchMethod).toString());
  }

  /**
   * Search publication requests by scope (title or email).
   * Uses query params as a placeholder until a dedicated search endpoint exists.
   */
  public searchByScope(
    scope: string,
    query: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true
  ): Observable<RemoteData<PaginatedList<PublicationRequest>>> {
    const trimmedQuery = (query || '').trim();
    if (trimmedQuery.length === 0) {
      return this.findAll(options, useCachedVersionIfAvailable);
    }
    switch (scope) {
      case 'email':
        return this.getPublicationRequestsByEmail(trimmedQuery, options, useCachedVersionIfAvailable);
      case 'title':
      default:
        return this.getPublicationRequestsByTitle(trimmedQuery, options, useCachedVersionIfAvailable);
    }
  }

  private getPublicationRequestsByTitle(
    query: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true
  ): Observable<RemoteData<PaginatedList<PublicationRequest>>> {
    return this.getPublicationRequestsBy('byTitle', 'title', query, options, useCachedVersionIfAvailable);
  }

  private getPublicationRequestsByEmail(
    query: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true
  ): Observable<RemoteData<PaginatedList<PublicationRequest>>> {
    return this.getPublicationRequestsBy('byUserEmail', 'email', query, options, useCachedVersionIfAvailable);
  }

  private getPublicationRequestsBy(
    searchMethod: string,
    paramName: string,
    query: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true
  ): Observable<RemoteData<PaginatedList<PublicationRequest>>> {
    let findListOptions = Object.assign(new FindListOptions(), options);
    const searchParams = [new RequestParam(paramName, encodeURIComponent(query))];
    if (findListOptions.searchParams) {
      findListOptions.searchParams = [...findListOptions.searchParams, ...searchParams];
    } else {
      findListOptions.searchParams = searchParams;
    }
    return this.searchBy(searchMethod, findListOptions, useCachedVersionIfAvailable);
  }

  public deletePublicationRequest(request: PublicationRequest): Observable<RemoteData<NoContent>> {
    return this.delete(String(request.id));
  }
}

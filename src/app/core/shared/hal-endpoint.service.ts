import { Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, take } from 'rxjs/operators';
import { RequestService } from '../data/request.service';
import { EndpointMapRequest } from '../data/request.models';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { Injectable } from '@angular/core';
import { EndpointMap } from '../cache/response.models';
import { getFirstCompletedRemoteData } from './operators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RemoteData } from '../data/remote-data';
import { UnCacheableObject } from './uncacheable-object.model';
import { 
  CustomNativeWindowService
} from '../../core/services/window.service';

@Injectable()
export class HALEndpointService {

  constructor(
    private requestService: RequestService,
    private rdbService: RemoteDataBuildService,
    private customNativeWindowService: CustomNativeWindowService,
) {
  }

  public getRootHref(): string {
    return new RESTURLCombiner().toString();
  }

  protected getRootEndpointMap(): Observable<EndpointMap> {
    return this.getEndpointMapAt(this.getRootHref());
  }

  private getEndpointMapAt(href): Observable<EndpointMap> {
    var beforeUrl = href;
    href = href.replace(":3500", "");
    href = href.replace("https://127.0.0.1:4000/server/api", "http://127.0.0.1:8080/server/api");
    href = href.replace("https://localhost:4000/server/api", "http://localhost:8080/server/api");
    href = href.replace("https://0.0.0.0:4000/server/api", "http://0.0.0.0:8080/server/api");
    href = href.replace("https://10.153.197.23:4000/server/api", "http://10.153.170.38:8080/server/api");
    var afterUrl = href;
    if(beforeUrl != afterUrl) {
      console.log('before href: ', beforeUrl);
      console.log('after href: ', afterUrl);
    }
    const request = new EndpointMapRequest(this.requestService.generateRequestId(), href);
    //console.log("request: ", request);
    
    this.requestService.send(request, true);
    return this.rdbService.buildFromHref<UnCacheableObject>(href).pipe(
      getFirstCompletedRemoteData(),
      map((response: RemoteData<UnCacheableObject> | UnCacheableObject) => {
        if (hasValue(response.payload)) {
          return response.payload._links;
        } else if(hasValue(response["_links"])){
          return response["_links"];
        }else {
          console.warn(`No _links section found at ${href}`);
          return undefined;
        }
      }),
    );
  }

  public getEndpoint(linkPath: string, startHref?: string): Observable<string> {
    const halNames = linkPath.split('/').filter((name: string) => isNotEmpty(name));
    return this.getEndpointAt(startHref || this.getRootHref(), ...halNames).pipe(take(1));
  }

  /**
   * Resolve the actual hal url based on a list of hal names
   * @param {string} href The root url to start from
   * @param {string} halNames List of hal names for which a url should be resolved
   * @returns {Observable<string>} Observable that emits the found hal url
   */
  private getEndpointAt(href: string, ...halNames: string[]): Observable<string> {
    if (isEmpty(halNames)) {
      console.error('Can not fetch the URL without the HAL link names');
    }

    const nextHref$ = this.getEndpointMapAt(href).pipe(
      map((endpointMap: EndpointMap): string => {
        const nextName = halNames[0];
        if (hasValue(endpointMap) && hasValue(endpointMap[nextName])) {
          return endpointMap[nextName].href;
        } else {
          console.error(`${JSON.stringify(endpointMap)} does not contain the link ${nextName}`);
        }
      })
    ) as Observable<string>;

    if (halNames.length === 1) {
      return nextHref$.pipe(take(1));
    } else {
      return nextHref$.pipe(
        switchMap((nextHref) => this.getEndpointAt(nextHref, ...halNames.slice(1))),
        take(1)
      );
    }
  }

  public isEnabledOnRestApi(linkPath: string): Observable<boolean> {
    return this.getRootEndpointMap().pipe(
      // TODO this only works when there's no / in linkPath
      map((endpointMap: EndpointMap) => isNotEmpty(endpointMap[linkPath])),
      startWith(undefined),
      distinctUntilChanged()
    );
  }

}

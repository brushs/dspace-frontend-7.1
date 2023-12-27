import { Component } from '@angular/core';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import {BreadcrumbOptions} from './breadcrumb/breadcrumb-options.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Observable } from 'rxjs/internal/Observable';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component representing the breadcrumbs of a page
 */
@Component({
  selector: 'ds-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {

  /**
   * Observable of the list of breadcrumbs for this page
   */
  breadcrumbs$: Observable<Breadcrumb[]>;

  /**
   * Observable of breadcrumb options object passed as data with route
   */
  breadcrumbOptions$: Observable<BreadcrumbOptions>;

  /**
   * Whether or not to show breadcrumbs on this page
   */
  showBreadcrumbs$: Observable<boolean>;

  /**
   * Regex representation of text containing "gc science"
   * or "scientifique du gc" with case insensitivity
   */
  gcScienceRegex = /.*(gc science|scientifique du gc).*/i

  constructor(
    private breadcrumbsService: BreadcrumbsService,
    public translate: TranslateService,
  ) {
    this.breadcrumbs$ = breadcrumbsService.breadcrumbs$;
    this.showBreadcrumbs$ = breadcrumbsService.showBreadcrumbs$;
    this.breadcrumbOptions$ = breadcrumbsService.breadcrumbOptions$;
  }

  // OSPR code start
  public getPath(): string {
    let locationPath = document.location.href;
    if(locationPath.indexOf("#") > 0) {
      return locationPath.substring(0, locationPath.indexOf("#"));
    }
    return locationPath;
  }
  // OSPR code end

  public testRegexPattern(regexPattern: RegExp, text){
    return regexPattern.test(text);
  }

  /**
   * Method to parse the path segment from a url string
   * @param url The URL string value
   * @returns The URL path string value
   */
  parsePathFromUrl(url){
    if(url){
      return url.split("?")[0];
    }
    return url;
  }
  
  /**
   * Method to parse the query parameter segment from a URL string
   * @param url The URL string value
   * @returns Query parameters as an object
   */
  parseQueryParametersFromUrl(url){
    if(url){
      let queryParamsString = url.split("?")[1];
      if(url.split("?")[1]){
        let queryParamsStringSegments = queryParamsString.split("&");
        let queryParamsObject = {};
        queryParamsStringSegments.forEach((segment) => {
          let splitSegment = segment.split("=");
          queryParamsObject[splitSegment[0]] = decodeURIComponent(splitSegment[1]);
        });
        return queryParamsObject;
      }
      else {
        const queryParamsObject: { [key: string]: string } = {};
        const scope = url.split('/')[2];
        if(scope && (url.indexOf('collections') > -1 || url.indexOf('communities') > -1)){
          queryParamsObject['scope'] =scope;
          queryParamsObject['spc.sf'] = 'score';
          queryParamsObject['spc.sd'] = 'DESC';
          queryParamsObject['spc.page'] = '1';
        }
       return queryParamsObject;
      }
    }
    return {};
    
  }
}

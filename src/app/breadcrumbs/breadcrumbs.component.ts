import { Component } from '@angular/core';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import {BreadcrumbOptions} from './breadcrumb/breadcrumb-options.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Observable } from 'rxjs/internal/Observable';

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

  constructor(
    private breadcrumbsService: BreadcrumbsService,
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

}

import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, CanActivate, Route, Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { combineLatest as observableCombineLatest, Observable, of as observableOf } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { isNotEmpty } from '../../shared/empty.util';
import { getItemPageRoute } from '../item-page-routing-paths';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ItemDataService } from '../../core/data/item-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { getItemEditRoute } from '../item-page-routing-paths';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';

@Component({
  selector: 'ds-edit-item-page',
  templateUrl: './edit-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Page component for editing an item
 */
export class EditItemPageComponent implements OnInit {

  /**
   * The item to edit
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The current page outlet string
   */
  currentPage: string;

  /**
   * All possible page outlet strings
   */
  pages: { page: string, enabled: Observable<boolean> }[];

  /**
   * Flag to track if cloning is in progress
   */
  isCloning = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private injector: Injector,
    private itemDataService: ItemDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService
  ) {
    this.router.events.subscribe(() => this.initPageParamsByRoute());
  }

  ngOnInit(): void {
    this.initPageParamsByRoute();
    this.pages = this.route.routeConfig.children
      .filter((child: Route) => isNotEmpty(child.path))
      .map((child: Route) => {
        let enabled = observableOf(true);
        if (isNotEmpty(child.canActivate)) {
          enabled = observableCombineLatest(child.canActivate.map((guardConstructor: GenericConstructor<CanActivate>) => {
              const guard: CanActivate = this.injector.get<CanActivate>(guardConstructor);
              return guard.canActivate(this.route.snapshot, this.router.routerState.snapshot);
            })
          ).pipe(
            map((canActivateOutcomes: any[]) => canActivateOutcomes.every((e) => e === true))
          );
        }
        return { page: child.path, enabled: enabled };
      }); // ignore reroutes
    this.itemRD$ = this.route.data.pipe(map((data) => data.dso));
  }

  /**
   * Get the item page url
   * @param item The item for which the url is requested
   */
  getItemPage(item: Item): string {
    return getItemPageRoute(item);
  }

  /**
   * Set page params depending on the route
   */
  initPageParamsByRoute() {
    this.currentPage = this.route.snapshot.firstChild.routeConfig.path;
  }

  /**
   * Clone the current item
   */
  cloneItem() {
    this.isCloning = true;
    
    this.itemRD$.pipe(
      take(1),
      switchMap((itemRD: RemoteData<Item>) => {
        const item = itemRD.payload;
        return this.itemDataService.cloneItem(item.uuid).pipe(
          getFirstCompletedRemoteData()
        );
      })
    ).subscribe((clonedItemRD: RemoteData<Item>) => {
      this.isCloning = false;
      
      if (clonedItemRD.hasSucceeded) {
        const clonedItem = clonedItemRD.payload;
        this.notificationsService.success(
          this.translateService.instant('item.edit.clone.success.title'),
          this.translateService.instant('item.edit.clone.success.content')
        );
        // Navigate to the edit page of the newly cloned item
        this.router.navigate([getItemEditRoute(clonedItem)]);
      } else if (clonedItemRD.hasFailed) {
        this.notificationsService.error(
          this.translateService.instant('item.edit.clone.error.title'),
          clonedItemRD.errorMessage || this.translateService.instant('item.edit.clone.error.content')
        );
      }
    }, (error) => {
      this.isCloning = false;
      this.notificationsService.error(
        this.translateService.instant('item.edit.clone.error.title'),
        this.translateService.instant('item.edit.clone.error.content')
      );
    });
  }
}

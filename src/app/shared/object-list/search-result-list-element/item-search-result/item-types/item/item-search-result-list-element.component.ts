import { 
  Component
} from '@angular/core';
import { listableObjectComponent } from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
// import { hasValue } from '../../../../../empty.util';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {

  /**
   * isCollapsed$ observable that tracks whether
   * the truncatable area has been collapsed
   */
  isCollapsed$;

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  // /**
  //  * Subscription to unsubscribe from
  //  */
  // private sub;

  // isCollapsedStatus: boolean;

  ngOnInit(): void {
    super.ngOnInit();
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.isCollapsed$ = this.isCollapsed();

    // this.sub = this.truncatableService.isCollapsed(this.dso.id).subscribe((collapsed: boolean) => {
    //   this.isCollapsedStatus = collapsed
    // });
  }

  // /**
  //  * Unsubscribe from the subscription
  //  */
  // ngOnDestroy(): void {
  //   if (hasValue(this.sub)) {
  //     this.sub.unsubscribe();
  //   }
  // }

}

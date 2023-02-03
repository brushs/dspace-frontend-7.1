import { Component, Inject, Input, OnInit } from '@angular/core';
import { ListLinkMenuItemModel } from './models/list-link.model';
import { MenuItemType } from '../initial-menus-state';
import { rendersMenuItemForType } from '../menu-item.decorator';
import { isNotEmpty } from '../../empty.util';
import { environment } from '../../../../environments/environment';

/**
 * Component that renders a menu section of type LINK
 */
@Component({
  selector: 'li[ds-list-link-menu-item]',
  templateUrl: './link-menu-item.component.html'
})
@rendersMenuItemForType(MenuItemType.LIST_LINK)
export class ListLinkMenuItemComponent implements OnInit {
  item: ListLinkMenuItemModel;
  hasLink: boolean;
  constructor(@Inject('itemModelProvider') item: ListLinkMenuItemModel) {
    this.item = item;
  }

  ngOnInit(): void {
    this.hasLink = isNotEmpty(this.item.link);
  }

  getRouterLink() {
    if (this.hasLink) {
      return environment.ui.nameSpace + this.item.link;
    }
    return undefined;
  }

}

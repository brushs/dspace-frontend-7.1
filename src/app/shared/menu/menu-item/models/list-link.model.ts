import { MenuItemModel } from './menu-item.model';
import { MenuItemType } from '../../initial-menus-state';

/**
 * Model representing a Link Menu Section inside a list
 */
export class ListLinkMenuItemModel implements MenuItemModel {
  type = MenuItemType.LIST_LINK;
  text: string;
  link: string;
}

import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-item-page-odi-field',
  templateUrl: './item-page-doi-field.component.html',
  //templateUrl: '../item-page-field.component.html',
})
/**
 * This component can be used to represent any doi on a simple item page.
 * It expects 4 parameters: The item, a separator, the metadata keys and an i18n key
 */
export class ItemPageDoiFieldComponent extends ItemPageFieldComponent {
  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() separator: string;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  fields: string[] = ['dc.identifier.doi'];

  /**
   * Label i18n key for the rendered metadata
   */
  label = 'DOI';

}

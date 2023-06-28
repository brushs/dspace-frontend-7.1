import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-item-page-collapsable-field',
  templateUrl: './item-page-collapsable-field.component.html',
})
/**
 * This component can be used to display fields that can collapse on a simple item page.
 * It expects 4 parameters: The item, a separator, the metadata keys and an i18n key
 */
export class ItemPageCollapsableFieldComponent extends ItemPageFieldComponent {
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
  fields: string[] = ['dc.description.abstract'];

  @Input() field: string; // = 'dc.description.abstract';

  isHidden: boolean = false;

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;

  ngOnInit() {
    var fieldValues = this.item.allMetadata(this.field);
    if (fieldValues && (fieldValues.length == 0)
      || (fieldValues.length > 0 && fieldValues[0].value.startsWith("No abstract"))) {
      this.isHidden = true;
    }
  }
}

import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { LocaleService } from '../../../../../core/locale/locale.service';

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

  @Input() postfix: string;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */

  @Input() field: string; // = 'dc.description.abstract';

  isHidden: boolean = false;

  idEx: string;
  value: string;
  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;
  constructor(private localeService: LocaleService) {
    super();
  }
  ngOnInit() {
    let currLang = this.localeService.getCurrentLanguageCode();
    var fieldValues = this.item.allMetadata(this.field);
    if (fieldValues && (fieldValues.length == 0)
      || (fieldValues.length > 0 && fieldValues[0].value.startsWith("No abstract"))) {
      this.isHidden = true;
    }
    this.value = fieldValues.filter((value) => value.language === currLang).toString();
    if (this.value.length == 0) {
      this.value = this.item.firstMetadataValue(this.field)
    }
    this.idEx =  this.postfix + this.item.id;
  }
}

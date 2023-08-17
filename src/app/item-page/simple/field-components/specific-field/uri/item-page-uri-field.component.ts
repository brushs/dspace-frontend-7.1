import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-item-page-uri-field',
  templateUrl: './item-page-uri-field.component.html'
})
/**
 * This component can be used to represent any uri on a simple item page.
 * It expects 4 parameters: The item, a separator, the metadata keys and an i18n key
 */
export class ItemPageUriFieldComponent extends ItemPageFieldComponent {

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
  @Input() fields: string[] = ['dc.identifier.uri'];

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;

  @Input() isDescriptionList: boolean = false;
  
  public domainAwareValue (rawValue: string): string {
    const domainList = ['dev.ospr.link','ospr.link','localhost','open-science.canada.ca','science-ouverte.canada.ca', 'ospr.g.ent.cloud-nauge.canada.ca']
    if(!domainList.some((x: string) => rawValue.includes(x))) {
      return rawValue;
    }
    //console.log("outside domainAware if statement: " + rawValue)
    try {
      const urlObj = new URL(rawValue);
      const currentHostname = location.hostname;
      return rawValue.replace(urlObj.hostname, currentHostname);
    } catch (Error) {
      return rawValue;
    }
  }
}

import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { ConfigurationDataService } from '../../../../../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../../../../../core/shared/operators';
@Component({
  selector: 'ds-item-page-uri-field',
  templateUrl: './item-page-uri-field.component.html',
  styleUrls: ['./item-page-uri-field.component.scss']
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

  @Input() renderInParagraph: boolean = false;

  constructor(
    private configService: ConfigurationDataService,
  ) {
    super();
  }

  public domainAwareValue (rawValue: string): string {
    this.configService.findByPropertyName("identifier.doi.resolver").pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((rd) => {
        if (!rd.hasSucceeded) {  return; }
        const domain = rd?.payload.values[0];
        if(rawValue.indexOf('https') == -1) {
          rawValue = domain + '/' + rawValue;
          return rawValue;
        }
      })
      return this.getDomainUrl(rawValue);
  }

  private getDomainUrl(rawValue:string): string{
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

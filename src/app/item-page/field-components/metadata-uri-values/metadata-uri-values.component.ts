import { Component, Input } from '@angular/core';

import { MetadataValuesComponent } from '../metadata-values/metadata-values.component';
import { MetadataValue } from '../../../core/shared/metadata.models';

/**
 * This component renders the configured 'values' into the ds-metadata-field-wrapper component as a link.
 * It puts the given 'separator' between each two values
 * and creates an 'a' tag for each value,
 * using the 'linktext' as it's value (if it exists)
 * and using the values as the 'href' attribute (and as value of the tag when no 'linktext' is defined)
 */
@Component({
  selector: 'ds-metadata-uri-values',
  styleUrls: ['./metadata-uri-values.component.scss'],
  templateUrl: './metadata-uri-values.component.html'
})
export class MetadataUriValuesComponent extends MetadataValuesComponent {

  /**
   * Optional text to replace the links with
   * If undefined, the metadata value (uri) is displayed
   */
  @Input() linktext: any;

  /**
   * The metadata values to display
   */
  @Input() mdValues: MetadataValue[];

  /**
   * The seperator used to split the metadata values (can contain HTML)
   */
  @Input() separator: string;

  /**
   * The label for this iteration of metadata values
   */
  @Input() label: string;
  /**
   * Whether or not the component is rendered inside a description list
   */
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

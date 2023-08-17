import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-generic-simple-metadata-section',
  templateUrl: './generic-simple-metadata-section.component.html',
  styleUrls: ['./generic-simple-metadata-section.component.scss']
})
export class GenericSimpleMetadataSectionComponent  {

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
  @Input() fields: string[];

  /**
  * Label i18n key for the rendered metadata
  */
  @Input() label: string;

  @Input() filterLang: boolean = false;

  @Input() subheading: boolean = false;

  /**
  * Whether or not the component is used in a description list
  */
  @Input() isDescriptionList: boolean = false;
 
}
 


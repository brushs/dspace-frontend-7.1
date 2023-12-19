import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-sponsorship-field',
    templateUrl: './item-page-sponsorship-field.component.html'
})
/**
 * This component is used for displaying the sponsorship (dc.description.sponsorship) of an item
 */
export class ItemPageSponsorshipFieldComponent  {

    /**
     * The item to display metadata for
     */
    @Input() item: Item;

    /**
     * Whether or not to display this item as part of a description list
     * Defaults to false
     */
    @Input() isDescriptionList = false;
    
    /**
     * Separator string between multiple values of the metadata fields defined
     * @type {string}
     */
    separator: string;

    /**
     * Fields (schema.element.qualifier) used to render their values.
     * In this component, we want to display values for metadata 'dc.description.sponsorship'
     */
    fields: string[] = [
        'dc.description.sponsorship'
    ];

    /**
     * Label i18n key for the rendered metadata
     */
    label = 'fosrc.item.edit.dynamic-field.label.sponsors';

}

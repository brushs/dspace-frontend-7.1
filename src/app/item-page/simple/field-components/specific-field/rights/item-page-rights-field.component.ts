import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-rights-field',
    templateUrl: './item-page-rights-field.component.html'
})
/**
 * This component is used for displaying the sponsorship (dc.identifier.issn) of an item
 */
export class ItemPageRightsFieldComponent extends ItemPageFieldComponent {

    /**
     * The item to display metadata for
     */
    @Input() item: Item;

    /**
     * Separator string between multiple values of the metadata fields defined
     * @type {string}
     */
    separator: string;

    /**
     * Fields (schema.element.qualifier) used to render their values.
     * In this component, we want to display values for metadata 'dc.identifier.issn'
     */
    fields: string[] = [
        'dc.rights'
    ];

}

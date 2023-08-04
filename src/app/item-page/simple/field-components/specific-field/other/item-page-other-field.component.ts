import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-other-field',
    templateUrl: './item-page-other-field.component.html'
})
/**
 * This component is used for displaying the sponsorship (dc.identifier.other) of an item
 */
export class ItemPageOtherFieldComponent extends ItemPageFieldComponent {

    /**
     * The item to display metadata for
     */
    @Input() item: Item;

    /**
     *  Whether or not the component is rendered inside a description list
     */
    @Input() isDescriptionList: boolean = false;
    
    /**
     * Separator string between multiple values of the metadata fields defined
     * @type {string}
     */
    separator: string;

    /**
     * Fields (schema.element.qualifier) used to render their values.
     * In this component, we want to display values for metadata 'dc.identifier.other'
     */
    fields: string[] = [
        'dc.identifier.other'
    ];

    /**
     * Label i18n key for the rendered metadata
     */
    label = 'item.page.other';

}

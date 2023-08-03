import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-issn-field',
    templateUrl: './item-page-issn-field.component.html'
})
/**
 * This component is used for displaying the sponsorship (dc.identifier.issn) of an item
 */
export class ItemPageIssnFieldComponent extends ItemPageFieldComponent {

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
     * In this component, we want to display values for metadata 'dc.identifier.issn'
     */
    fields: string[] = [
        'dc.identifier.issn'
    ];

    /**
     * Label i18n key for the rendered metadata
     */
    label = 'item.page.issn';

}

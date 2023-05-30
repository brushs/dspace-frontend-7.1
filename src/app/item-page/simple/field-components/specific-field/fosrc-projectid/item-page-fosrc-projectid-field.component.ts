import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-fosrc-projectid-field',
    templateUrl: './item-page-fosrc-projectid-field.component.html'
})
/**
 * This component is used for displaying the sponsorship (dc.identifier.issn) of an item
 */
export class ItemPageFOSRCProjectIdFieldComponent extends ItemPageFieldComponent {

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
        'dc.identifier.fosrcprojectid'
    ];

    /**
     * Label i18n key for the rendered metadata
     */
    label = 'item.page.fosrcprojectid';

}

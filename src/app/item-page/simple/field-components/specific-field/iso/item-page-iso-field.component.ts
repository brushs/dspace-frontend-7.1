import { Component, Input } from '@angular/core';

import { Item } from '../../../../../core/shared/item.model';
import { Metadata } from '../../../../../core/shared/metadata.utils';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-iso-field',
    templateUrl: './item-page-iso-field.component.html'
})
/**
 * This component is used for displaying the sponsorship (dc.language.iso) of an item
 */
export class ItemPageIsoFieldComponent extends ItemPageFieldComponent {

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
     * In this component, we want to display values for metadata 'dc.language.iso'
     */
    fields: string[] = [
        'dc.language.iso', 'local.language', 'local.language.other', 'local.language.en', 'local.language.fr', 'local.language.fr-en', 'dc.language'
    ];

    /**
     * Label i18n key for the rendered metadata
     */
    label = 'item.page.iso';

    public getLanguageValue(): Metadata {
        let languageFields: string[] = ['dc.language.iso', 'dc.language', 'local.language', 'local.language.other', 'local.language.en', 'local.language.fr', 'local.language.fr-en']

        let returnValue = null;

        for(var languageField of languageFields) {
            returnValue = this.item.firstMetadata(languageField);
            if("enfr".includes(returnValue)) {
                break;
            }
        };

        return returnValue;
    }
}

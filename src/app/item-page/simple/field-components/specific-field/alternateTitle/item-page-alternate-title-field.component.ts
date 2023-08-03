import { Component, Input } from '@angular/core';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { LocaleService } from '../../../../../core/locale/locale.service';

import { Item } from '../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { ItemPageFieldComponent } from '../item-page-field.component';
import {MetadataFieldWrapperDlComponent} from '../../../../field-components/metadata-field-wrapper-description-list/metadata-field-wrapper-description-list.component'

@Component({
    selector: 'ds-item-page-alternative-title-field',
  templateUrl: './item-page-alternative-title-field.component.html'
})
/**
 * This component is used for displaying the issue date (dc.date.issued) metadata of an item
 */
export class ItemPageAlternateTitleFieldComponent extends ItemPageFieldComponent {

    /**
     * The item to display metadata for
     */
    @Input() item: Item;

    /**
     * Separator string between multiple values of the metadata fields defined
     * @type {string}
     */
    separator = '<br/>';

    /**
     * Fields (schema.element.qualifier) used to render their values.
     * In this component, we want to display values for metadata 'dc.date.issued'
     */
    fields: string[] = [
      'dc.title.fosrctranslation', 'dc.title.alternative', 'dc.title.alternative-fosrctranslation'
    ];

    /**
     * Label i18n key for the rendered metadata
     */
    label = 'alternative.title';
    /**
     * Translated Values
     */
    values: MetadataValue[];
  
  constructor(private dsoNS: DSONameService, private localeService: LocaleService) {
    super();
  }
  ngOnInit() {
    this.values = this.dsoNS.getMetadataByFieldAndLanguage(this.item, this.fields, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
  }
}

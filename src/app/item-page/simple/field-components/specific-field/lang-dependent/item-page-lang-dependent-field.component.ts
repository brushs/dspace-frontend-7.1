import { Component, Input } from '@angular/core';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { LocaleService } from '../../../../../core/locale/locale.service';

import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
    selector: 'ds-item-page-lang-dependent-field',
    templateUrl: './item-page-lang-dependent-field.component.html'
})
/**
 * This component is used for displaying language dependent fields, like dc.type_en, dc.type_fr, etc.
 */
export class ItemPageLangDependentComponent extends ItemPageFieldComponent {

    /**
     * The item to display metadata for
     */
    @Input() item: Item;


    /**
     * Label i18n key for the rendered metadata
     */
    @Input() label;

    /**
     * Field before transformation, like dc.type.
     * The final field name will be field + '_fr' or field + '_en', based on the current language
     * For example, if field is 'dc.type', and the current language is 'fr', the final field will be 'dc.type_fr'
     */
    @Input() field: string;


    /**
     * Translated Values. Usually it will be the value of the field + '_fr' or field + '_en', based on the current language.
     * If both are empty, it will be the value of the field before transformation, like dc.type.
     */
    value : string;


  constructor(private dsoNS: DSONameService, private localeService: LocaleService) {
    super();
  }
  ngOnInit() {
    var value: string;
    let currLang = this.localeService.getCurrentLanguageCode();
    if (currLang === 'fr') {
      value = this.item.firstMetadataValue(this.field + '_fr');
    } else if (currLang === 'en'){
      value = this.item.firstMetadataValue(this.field + '_en');
    }

    // if the value is empty, we will use the value of the field before transformation, like dc.type
    if (value === undefined) {
      value = this.item.firstMetadataValue(this.field);
    }
    this.value = value;

  }
}

import { Component, Input, Output } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { MetadataValue } from 'src/app/core/shared/metadata.models';
import { LocaleService } from '../../../../../core/locale/locale.service';

@Component({
  selector: 'ds-item-page-withemail-field',
  templateUrl: './item-page-withemail-field.component.html',
})
/**
 * This component is for values with emails
 */
export class ItemPageWithEmailComponent extends ItemPageFieldComponent {
  /**
   * The item to display metadata for
   */
  @Input() item: Item;
  @Input() field: string;




  @Output() value: string;
  @Output() mailtoLink: string;
  @Output() mailtoLabel: string;
  @Output() valuePost: string;

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string ;
  @Input() hideIfEmpty: boolean = false;
  isHidden: boolean = false;

  constructor(public  localeService: LocaleService ) {
    super();
  }

  ngOnInit() {
    var retrievedValue: string;
    var allMetaData:MetadataValue[];
    var segs:string[];
    let currLang = this.localeService.getCurrentLanguageCode();

    allMetaData = this.item.allMetadata(this.field);
    allMetaData.forEach((element, index) => {
      if (element.language == currLang) {
         retrievedValue=  element.value;
      }
    });

    if (retrievedValue === undefined)
      retrievedValue= this.item.firstMetadataValue(this.field);

    if (retrievedValue === undefined)
    {
      if (this.hideIfEmpty) {
        this.isHidden = true;
        this.value = undefined;
      }
      else {
        this.value = 'N/A';
      }
      return; // exit the function
    }

    // get the email among the text
    var email = retrievedValue.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
    if (email) {
      // contruct a mailto link
      var mailto = 'mailto:' + email[0];
      this.mailtoLink = mailto;
      this.mailtoLabel = email[0];
      //segement the text with the email
      retrievedValue = retrievedValue.replace(email[0], '##')
      segs = retrievedValue.split('##');
      // embed the mailto link in the text
      this.value = segs[0]
      this.valuePost = segs[1];
    }
    else {
      this.value = retrievedValue;
    }
  }
}

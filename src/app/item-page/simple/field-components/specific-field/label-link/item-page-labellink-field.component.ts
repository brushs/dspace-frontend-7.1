import { Component, Input, Output,EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import * as _ from 'lodash';
import { MetadataValue } from '../../../../../core/shared/metadata.models';

const MAX_ITEMS = 5;

@Component({
  selector: 'ds-item-page-labellink-field',
  templateUrl: './item-page-labellink-field.component.html',
})
/**
 * This component is for values with
 */
export class ItemPageLabelLinkComponent extends ItemPageFieldComponent {
  /**
   * The item to display metadata for
   */
  @Input() item: Item;
  @Input() field: string;
  @Input() conditional:boolean = false;
  // Output property to notify parent component
  @Output() shouldHide: EventEmitter<boolean> = new EventEmitter<boolean>();



  @Output() values: string[][];

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;
  @Input() hideIfEmpty: boolean = false;
  isHidden: boolean = false;

  constructor(public tralateService: TranslateService) {
    super();
  }

  ngOnInit() {
    var itemsAdded = 0;
    var retrievedMetadata: MetadataValue[];
    this.values = [];
    //get current language
    var currentLang = this.tralateService.currentLang;

    retrievedMetadata = this.item.allMetadata(this.field);
    if (retrievedMetadata.length === 0) {
      if (this.hideIfEmpty) {
        this.isHidden = true;
        this.shouldHide.emit(false); // should not hide the normal file download link
      }
      this.values.push(['N/A', 'N/A']);
      return
    }
    retrievedMetadata.forEach((element, index) => {
      if (itemsAdded >= MAX_ITEMS) {
        return;
      }
      var value = element.value;
      if (value.includes('GID')) {
        retrievedMetadata.splice(index, 1);
      }
      if ( element.language !== null && element.language.length> 0  && element.language !== currentLang)
        //skip this value if it is not in the current language
        return;
      var link = value.match(/<a href="([^"]*)">([^<]*)<\/a>/);
      if (link) {
        //push the link and the label to the values array
        this.values.push([link[1], link[2]]);
        itemsAdded++;
        if (this.conditional)
          // check if the value contains a special link "geoscan.nrcan.gc.ca" or  the text contains a
          // special text "Download - Télécharger" to hide the field
          if (link[1].includes('geoscan.nrcan.gc.ca') || link[2].includes('Download - Télécharger')) {
            this.shouldHide.emit(true);
            this.isHidden = false;
          }else{
            this.shouldHide.emit(false);
            this.isHidden = true;
          }
        return;
      }
      else {
        this.values.push([value, value])
        itemsAdded++;
      }

    });

  }
}


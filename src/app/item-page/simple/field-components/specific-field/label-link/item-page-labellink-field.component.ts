import { Component, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Item } from 'src/app/core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import * as _ from 'lodash';
import { MetadataValue } from 'src/app/core/shared/metadata.models';


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
    var retrievedMetadata: MetadataValue[];
    this.values = [];
    //get current language
    var currentLang = this.tralateService.currentLang;

    retrievedMetadata = this.item.allMetadata(this.field);
    if (retrievedMetadata.length === 0) {
      if (this.hideIfEmpty) {
        this.isHidden = true;
      }
      this.values.push(['N/A', 'N/A']);
      return
    }
    retrievedMetadata.forEach((element, index) => {
      var value = element.value;
      if (value.includes('GID')) {
        retrievedMetadata.splice(index, 1);
      }
      if ( element.language.length> 0  && element.language !== currentLang)
        //skip this value if it is not in the current language
        return;
      var link = value.match(/<a href="([^"]*)">([^<]*)<\/a>/);
      if (link) {
        //push the link and the label to the values array
        this.values.push([link[1], link[2]]);
        return;
      }
      else {
        this.values.push([value, value])
      }

    });

  }
}


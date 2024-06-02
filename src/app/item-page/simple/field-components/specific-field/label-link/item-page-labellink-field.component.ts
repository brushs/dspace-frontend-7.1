import { Component, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Item } from 'src/app/core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import * as _ from 'lodash';


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
    var retrievedValues: string[];
    this.values = [];

    retrievedValues = this.item.allMetadataValues(this.field);
    if (retrievedValues.length === 0) {
      if (this.hideIfEmpty) {
        this.isHidden = true;
      }
      this.values.push(['N/A', 'N/A']);
      return
    }
    retrievedValues.forEach((element, index) => {
      if (element.includes('GID')) {
        retrievedValues.splice(index, 1);
      }
      var link = element.match(/<a href="([^"]*)">([^<]*)<\/a>/);
      if (link) {
        //push the link and the label to the values array
        this.values.push([link[1], link[2]]);
        return;
      }
      else {
        this.values.push([element, element])
      }

    });

  }
}


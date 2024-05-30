import { Component, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Item } from 'src/app/core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';


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




  @Output() value: string;
  @Output() link: string;

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
    var retrievedValue: string;
    var segs: string[];

    retrievedValue = this.item.firstMetadataValue(this.field);

    if (retrievedValue === undefined) {
      if (this.hideIfEmpty) {
        this.isHidden = true;
        this.value = undefined;
      }
      else {
        this.value = 'N/A';
      }
      return; // exit the function
    }

    // get the link and label among the value, for example: <a href="http://www.google.com">link label</a>
    var link = retrievedValue.match(/<a href="([^"]*)">([^<]*)<\/a>/);
    if (link) {
      this.link = link[1];
      this.value = link[2];
      return;
    }
    else {
      this.value = retrievedValue;
      this.link = retrievedValue;
    }
  }
}


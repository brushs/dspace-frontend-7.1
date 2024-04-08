import { Component, Input, Output } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-item-page-externurl-field',
  templateUrl: './item-page-externurl-field.component.html',
})
/**
 * This component is for reformating the polygon metadata field
 */
export class ItemPageExternalUrlieldComponent extends ItemPageFieldComponent {
  /**
   * The item to display metadata for
   */
  @Input() item: Item;
  @Input() field: string;




  @Output() value: string;
  @Output() values: string[];
  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string ;
  @Input() hideIfEmpty: boolean = false;
  isHidden: boolean = false;

  constructor(public tralateService: TranslateService) {
    super();
  }

  ngOnInit() {
    var value: string;
    var values: string[];

    value = this.item.firstMetadataValue(this.field);
    values = this.item.allMetadataValues(this.field);
    if (values.length === 0) {
      this.values = [];
      if (this.hideIfEmpty) {
        this.isHidden = true;
        return;
      }
      this.values.push('N/A');
      return
    }

    this.values = values;

    if (value === undefined)
    {
      if (this.hideIfEmpty) {
        this.isHidden = true;
        this.value = undefined;
        return;
      }
      else {
        value = 'N/A';
      }
    }
    this.value = value;
  }
}

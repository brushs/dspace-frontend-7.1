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

    value = this.item.firstMetadataValue(this.field);
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

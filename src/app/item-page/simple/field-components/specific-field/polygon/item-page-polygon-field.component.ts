import { Component, Input, Output } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-item-page-polygon-field',
  templateUrl: './item-page-polygon-field.component.html',
})
/**
 * This component is for reformating the polygon metadata field
 */
export class ItemPagePolygonFieldComponent extends ItemPageFieldComponent {
  /**
   * The item to display metadata for
   */
  @Input() item: Item;



  fieldsBbox: string = 'geospatial.bbox';

  @Output() valueLngLat: string;
  /**
   * Label i18n key for the rendered metadata
   */
  label = 'Polygon';

  isHidden = false;

  constructor(public tralateService: TranslateService) {
    super();
  }

  ngOnInit() {
    var valueBbox: string;

    valueBbox = this.item.firstMetadataValue(this.fieldsBbox);
    // the raw value is a string like "ENVELOPE(-180.0, 180.0, 90.0, -90.0)"
    // remove the ENVELOPE and the parenthesis
    if (valueBbox === undefined) {
      valueBbox = '';
    }
    if (valueBbox.length == 0) {
      this.isHidden = true;
    }
    valueBbox = valueBbox.replace('ENVELOPE(', '');
    valueBbox = valueBbox.replace(')', '');
    this.valueLngLat = valueBbox;
    console.log('valueLngLat: ' + this.valueLngLat);
  }
}

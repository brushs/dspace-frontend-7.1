import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { AlertType } from '../../alert/aletr-type';

@Component({
  selector: 'ds-item-alerts',
  templateUrl: './item-alerts.component.html',
  styleUrls: ['./item-alerts.component.scss']
})
/**
 * Component displaying alerts for an item
 */
export class ItemAlertsComponent implements OnInit{

  /**
   * The Item to display alerts for
   */
  @Input() item: Item;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  ngOnInit(): void {
    let item = this.item;
    console.log('ItemAlertsComponent ngOnInit()');
  }
}

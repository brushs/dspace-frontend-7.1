import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ItemComponent } from '../shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntypedItemComponent extends ItemComponent {
  /* Start FOSRC Changes - 1594 */
  hasDcRelationMetaData: boolean = false;
  hasDcRelationMetaData_isformatof: boolean = false;
  hasDcRelationMetaData_ispartof: boolean = false;
  hasDcRelationMetaData_isreferencedby: boolean = false;
  hasDcRelationMetaData_isrelatedto: boolean = false;
  hasDcRelationMetaData_isreplacedby: boolean = false;
  hasDcRelationMetaData_isrequiredby: boolean = false;
  hasDcRelationMetaData_istranslationof: boolean = false;
  hasDcRelationMetaData_isversionof: boolean = false;
  checkRelationMetaData (): void {
    if (this.object.metadata['dc.relation.isformatof'] ||
    this.object.metadata['dc.relation.ispartof'] ||
    this.object.metadata['dc.relation.isreferencedby'] ||
    this.object.metadata['dc.relation.isrelatedto'] ||
    this.object.metadata['dc.relation.isreplacedby'] ||
    this.object.metadata['dc.relation.isrequiredby'] ||
    this.object.metadata['dc.relation.istranslationof'] ||
    this.object.metadata['dc.relation.isversionof']) {
      this.hasDcRelationMetaData = true;
      if (this.object.metadata['dc.relation.isformatof']){
          this.hasDcRelationMetaData_isformatof = true;
      }
      if (this.object.metadata['dc.relation.ispartof']){
        this.hasDcRelationMetaData_ispartof = true;
      }
      if (this.object.metadata['dc.relation.isreferencedby']){
        this.hasDcRelationMetaData_isreferencedby = true;
      }
      if (this.object.metadata['dc.relation.isrelatedto']){
        this.hasDcRelationMetaData_isrelatedto = true;
      }
      if (this.object.metadata['dc.relation.isreplacedby']){
        this.hasDcRelationMetaData_isreplacedby = true;
      }
      if (this.object.metadata['dc.relation.isrequiredby']){
        this.hasDcRelationMetaData_isrequiredby = true;
      }
      if (this.object.metadata['dc.relation.istranslationof']){
        this.hasDcRelationMetaData_istranslationof = true;
      }
      if (this.object.metadata['dc.relation.isversionof']){
        this.hasDcRelationMetaData_isversionof = true;
      }
    }
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.checkRelationMetaData ();
  }
  /* End of FOSRC Changes */
}

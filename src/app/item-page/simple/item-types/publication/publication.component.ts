import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ItemComponent } from '../shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Subscription } from 'rxjs';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent('Publication', ViewMode.StandalonePage)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent {

  private myObservableSubscription: Subscription;
  public ownCollection: any;
  ngOnInit(): void {
    const collection = this.object.owningCollection;
    super.ngOnInit();
    this.myObservableSubscription = collection.subscribe(
      (value) => {
        console.log('Value received from the Observable:', value);
        if (value?.isSuccess)
          this.ownCollection = value.payload;
      }
    );
    console.log('PublicationComponent ngOnInit()');
  }

}

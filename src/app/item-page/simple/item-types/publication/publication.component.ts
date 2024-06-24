import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ItemComponent } from '../shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

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
  displayLarge = false;

  handleShouldHide(shouldHide: boolean) {
    // shouldHide means should hide the normal file download link
    // also means show the large file download link
    this.displayLarge = shouldHide;
    console.log('shouldHide:', shouldHide);
  }
}

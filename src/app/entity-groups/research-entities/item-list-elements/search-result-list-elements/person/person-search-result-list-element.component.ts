import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { ItemSearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { uniqueId } from 'lodash';

@listableObjectComponent('PersonSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-person-search-result-list-element',
  styleUrls: ['./person-search-result-list-element.component.scss'],
  templateUrl: './person-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Person
 */
export class PersonSearchResultListElementComponent extends ItemSearchResultListElementComponent {

  get name() {
    // issue 348 start
    if (this.firstMetadataValue('person.identifier.orcid')){
      return this.firstMetadataValue('person.familyName') + ', ' + this.firstMetadataValue('person.givenName') + ' - ' + this.firstMetadataValue('person.identifier.orcid');
    } else {
      return this.firstMetadataValue('person.familyName') + ', ' + this.firstMetadataValue('person.givenName');
    }
    // issue 348 end
  }
}

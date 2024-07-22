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
    // issue 348 and 248 start
    var display_info : string = this.firstMetadataValue('person.familyName') + ', ' + this.firstMetadataValue('person.givenName');
    if (this.firstMetadataValue('person.identifier.orcid')){
      display_info = display_info + ' - ' + this.firstMetadataValue('person.identifier.orcid');
    }
    if (this.firstMetadataValue('dc.identifier.employeeid')){
      display_info = display_info + '(' + this.firstMetadataValue('dc.identifier.employeeid') + ')';
    }
    return display_info;
    // issue 348 and 248 end
  }
}

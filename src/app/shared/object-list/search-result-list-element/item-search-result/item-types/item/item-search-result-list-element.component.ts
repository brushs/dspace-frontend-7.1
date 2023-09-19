import { 
  Component
} from '@angular/core';
import { listableObjectComponent } from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
import { MetadataTranslatePipe } from '../../../../../utils/metadata-translate.pipe';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {

  /**
   * isCollapsed$ observable that tracks whether
   * the truncatable area has been collapsed
   */
  isCollapsed$;

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.isCollapsed$ = this.isCollapsed();
  }

  translateMetadata(keys: string | string[], dso: any) {
    const pipe = new MetadataTranslatePipe(this.dsoNameService, this.localeService);
    return pipe.transform(keys, dso);
  }

  getTranslatedValue(dso: any): any {
    return this.translateMetadata(['dc.description.abstract', 'dc.description.abstract-fosrctranslation'], dso)[0];
  }

  getDescLanguageAttribute(payload: any): string | undefined {
    const translatedDesc = this.getTranslatedValue(payload);
    const language = translatedDesc?.language;
    return this.getLanguageAttribute(language);
  }


  getLanguageAttribute(language: any): string | undefined {
    return (language !== undefined && language !== null && language !== '' && (language.toLowerCase() === 'en' || language.toLowerCase() === 'fr')) ? language : undefined;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LocaleService } from '../../../../core/locale/locale.service';
import { Item } from '../../../../core/shared/item.model';
import { MetadataValue } from '../../../../core/shared/metadata.models';
import { getItemPageRoute } from '../../../item-page-routing-paths';

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent implements OnInit {
  @Input() object: Item;

  /**
   * Route to the item page
   */
  itemPageRoute: string;

  mediaViewer = environment.mediaViewer;

  dsoOfficialTitle: MetadataValue[]; //FOSRC added
  dsoTranslatedTitle: MetadataValue; //FOSRC added
  dsoAlternativeTitleExists: boolean; //FOSRC added
  dsoAlternateTitles: MetadataValue[]; //FOSRC added

  public constructor(protected dsoNameService: DSONameService, protected localeService: LocaleService) {
  }

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.object);
    this.dsoOfficialTitle = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
    this.dsoTranslatedTitle = this.dsoNameService.getTranslatedName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
    this.dsoAlternativeTitleExists = this.dsoNameService.getAlternativeTitleExists(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
    this.dsoAlternateTitles = this.dsoNameService.getMetadataByFieldAndLanguage(this.object, ['dc.title.fosrctranslation', 'dc.title.alternative', 'dc.title.alternative-fosrctranslation'], this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
    //console.log("ngInit in Item-Component: AlternateTitlesExist: " + this.dsoAlternativeTitleExists + " AlternateTitles: ", this.dsoAlternateTitles);
  }
}

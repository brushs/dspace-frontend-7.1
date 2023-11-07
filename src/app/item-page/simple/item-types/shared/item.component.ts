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
  dsoSponsorship: MetadataValue[]; //FOSRC added
  dsoDoi: MetadataValue[]; //FOSRC added
  dsoGovdoc: MetadataValue[]; //FOSRC added
  dsoIsbn: MetadataValue[]; //FOSRC added
  dsoIssn: MetadataValue[]; //FOSRC added
  dsoIso: MetadataValue[]; //FOSRC added
  dsoOrganization: MetadataValue[]; //FOSRC added
  dsoOther: MetadataValue[]; //FOSRC added
  dsoKeywords: MetadataValue[]; //FOSRC added

  public constructor(protected dsoNameService: DSONameService, protected localeService: LocaleService) {
  }

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.object);
    this.dsoOfficialTitle = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
    this.dsoTranslatedTitle = this.dsoNameService.getTranslatedName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
    this.dsoAlternativeTitleExists = this.dsoNameService.getAlternativeTitleExists(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
    this.dsoAlternateTitles = this.dsoNameService.getMetadataByFieldAndLanguage(this.object, ['dc.title.fosrctranslation', 'dc.title.alternative', 'dc.title.alternative-fosrctranslation'], this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en'); //FOSRC added
    this.dsoSponsorship = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en');
    this.dsoDoi = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en');
    this.dsoGovdoc = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en');
    this.dsoIsbn = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en');
    this.dsoIssn = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en');
    this.dsoIso = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en');
    this.dsoOrganization = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en');
    this.dsoOther = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en');
    this.dsoKeywords = this.dsoNameService.getOfficialName(this.object, this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en');
    //console.log("ngInit in Item-Component: AlternateTitlesExist: " + this.dsoAlternativeTitleExists + " AlternateTitles: ", this.dsoAlternateTitles);
  }
}

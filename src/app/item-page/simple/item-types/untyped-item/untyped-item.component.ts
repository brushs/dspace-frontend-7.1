import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ItemComponent } from '../shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { MetadataValue } from 'src/app/core/shared/metadata.models';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['../../../../../themes/wetoverlay/styles/static-pages.scss', './untyped-item.component.scss'],
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
  authors: MetadataValue[];
  readonly descriptionElementId: string = 'description-element';
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
    this.authors = this.object.findMetadataSortedByPlace(['dc.contributor.author', 'dc.creator']);
  }

  public metadataContainsKey(key: string): boolean {
    return this.object.metadata[key] ? true : false;
  }

  public hasLanguage(): boolean {
    let languageFields: string[] = ['dc.language.iso', 'dc.language', 'local.language', 'local.language.other', 'local.language.en', 'local.language.fr', 'local.language.fr-en']
    return this.metadataHasOneOfTheseFields(languageFields);
  }

  public hasAlternativeTitle(): boolean {
    var keys = ['dc.title.fosrctranslation', 'dc.title.alternative', 'dc.title.alternative-fosrctranslation'];
    return this.metadataHasOneOfTheseFields(keys);
  }

  public hasAbstract(): boolean {
    var keys = ['dc.description.abstract', 'dc.description.abstract-fosrctranslation'];
    return this.metadataHasOneOfTheseFields(keys);
  }

  public hasIdentifiers(): boolean {
    var keyList: string[] = ['dc.identifier.govdoc','dc.identifier.issn','dc.identifier.isbn','dc.identifier.other','dc.identifier.organization','dc.identifier.pubmedID']
    return this.metadataHasOneOfTheseFields(keyList);
  } 

  public hasPubMedIDIdentifier(): boolean {
    return this.object.metadata['dc.identifier.pubmedID'] ? true : false;
  }

  public hasBook(): boolean {
    let languageFields: string[] = ['local.book.series', 'local.book.seriesnum', 'local.book.pagination', 'local.book.edition']
    return this.metadataHasOneOfTheseFields(languageFields);
  }

  public hasBookChapter(): boolean {
    let languageFields: string[] = ['local.chapter.book', 'local.chapter.series', 'local.chapter.seriesnum', 'local.chapter.pagination', 'local.chapter.edition']
    return this.metadataHasOneOfTheseFields(languageFields);
  }

  public hasProject(): boolean {
    let languageFields: string[] = ['dc.title.fosrcprojectname', 'dc.title.fosrcprojectid']
    return this.metadataHasOneOfTheseFields(languageFields);
  }

  public hasReport(): boolean {
    let languageFields: string[] = ['local.report.edition', 'local.report.reportnum', 'local.report.series', 'local.report.seriesnum', 'local.reporttype']
    return this.metadataHasOneOfTheseFields(languageFields);
  }

  public hasArticle(): boolean {
    let languageFields: string[] = ['dc.date.submitted','dc.date.accepted','local.acceptedmanuscript.journaltitle', 'local.acceptedmanuscript.journalvolume', 'local.acceptedmanuscript.journalissue', 'local.acceptedmanuscript.articlenum']

    return this.metadataHasOneOfTheseFields(languageFields);
  }

  public hasConference(): boolean {
    let languageFields: string[] = ['local.conference.name',
      'local.conference.startdate',
      'local.conference.enddate',
      'dc.location.fosrcconference',
      'local.conference.series',
      'local.conference.edition',
      'local.conferencetype']

    return this.metadataHasOneOfTheseFields(languageFields);
  }

  public hasDownloads(): boolean {
    return this.object.bundles != null;
  }

  private metadataHasOneOfTheseFields(fields: string[]): boolean {

    for(var field of fields) {
        if(this.metadataContainsKey(field)) {
          return true;
        }
    };

    return false
  }

  scrollToElement(event: Event, elementId: string): void {
    event.preventDefault(); // Prevent the default navigation
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  /* End of FOSRC Changes */
}

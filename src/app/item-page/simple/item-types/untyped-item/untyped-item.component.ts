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

  public hasIdentifiers(): boolean {
    var keyList: string[] = ['govdoc','issn','isbn','other','organization','pubmedID']
    var result: boolean = false;
    for(let item of keyList) {
      if(this.object.metadata['dc.identifier.' + item]) {
        result = true;
        break;
      }
    };
    return result;
  }

  public hasRights(): boolean {
    if(this.object.metadata['dc.rights']) {
        return true;
    }
    return false;
  }

  public hasLanguage(): boolean {
    let languageFields: string[] = ['dc.language.iso', 'dc.language', 'local.language', 'local.language.other', 'local.language.en', 'local.language.fr', 'local.language.fr-en']

    let returnValue = false;
    
    for(var languageField of languageFields) {
        if(this.object.metadata[languageField]) {
          returnValue = true;
          break;
        }
    };

    return returnValue;
  }

  public hasBook(): boolean {
    let languageFields: string[] = ['local.book.series', 'local.book.seriesnum', 'local.book.pagination', 'local.book.edition']

    let returnValue = false;
    
    for(var languageField of languageFields) {
        if(this.object.metadata[languageField]) {
          returnValue = true;
          break;
        }
    };

    return returnValue;
  }

  public hasBookChapter(): boolean {
    let languageFields: string[] = ['local.chapter.book', 'local.chapter.series', 'local.chapter.seriesnum', 'local.chapter.pagination', 'local.chapter.edition']

    let returnValue = false;
    
    for(var languageField of languageFields) {
        if(this.object.metadata[languageField]) {
          returnValue = true;
          break;
        }
    };

    return returnValue;
  }

  public hasProject(): boolean {
    let languageFields: string[] = ['dc.title.fosrcprojectname', 'dc.title.fosrcprojectid']

    let returnValue = false;
    
    for(var languageField of languageFields) {
        if(this.object.metadata[languageField]) {
          returnValue = true;
          break;
        }
    };

    return returnValue;
  }

  public hasReport(): boolean {
    let languageFields: string[] = ['local.report.edition', 'local.report.reportnum', 'local.report.series', 'local.report.seriesnum', 'local.reporttype']

    let returnValue = false;
    
    for(var languageField of languageFields) {
        if(this.object.metadata[languageField]) {
          returnValue = true;
          break;
        }
    };

    return returnValue;
  }

  public hasArticle(): boolean {
    let languageFields: string[] = ['dc.date.submitted','dc.date.accepted','local.acceptedmanuscript.journaltitle', 'local.acceptedmanuscript.journalvolume', 'local.acceptedmanuscript.journalissue', 'local.acceptedmanuscript.articlenum']

    let returnValue = false;
    
    for(var languageField of languageFields) {
        if(this.object.metadata[languageField]) {
          returnValue = true;
          break;
        }
    };

    return returnValue;
  }

  public hasConference(): boolean {
    let languageFields: string[] = ['local.conference.edition', 'local.conference.enddate', 'local.conference.name', 'local.conference.series', 'local.conference.startdate', 'local.conferencetype', 'local.pagination', 'local.peerreview']

    let returnValue = false;
    
    for(var languageField of languageFields) {
        if(this.object.metadata[languageField]) {
          returnValue = true;
          break;
        }
    };

    return returnValue;
  }
  /* End of FOSRC Changes */
}

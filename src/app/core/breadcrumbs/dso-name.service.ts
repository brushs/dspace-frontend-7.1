import { Injectable } from '@angular/core';
import { hasValue } from '../../shared/empty.util';
import { DSpaceObject } from '../shared/dspace-object.model';
import { TranslateService } from '@ngx-translate/core';
import {
  MetadataValue
} from '../shared/metadata.models';
import * as e from 'express';
import { Metadata } from '../shared/metadata.utils';

/**
 * Returns a name for a {@link DSpaceObject} based
 * on its render types.
 */
@Injectable({
  providedIn: 'root'
})
export class DSONameService {

  constructor(private translateService: TranslateService) {

  }

  /**
   * Functions to generate the specific names.
   *
   * If this list ever expands it will probably be worth it to
   * refactor this using decorators for specific entity types,
   * or perhaps by using a dedicated model for each entity type
   *
   * With only two exceptions those solutions seem overkill for now.
   */
  private readonly factories = {
    Person: (dso: DSpaceObject): string => {
      return `${dso.firstMetadataValue('person.familyName')}, ${dso.firstMetadataValue('person.givenName')}`;
    },
    OrgUnit: (dso: DSpaceObject): string => {
      return dso.firstMetadataValue('organization.legalName');
    },
    Default: (dso: DSpaceObject): string => {
      // If object doesn't have dc.title metadata use name property
      //console.log("This is coming from the factory service method!");
      return dso.firstMetadataValue('dc.title') || dso.name || this.translateService.instant('dso.name.untitled');
    }
  };

  /**
   * Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getName(dso: DSpaceObject, currentLang: string = undefined): string {
    let originalResult:string;
    const types = dso.getRenderTypes();
    const match = types
      .filter((type) => typeof type === 'string')
      .find((type: string) => Object.keys(this.factories).includes(type)) as string;
    //console.log("This is coming from the get function in the bottom! match: " + match);
    if (hasValue(match)) {
      originalResult = this.factories[match](dso);
    } else {
      originalResult =  this.factories.Default(dso);
    }

    if(!currentLang) {
      return originalResult;
    }

    // if: dso.type.value is collection or community
    // then: getTranslatedName if available else take getOfficialName
    // else: getOfficialName

    let translatedName:string = undefined;
    let officialName:string = undefined;
    let mdValue:MetadataValue = this.getTranslatedName(dso, currentLang);
    if(mdValue && mdValue.value){ 
      translatedName = mdValue.value;
    }
    officialName = this.getOfficialName(dso, currentLang)[0]?.value;
    //console.log("DSO-name.service: getName: types count: %s typesArr[0]: %s", (types as []).length, types[0]);
    let isItem = dso.getDSpaceType() === "Item" ? "Item" : undefined;
    if(isItem || !(translatedName)) {
      return officialName
    }else {
      return translatedName;
    }
  }
  // FOSRC End

  
  /** OSPR Change start
   * Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getOfficialName(dso: DSpaceObject, currentLang: string): MetadataValue[] {
    let officialTitles: MetadataValue[] = [];
    let fosrctranslation: MetadataValue;
    if(currentLang !== undefined && currentLang !== null) {
      let allTitles: MetadataValue[] = dso.allMetadata('dc.title');
      let allTranslatedTitles: MetadataValue[] = dso.allMetadata('dc.title.fosrctranslation');
      allTitles?.forEach(function (singleTitle, index) {
        if(currentLang == singleTitle?.['language']) {
          officialTitles.push(singleTitle);
        } else if ( fosrctranslation = allTranslatedTitles?.find(title => title.language === currentLang)) {
          officialTitles.push(fosrctranslation);
        }        
      });
    }

    if(officialTitles.length == 0) {
      return dso.allMetadata('dc.title');
    }
    
    return officialTitles;
  }

  /* Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getTranslatedName(dso: DSpaceObject, currentLang: string): MetadataValue {
    let allTitles: MetadataValue[] = dso.allMetadata('dc.title');
    let fosrcTitleMetadata = dso.firstMetadata('dc.title.fosrctranslation');
    let translation;
    if(translation = allTitles?.find( title => title?.language == currentLang)) {
      return translation;
    } else if(fosrcTitleMetadata?.language === currentLang ) {
      return fosrcTitleMetadata;
    } else {
      return undefined;
    }
  }

  /* Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getAlternativeTitleExists(dso: DSpaceObject, currentLang: string): boolean {
    return (this.getMetadataByFieldAndLanguage(dso, ['dc.title.alternative', 'dc.title.alternative-fosrctranslation', 'dc.title.fosrctranslation'], currentLang)).length > 0;
  }

  getMetadataByFieldAndLanguage(dso: DSpaceObject, fields: string[], currentLang: string): MetadataValue[] {
    let result: MetadataValue[] = [];
    dso.allMetadata(fields).forEach(function (singleItem) {
      if (singleItem.language === currentLang) {
        //console.log("DSO - Name_service: getMetadataByFieldAndLanguage currentLang:" + currentLang + ", itemLang = " + singleItem.language + ", item value:" + singleItem.value);
        result.push(singleItem);
      }
    })
    //console.log("DSO - Name_service: getMetadataByFieldAndLanguage: ", result);
    return result;
  }
  // OSPR Change end
}

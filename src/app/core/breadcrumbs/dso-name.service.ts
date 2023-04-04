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
  getName(dso: DSpaceObject): string {
    const types = dso.getRenderTypes();
    const match = types
      .filter((type) => typeof type === 'string')
      .find((type: string) => Object.keys(this.factories).includes(type)) as string;
    //console.log("This is coming from the get function in the bottom! match: " + match);
    if (hasValue(match)) {
      return this.factories[match](dso);
    } else {
      return  this.factories.Default(dso);
    }
  }

  
  /** OSPR Change start
   * Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getOfficialName(dso: DSpaceObject, currentLang: string): MetadataValue[] {
    let officialTitles: MetadataValue[] = []
    if(currentLang !== undefined && currentLang !== null) {
      let allTitles:MetadataValue[] = dso.allMetadata('dc.title');
      allTitles.forEach(function (singleTitle) {
        if(currentLang == singleTitle['language']) {
          //console.log("Official Title: " + singleTitle.value);
          officialTitles.push(singleTitle);
        }        
      });
    } else {
      //console.log("Official Title Else: " + this.getName(dso))
      return dso.allMetadata('dc.title');
    }

    if(officialTitles.length == 0) {
      return [dso.firstMetadata('dc.title')]
    }
    
    return officialTitles;
  }

  /* Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getTranslatedName(dso: DSpaceObject, currentLang: string): MetadataValue {
    if (currentLang == 'fr' && dso.firstMetadataValue('dc.title.fosrctranslation') != undefined && dso.firstMetadataValue('dc.title.fosrctranslation') != null ) {
      return dso.firstMetadata('dc.title.fosrctranslation');
    } else {
      return undefined;
    }
  }

  /* Get the name for the given {@link DSpaceObject}
   *
   * @param dso  The {@link DSpaceObject} you want a name for
   */
  getAlternativeTitleExists(dso: DSpaceObject, currentLang: string): boolean {
    return (this.getMetadataByFieldAndLanguage(dso, 'dc.title.alternative', currentLang) != undefined || 
            this.getMetadataByFieldAndLanguage(dso, 'dc.title.fosrctranslation', currentLang) != undefined)
  }

  getMetadataByFieldAndLanguage(dso: DSpaceObject, field: string, currentLang: string): MetadataValue[] {
    let result: MetadataValue[] = [];
    //dso.allMetadata(field).forEach(function(singleItem) {
    dso.allMetadata(['dc.title.fosrctranslation', 'dc.title.alternative', 'dc.title.alternative-fosrctranslation']).forEach(function (singleItem) {
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

import { Pipe, PipeTransform } from '@angular/core';
import { String } from 'lodash';
import { LocaleService } from '../../core/locale/locale.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { MetadataMapInterface, MetadataValue, MetadataValueFilter } from '../../core/shared/metadata.models';
import { Metadata } from '../../core/shared/metadata.utils';
import { hasValue, isEmpty } from '../empty.util';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';

/**
 * Pipe specific to OSPR implementation to retrieve translated
 * metadata values should they exist in the translations schema. 
 * returns 
 */
@Pipe({
  name: 'metaTranslate'
})
export class MetadataTranslatePipe implements PipeTransform {

  constructor(private dsoNameService: DSONameService, private localeService: LocaleService) { }

  transform(keyOrKeys: string | string[], dso: DSpaceObject, filter?: MetadataValueFilter): MetadataValue[] {
    let targetLang = this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en';
    return this.translateMetadata(dso, dso.metadata, keyOrKeys, targetLang, filter);
  }

  /**
 * Gets all matching metadata in the map(s) and replaces the values with translated content.
 * @param {DSpaceObject} dso The dspace object
 * @param {MetadataMapInterface|MetadataMapInterface[]} mapOrMaps The source map(s). When multiple maps are given, they will be
 * checked in order, and only values from the first with at least one match will be returned.
 * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
 * @param {string} language The language we want the metadata values
 * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
 * @returns {MetadataValue[]} the matching values or an empty array.
 */
  private translateMetadata(dso: DSpaceObject, mapOrMaps: MetadataMapInterface | MetadataMapInterface[], keyOrKeys: string | string[],
    language: string,
    filter?: MetadataValueFilter): MetadataValue[] {
    const mdMaps: MetadataMapInterface[] = mapOrMaps instanceof Array ? mapOrMaps : [mapOrMaps];
    const matches: MetadataValue[] = [];
    const translationsSchemaName = 'translations';
    const seperatorChar = '!';
    let key: string = "";
    let keys: string[] = keyOrKeys instanceof Array ? keyOrKeys : [keyOrKeys];
    if (keys.length > 1) {
      //console.log('translateMetadata: keyOrKeys: ', keys);
    } else {
      //console.log("new: keys[0]: ", keys[0]);
      key = keys[0];
      //console.log("after assignemt to key: key: ", key);
    }
    if(key == 'dc.description.abstract' || key == 'dc.description.abstract-fosrctranslation')
    {
      let x = 0;
    }
    /**
    * FOSRC this whole else method was re-written as we no longer require to match specific 
    * metadata values with corresponding translations - instead we should only show English
    * when viewing in English and only show French when viewing in French 
    *
    * When values in one language are missing, we should consider (for the specific field)
    * displaying a message in the viewing language to inform the end-user that they can
    * request the tranlated text for the field and provide a link (or similar) 
    * which would allow them to request the translation
    *
    * Exception: official titles will be displayed in viewing language only if a
    * coresponding official title exists, otherwise the title will be displayed in
    * the language provided and wraped an span using the appropriate lang attribute
    *
    * Also added dso as the first paramenter
    * June 6th 2023
    *
    **/
    this.dsoNameService.getMetadataByFieldAndLanguage(dso, keys, language).forEach((mv: MetadataValue) => {
      if (Metadata.valueMatches(mv, filter)) {
        matches.push(mv);
      }
    });
    return matches;
  }
}

function flipLanguage(language: string) {
  if(language === undefined || language === null) {
    return 'en';
  }

  if(language.startsWith('fr')) {
    return 'en';
  } else {
    return 'fr';
  }
}
function getKeyForTranslation(metaDataKey: string) {
  var countDots = (metaDataKey.split(".").length - 1);
  var result = metaDataKey;
  switch(countDots) {
    case 1:
      result += ".fosrctranslation"
      //console.log("case 1: source: " + metaDataKey + ", target: " + result)
      break;
    case 2:
      result += "-fosrctranslation"
      //console.log("case 2: source: " + metaDataKey + ", target: " + result)
      break;
    default:
      //console.log("default: source: " + metaDataKey + ", target: " + result)
  }
  return result;
}


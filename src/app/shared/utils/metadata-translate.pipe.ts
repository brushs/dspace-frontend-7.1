import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from '../../core/locale/locale.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { MetadataMapInterface, MetadataValue, MetadataValueFilter } from '../../core/shared/metadata.models';
import { Metadata } from '../../core/shared/metadata.utils';
import { hasValue, isEmpty } from '../empty.util';

/**
 * Pipe specific to OSPR implementation to retrieve translated
 * metadata values should they exist in the translations schema. 
 * returns 
 */
@Pipe({
  name: 'metaTranslate'
})
export class MetadataTranslatePipe implements PipeTransform {

  constructor(private localeService: LocaleService){}

  transform(keyOrKeys: string | string[], dso: DSpaceObject, filter?: MetadataValueFilter) : MetadataValue[] {
    let targetLang = this.localeService.getCurrentLanguageCode() === 'fr' ? 'fr' : 'en';
    return this.translateMetadata(dso.metadata, keyOrKeys, targetLang, filter);   
  }

  /**
 * Gets all matching metadata in the map(s) and replaces the values with translated content.
 *
 * @param {MetadataMapInterface|MetadataMapInterface[]} mapOrMaps The source map(s). When multiple maps are given, they will be
 * checked in order, and only values from the first with at least one match will be returned.
 * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
 * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
 * @returns {MetadataValue[]} the matching values or an empty array.
 */
   private translateMetadata(mapOrMaps: MetadataMapInterface | MetadataMapInterface[], keyOrKeys: string | string[],
    language: string,
    filter?: MetadataValueFilter): MetadataValue[] {
    const mdMaps: MetadataMapInterface[] = mapOrMaps instanceof Array ? mapOrMaps : [mapOrMaps];
    const matches: MetadataValue[] = [];
    const translationsSchemaName = 'translations';
    const seperatorChar = '!';

    for (const mdMap of mdMaps) {
      console.log( mdMap);
      for (const mdKey of Metadata.resolveKeys(mdMap, keyOrKeys)) {
        const candidates = mdMap[mdKey];
        if (candidates) {
          for (const candidate of candidates) {
            if (Metadata.valueMatches(candidate as MetadataValue, filter)) {
              const translatedKey = getKeyForTranslation(mdKey); //translationsSchemaName + "." + mdKey.replace(/\./g, seperatorChar);
              if (!mdMap[translatedKey]) {
                matches.push(candidate as MetadataValue);
              }
              else{
                // Check if specific metadata value has a translation (based on place in value array of metadata key)
                const found = mdMap[translatedKey].find((v: MetadataValue) =>
                  v.place === (candidate as MetadataValue).place && language === v.language);
                if (hasValue(found)) {
                  matches.push(Object.assign(new MetadataValue(), { value: found.value }));
                }else{
                  matches.push(candidate as MetadataValue);
                }
              }
            }
          }
        }
      }
      if (!isEmpty(matches)) {
        return matches;
      }
    }
    return matches;
  }
}
function getKeyForTranslation(metaDataKey: string) {
  var countDots = (metaDataKey.split(".").length - 1);
  var result = metaDataKey;
  switch(countDots) {
    case 1:
      result += ".fosrctranslation"
      console.log("found one dot")
      break;
    case 2:
      result += "translation"
      console.log("found two dots")
      break;
    default:
      console.log("found no dots or more than 2 dots")
  }
  return result;
}


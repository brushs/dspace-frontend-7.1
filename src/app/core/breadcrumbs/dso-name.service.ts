import { Injectable } from '@angular/core';
import { hasValue } from '../../shared/empty.util';
import { DSpaceObject } from '../shared/dspace-object.model';
import { TranslateService } from '@ngx-translate/core';

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
      console.log("This is coming from the factory service method!");
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
    console.log("This is coming from the get function in the bottom! match: " + match);
    if (hasValue(match)) {
      return this.factories[match](dso);
    } else {
      return  this.factories.Default(dso);
    }
  }
  /**
   *  FOSRC Get Offical Language of the Item or Community or Collection
   * @param dso DSpace Object
   * @returns fr for French, otherwise en for all other languages
   */
  getLang(dso: DSpaceObject): string {
    const result = dso.metadata['dc.language'][0]?.value
    if(result.startsWith('fr')) {
      return 'fr';
    } else {
      return 'en';
    }
  }

}

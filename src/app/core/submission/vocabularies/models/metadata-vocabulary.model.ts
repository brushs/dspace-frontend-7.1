import { autoserialize, deserialize } from 'cerialize';

import { HALLink } from '../../../shared/hal-link.model';
import { METADATA_VOCABULARY } from './vocabularies.resource-type';
import { typedObject, link } from '../../../cache/builders/build-decorators';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
import { CacheableObject } from 'src/app/core/cache/object-cache.reducer';

/**
 * Model class for a Vocabulary
 */
@typedObject
export class MetadataVocabulary  implements CacheableObject {
   static type = METADATA_VOCABULARY;
  /**
   * The identifier of this Vocabulary Metadata
   */
  @autoserialize
  id: string;

  /**
   * The name of this Vocabulary
   */
  @autoserialize
  vocabularyName: string;

  /**
   * The metadata that uses this Vocabulary
   */
  @autoserialize
  metadataId: string;

  /**
   * The form source of this Vocabulary
   */
  @autoserialize
  formSource: string;


  /**
   * A string representing the kind of Vocabulary model
   */
  @excludeFromEquals
  @autoserialize
  public type: any;

  /**
   * The {@link HALLink}s for this Vocabulary
   */
  @deserialize
  _links: {
    self: HALLink
  };
}

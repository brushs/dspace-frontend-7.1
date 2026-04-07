import { autoserialize, deserialize } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { TRANSLATION_REQUEST } from './translation-request.resource-type';

@typedObject
export class TranslationRequest extends CacheableObject {
  static type = TRANSLATION_REQUEST;

  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  id: number;

  @autoserialize
  publicationUUID: string;

  @autoserialize
  bitstreamUUID: string;

  @autoserialize
  language: string;

  @autoserialize
  status: number | null;

  @autoserialize
  createdDate: string;

  @autoserialize
  closedDate: string | null;

  @autoserialize
  titleEn?: string | null;

  @autoserialize
  titleFr?: string | null;

  @autoserialize
  bitstreamName?: string | null;

  @autoserialize
  notes?: string | null;

  @deserialize
  _links: {
    self: HALLink;
  };
}

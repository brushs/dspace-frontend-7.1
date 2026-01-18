import { autoserialize, deserialize } from 'cerialize';
import { typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { excludeFromEquals } from '../../utilities/equals.decorators';
import { HALLink } from '../../shared/hal-link.model';
import { ResourceType } from '../../shared/resource-type';
import { PUBLICATION_REQUEST } from './publication-request.resource-type';

@typedObject
export class PublicationRequest extends CacheableObject {
  static type = PUBLICATION_REQUEST;

  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  id: number;

  @autoserialize
  publicationUUID: string;

  @autoserialize
  userEmailAddress: string;

  @autoserialize
  language: string;

  @autoserialize
  status: string | null;

  @autoserialize
  titleEn?: string | null;

  @autoserialize
  titleFr?: string | null;

  @deserialize
  _links: {
    self: HALLink;
  };
}

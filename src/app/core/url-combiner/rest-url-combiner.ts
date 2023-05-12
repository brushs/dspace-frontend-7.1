import { URLCombiner } from './url-combiner';
import { environment } from '../../../environments/environment';

/**
 * Combines a variable number of strings representing parts
 * of a relative REST URL in to a single, absolute REST URL
 *
 * TODO write tests once GlobalConfig becomes injectable
 */
export class RESTURLCombiner extends URLCombiner {
  constructor(...parts: string[]) {
    //FOSRC commnet this out to suport other domains whitelisted domains
    //super(environment.rest.baseUrl, '/api', ...parts);
    if (!document.location.host.includes('localhost')) {
      super('https://' + document.location.host, '/server/api', ...parts);
    } else {
      super(environment.rest.baseUrl, '/api', ...parts);
    }
  }
}

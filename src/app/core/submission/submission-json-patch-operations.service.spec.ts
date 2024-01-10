import { Store } from '@ngrx/store';

import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { SubmissionJsonPatchOperationsService } from './submission-json-patch-operations.service';
import { RequestService } from '../data/request.service';
import { SubmissionPatchRequest } from '../data/request.models';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { TranslationJsonService } from '../services/translation-json.service';

describe('SubmissionJsonPatchOperationsService', () => {
  let scheduler: TestScheduler;
  let service: SubmissionJsonPatchOperationsService;
  const requestService = {} as RequestService;
  const store = {} as Store<CoreState>;
  const rdbService = {} as RemoteDataBuildService;
  const halEndpointService = {} as HALEndpointService;
  const translationJsonService = {} as TranslationJsonService;

  function initTestService() {
    return new SubmissionJsonPatchOperationsService(
      requestService,
      store,
      rdbService,
      halEndpointService,
      translationJsonService
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();
    service = initTestService();
  });

  it('should instantiate SubmissionJsonPatchOperationsService properly', () => {
    expect(service).toBeDefined();
    expect((service as any).patchRequestConstructor).toEqual(SubmissionPatchRequest);
  });

});

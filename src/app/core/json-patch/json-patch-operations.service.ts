import { merge as observableMerge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, find, map, mergeMap, partition, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { hasValue, isEmpty, isNotEmpty, isNotUndefined, isUndefined } from '../../shared/empty.util';
import { PatchRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { CoreState } from '../core.reducers';
import { jsonPatchOperationsByResourceType } from './selectors';
import { JsonPatchOperationsResourceEntry } from './json-patch-operations.reducer';
import {
  CommitPatchOperationsAction, DeletePendingJsonPatchOperationsAction,
  RollbacktPatchOperationsAction,
  StartTransactionPatchOperationsAction
} from './json-patch-operations.actions';
import { JsonPatchOperationModel, JsonPatchOperationType } from './json-patch.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RemoteData } from '../data/remote-data';
import { TranslationJsonService } from '../services/translation-json.service';

const SUBJECT_PATH = "/sections/DescriptiveMetadata/dc.subject";
/**
 * An abstract class that provides methods to make JSON Patch requests.
 */
export abstract class JsonPatchOperationsService<ResponseDefinitionDomain, PatchRequestDefinition extends PatchRequest> {

  protected abstract requestService: RequestService;
  protected abstract store: Store<CoreState>;
  protected abstract linkPath: string;
  protected abstract halService: HALEndpointService;
  protected abstract rdbService: RemoteDataBuildService;
  protected abstract patchRequestConstructor: any;
  protected abstract jsonService: TranslationJsonService;

  private updateBodyForSubject(body: JsonPatchOperationModel[]): JsonPatchOperationModel[] {
    const hasSubjectPath = body.some(entry => entry.path === SUBJECT_PATH);

    if (hasSubjectPath) {
      const lastSubjectEntry = body
        .filter(entry => entry.path === SUBJECT_PATH)
        .reduce((_, current) => current);

      const englishSubjects = lastSubjectEntry.value.filter(subject => subject.language === 'en');
      const frenchSubjects = lastSubjectEntry.value.filter(subject => subject.language === 'fr');

      const hasFrenchEntryForAll = englishSubjects.every(englishSubject =>
        frenchSubjects.some(subject =>
          subject.value === englishSubject.value
        )
      );

      const hasEnglishEntryForAll = frenchSubjects.every(frenchSubject =>
        englishSubjects.some(subject =>
          subject.value === frenchSubject.value
        )
      );

      if (!hasFrenchEntryForAll || !hasEnglishEntryForAll) {
        const duplicatedFrenchSubjects = englishSubjects
          .filter(englishSubject =>
            !frenchSubjects.some(subject =>
              subject.value === englishSubject.value
            )
          )
          .map(englishSubject => {
            let englishsubjectValue = this.jsonService.getValueByKey<string>(englishSubject.value,'en');

            if (englishsubjectValue === undefined) {
              englishsubjectValue = this.jsonService.getValueByKey<string>(englishSubject.value,'fr');
              if (englishsubjectValue === undefined) {
                englishsubjectValue = englishSubject.value;
              }
            }
            const subjectValue = this.jsonService.getValueByKey<string>(englishsubjectValue,'fr');

            return {
              ...englishSubject,
              language: 'fr',
              //value: subjectValue || englishSubject.value,
            };
          });

        const duplicatedEnglishSubjects = frenchSubjects
          .filter(frenchSubject =>
            !englishSubjects.some(subject =>
              subject.value === frenchSubject.value
            )
          )
          .map(frenchSubject => {
            const subjectValue = this.jsonService.getValueByKey<string>(frenchSubject.value, 'en');

            return {
              ...frenchSubject,
              language: 'en',
             // value: subjectValue || frenchSubject.value,
            };
          });

        const combinedSubjects = [...lastSubjectEntry.value, ...duplicatedFrenchSubjects, ...duplicatedEnglishSubjects];

        const uniqueCombinedSubjects = combinedSubjects.filter((subject, index, self) =>
            index === self.findIndex(s => s.value === subject.value && s.language === subject.language)
        );
        const translatedSubjects = uniqueCombinedSubjects.map(subject => {
        const subjectValue = this.jsonService.getValueByKey<string>(subject.value, subject.language);

          return {
            ...subject,
            value: subjectValue || subject.value,
          };
        });
        const duplicateSubjectOperation: JsonPatchOperationModel = {
          op: 'add' as JsonPatchOperationType,
          path: SUBJECT_PATH,
          value: translatedSubjects,
        };

        // Add the new operation to the body
        body.push(duplicateSubjectOperation);
      }
    }

    return body;
  }

  /**
   * Submit a new JSON Patch request with all operations stored in the state that are ready to be dispatched
   *
   * @param hrefObs
   *    Observable of request href
   * @param resourceType
   *    The resource type value
   * @param resourceId
   *    The resource id value
   * @return Observable<ResponseDefinitionDomain>
   *    observable of response
   */
  protected submitJsonPatchOperations(hrefObs: Observable<string>, resourceType: string, resourceId?: string): Observable<ResponseDefinitionDomain> {
    const requestId = this.requestService.generateRequestId();
    let startTransactionTime = null;
    const [patchRequest$, emptyRequest$] = partition((request: PatchRequestDefinition) => isNotEmpty(request.body))(hrefObs.pipe(
      mergeMap((endpointURL: string) => {
        return this.store.select(jsonPatchOperationsByResourceType(resourceType)).pipe(
          take(1),
          filter((operationsList: JsonPatchOperationsResourceEntry) => isUndefined(operationsList) || !(operationsList.commitPending)),
          tap(() => startTransactionTime = new Date().getTime()),
          map((operationsList: JsonPatchOperationsResourceEntry) => {
            let body: JsonPatchOperationModel[] = [];
            if (isNotEmpty(operationsList)) {
              if (isNotEmpty(resourceId)) {
                if (isNotUndefined(operationsList.children[resourceId]) && isNotEmpty(operationsList.children[resourceId].body)) {
                  operationsList.children[resourceId].body.forEach((entry) => {
                    body.push(entry.operation);
                  });
                }
              } else {
                Object.keys(operationsList.children)
                  .filter((key) => operationsList.children.hasOwnProperty(key))
                  .filter((key) => hasValue(operationsList.children[key]))
                  .filter((key) => hasValue(operationsList.children[key].body))
                  .forEach((key) => {
                    operationsList.children[key].body.forEach((entry) => {
                      body.push(entry.operation);
                    });
                  });
              }
            }

            const hasSubjectPath = body.some(entry => entry.path === SUBJECT_PATH);
            if(hasSubjectPath) {
              body = this.updateBodyForSubject(body);
            }

            return this.getRequestInstance(requestId, endpointURL, body);
          }));
      })));

    return observableMerge(
      emptyRequest$.pipe(
        filter((request: PatchRequestDefinition) => isEmpty(request.body)),
        tap(() => startTransactionTime = null),
        map(() => null)),
      patchRequest$.pipe(
        filter((request: PatchRequestDefinition) => isNotEmpty(request.body)),
        tap(() => this.store.dispatch(new StartTransactionPatchOperationsAction(resourceType, resourceId, startTransactionTime))),
        tap((request: PatchRequestDefinition) => this.requestService.send(request)),
        mergeMap(() => {
          return this.rdbService.buildFromRequestUUID(requestId).pipe(
            getFirstCompletedRemoteData(),
            find((rd: RemoteData<any>) => startTransactionTime < rd.timeCompleted),
            map((rd: RemoteData<any>) => {
              if (rd.hasFailed) {
                this.store.dispatch(new RollbacktPatchOperationsAction(resourceType, resourceId));
                throw new Error(rd.errorMessage);
              } else if (hasValue(rd.payload) && isNotEmpty(rd.payload.dataDefinition)) {
                this.store.dispatch(new CommitPatchOperationsAction(resourceType, resourceId));
                return rd.payload.dataDefinition;
              }
            }),
            distinctUntilChanged()
        );
        }))
    );
  }
  /**
   * Dispatch an action to delete all pending JSON patch Operations.
   */
  public deletePendingJsonPatchOperations() {
    this.store.dispatch(new DeletePendingJsonPatchOperationsAction());
  }

  /**
   * Return an instance for RestRequest class
   *
   * @param uuid
   *    The request uuid
   * @param href
   *    The request href
   * @param body
   *    The request body
   * @return Object<PatchRequestDefinition>
   *    instance of PatchRequestDefinition
   */
  protected getRequestInstance(uuid: string, href: string, body?: any): PatchRequestDefinition {
    return new this.patchRequestConstructor(uuid, href, body);
  }

  protected getEndpointByIDHref(endpoint, resourceID): string {
    return isNotEmpty(resourceID) ? `${endpoint}/${resourceID}` : `${endpoint}`;
  }

  /**
   * Make a new JSON Patch request with all operations related to the specified resource type
   *
   * @param linkPath
   *    The link path of the request
   * @param scopeId
   *    The scope id
   * @param resourceType
   *    The resource type value
   * @return Observable<ResponseDefinitionDomain>
   *    observable of response
   */
  public jsonPatchByResourceType(linkPath: string, scopeId: string, resourceType: string): Observable<ResponseDefinitionDomain> {
    const href$ = this.halService.getEndpoint(linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)));

    return this.submitJsonPatchOperations(href$, resourceType);
  }

  /**
   * Select the jsonPatch operation related to the specified resource type.
   * @param resourceType
   */
  public hasPendingOperations(resourceType: string): Observable<boolean> {
    return this.store.select(jsonPatchOperationsByResourceType(resourceType)).pipe(
      map((val) =>  !isEmpty(val) && Object.values(val.children)
        .filter((section) => !isEmpty((section as any).body)).length > 0),
      distinctUntilChanged(),
    );
  }

  /**
   * Make a new JSON Patch request with all operations related to the specified resource id
   *
   * @param linkPath
   *    The link path of the request
   * @param scopeId
   *    The scope id
   * @param resourceType
   *    The resource type value
   * @param resourceId
   *    The resource id value
   * @return Observable<ResponseDefinitionDomain>
   *    observable of response
   */
  public jsonPatchByResourceID(linkPath: string, scopeId: string, resourceType: string, resourceId: string): Observable<ResponseDefinitionDomain> {
    const hrefObs = this.halService.getEndpoint(linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)));

    return this.submitJsonPatchOperations(hrefObs, resourceType, resourceId);
  }
}

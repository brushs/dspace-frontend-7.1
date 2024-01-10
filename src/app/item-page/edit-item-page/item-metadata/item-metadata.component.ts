import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { catchError, first, map, switchMap } from 'rxjs/operators';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload, getFirstSucceededRemoteDataWithNotEmptyPayload } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { MetadataValue, MetadatumViewModel } from '../../../core/shared/metadata.models';
import { AbstractItemUpdateComponent } from '../abstract-item-update/abstract-item-update.component';
import { UpdateDataService } from '../../../core/data/update-data.service';
import { hasNoValue, hasValue } from '../../../shared/empty.util';
import { AlertType } from '../../../shared/alert/aletr-type';
import { Operation } from 'fast-json-patch';
import { MetadataPatchOperationService } from '../../../core/data/object-updates/patch-operation-service/metadata-patch-operation.service';
import { Observable, of as observableOf } from 'rxjs';
import { VocabularyEntry } from '../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyService } from '../../../core/submission/vocabularies/vocabulary.service';
import { PaginatedList, buildPaginatedList } from '../../../core/data/paginated-list.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { MetadataVocabulary } from 'src/app/core/submission/vocabularies/models/metadata-vocabulary.model';
import { FieldUpdate } from 'src/app/core/data/object-updates/object-updates.reducer';

@Component({
  selector: 'ds-item-metadata',
  styleUrls: ['./item-metadata.component.scss'],
  templateUrl: './item-metadata.component.html',
})
/**
 * Component for displaying an item's metadata edit page
 */
export class ItemMetadataComponent extends AbstractItemUpdateComponent {

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * A custom update service to use for adding and committing patches
   * This will default to the ItemDataService
   */
  @Input() updateService: UpdateDataService<Item>;

  readonly languagesVocabularyKey: string = 'gc_languages'

  languageEntries$: Observable<VocabularyEntry[]> = undefined;
  vocabularyMetadata$: Observable<MetadataVocabulary[]> = undefined;


  constructor(
    public itemService: ItemDataService,
    public objectUpdatesService: ObjectUpdatesService,
    public router: Router,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public vocabularyService: VocabularyService,
  ) {
    super(itemService, objectUpdatesService, router, notificationsService, translateService, route);
  }

  /**
   * Set up and initialize all fields
   */
  ngOnInit(): void {
    super.ngOnInit();
    if (hasNoValue(this.updateService)) {
      this.updateService = this.itemService;
    }
    this.initializeLanguageEntries();
    this.initalizeVocabularyMetadataEntries();
  }

  /**
   * Initialize the values and updates of the current item's metadata fields
   */
  public initializeUpdates(): void {
    this.updates$ = this.objectUpdatesService.getFieldUpdates(this.url, this.item.metadataAsList);
    }

  /**
   * Initialize the prefix for notification messages
   */
  public initializeNotificationsPrefix(): void {
    this.notificationsPrefix = 'item.edit.metadata.notifications.';
  }

  /**
   * Sends a new add update for a field to the object updates service
   * @param metadata The metadata to add, if no parameter is supplied, create a new Metadatum
   */
  add(metadata: MetadatumViewModel = new MetadatumViewModel()) {
    this.objectUpdatesService.saveAddFieldUpdate(this.url, metadata);
  }

  /**
   * Sends all initial values of this item to the object updates service
   */
  public initializeOriginalFields() {
    this.objectUpdatesService.initialize(this.url, this.item.metadataAsList, this.item.lastModified, MetadataPatchOperationService);
  }

  /**
   * Requests all current metadata for this item and requests the item service to update the item
   * Makes sure the new version of the item is rendered on the page
   */
  public submit() {
    this.isValid().pipe(first()).subscribe((isValid) => {
      if (isValid) {
        this.objectUpdatesService.createPatch(this.url).pipe(
          first(),
          switchMap((patch: Operation[]) => {
            return this.updateService.patch(this.item, patch).pipe(
              getFirstCompletedRemoteData()
            );
          })
        ).subscribe(
          (rd: RemoteData<Item>) => {
            if (rd.hasFailed) {
              this.notificationsService.error(this.getNotificationTitle('error'), rd.errorMessage);
            } else {
              this.item = rd.payload;
              this.checkAndFixMetadataUUIDs();
              this.initializeOriginalFields();
              this.updates$ = this.objectUpdatesService.getFieldUpdates(this.url, this.item.metadataAsList);
              this.notificationsService.success(this.getNotificationTitle('saved'), this.getNotificationContent('saved'));
            }
          }
        );
      } else {
        this.notificationsService.error(this.getNotificationTitle('invalid'), this.getNotificationContent('invalid'));
      }
    });
  }

  /**
   * Check for empty metadata UUIDs and fix them (empty UUIDs would break the object-update service)
   */
  checkAndFixMetadataUUIDs() {
    const metadata = cloneDeep(this.item.metadata);
    Object.keys(this.item.metadata).forEach((key: string) => {
      metadata[key] = this.item.metadata[key].map((value) => hasValue(value.uuid) ? value : Object.assign(new MetadataValue(), value));
    });
    this.item.metadata = metadata;
  }

  initializeLanguageEntries() {
    this.languageEntries$ = this.vocabularyService
    .getVocabularyEntries(new VocabularyOptions(this.languagesVocabularyKey, true), new PageInfo())
    .pipe(
      getFirstSucceededRemoteDataPayload(),
     catchError(() => observableOf(buildPaginatedList(
        new PageInfo(),
        []
        ))
      ),
      map((list: PaginatedList<VocabularyEntry>) => list.page));
  }

  initalizeVocabularyMetadataEntries() {
    this.vocabularyMetadata$ = this.vocabularyService
    .findAllMetadataVocabularies(new PageInfo())
    .pipe(
      getFirstSucceededRemoteDataPayload(),
     catchError(() => observableOf(buildPaginatedList(
        new PageInfo(),
        []
        ))
      ),
      map((list: PaginatedList<MetadataVocabulary>) => list.page));
  }

getVocabulary(fieldUpdate: FieldUpdate): Observable<MetadataVocabulary | null> {
  var metadataId = fieldUpdate.field as MetadatumViewModel
  return this.vocabularyMetadata$.pipe(
    map((vocabularies: MetadataVocabulary[]) =>
      vocabularies.find(v => v.metadataId === metadataId.key ) || null
    )
  );
}


}

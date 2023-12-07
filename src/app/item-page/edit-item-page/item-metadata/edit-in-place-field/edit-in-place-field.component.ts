import { 
  Component, 
  Input, 
  OnChanges, 
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  metadataFieldsToString,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload
} from '../../../../core/shared/operators';
import { hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { RegistryService } from '../../../../core/registry/registry.service';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FieldChangeType } from '../../../../core/data/object-updates/object-updates.actions';
import { FieldUpdate } from '../../../../core/data/object-updates/object-updates.reducer';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { NgModel } from '@angular/forms';
import { MetadatumViewModel } from '../../../../core/shared/metadata.models';
import { InputSuggestion } from '../../../../shared/input-suggestions/input-suggestions.model';
import { followLink } from '../../../../shared/utils/follow-link-config.model';
import { VocabularyService } from '../../../../core/submission/vocabularies/vocabulary.service';
import { VocabularyOptions } from '../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { VocabularyEntry } from '../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { PaginatedList, buildPaginatedList } from '../../../../core/data/paginated-list.model';
import { TranslationJsonService } from '../../../../core/services/translation-json.service';
import { supportedLanguages, LocaleService } from '../../../../core/locale/locale.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[ds-edit-in-place-field]',
  styleUrls: ['./edit-in-place-field.component.scss'],
  templateUrl: './edit-in-place-field.component.html',
})
/**
 * Component that displays a single metadatum of an item on the edit page
 */
export class EditInPlaceFieldComponent implements OnInit, OnChanges {
  /**
   * The current field, value and state of the metadatum
   */
  @Input() fieldUpdate: FieldUpdate;

  /**
   * The current url of this page
   */
  @Input() url: string;

  /**
   * The metadatum of this field
   */
  @Input() metadata: MetadatumViewModel;

  @Input() languageEntries: Observable<VocabularyEntry[]>;

  @Input() languagesVocabularyKey: string;

  /**
   * Emits whether or not this field is currently editable
   */
  editable: Observable<boolean>;

  /**
   * Emits whether or not this field is currently valid
   */
  valid: Observable<boolean>;

  /**
   * The current suggestions for the metadatafield when editing
   */
  metadataFieldSuggestions: BehaviorSubject<InputSuggestion[]> = new BehaviorSubject([]);

  lastMetadataValue: string;

  lastMetadataLanguage: string;

  // TODO: this should be part of a new API endpoint
  private readonly metadataVocabulary: Record<string, string> = {
    'dc.type': 'publication_type',
    'dc.language.iso': 'gc_languages',
    'dc.rights': 'creative_commons',
    'dc.subject': 'subject_list',
    'dc.rights.openaccesslevel': 'access_rights',
    'local.requestdoi': 'request_doi_value',
    'local.peerreview': 'peer_review',
    'local.reporttype': 'reports_types',
    'local.conferencetype': 'conference_types',
    'local.articletype': 'article_subtype',
};
  

  vocabularyEntries: Observable<VocabularyEntry[]> = undefined;
  hasControlledVocabulary: boolean = false;

  constructor(
    private registryService: RegistryService,
    private objectUpdatesService: ObjectUpdatesService,
    private vocabularyService: VocabularyService,
    protected jsonService: TranslationJsonService,
    protected localeService: LocaleService,
    protected cdr: ChangeDetectorRef,
  ) {
  }

  /**
   * Sets up an observable that keeps track of the current editable and valid state of this field
   */
  ngOnInit(): void {

    //loading french and english translation files for subject dropdown
    this.jsonService.loadJson5File('en');
    this.jsonService.loadJson5File('fr');

    this.editable = this.objectUpdatesService.isEditable(this.url, this.metadata.uuid);
    this.valid = this.objectUpdatesService.isValid(this.url, this.metadata.uuid);
    this.initializeVocabularyEntries();
  }

  /**
   * Sends a new change update for this field to the object updates service
   */
  update(ngModel?: NgModel) {
    this.objectUpdatesService.saveChangeFieldUpdate(this.url, cloneDeep(this.metadata));
    if (hasValue(ngModel)) {
      this.checkValidity(ngModel);
    }

    //only execute if the ds-validation-suggestions component triggered 
    // this method call
    if(ngModel){
      if(this.metadataVocabulary[this.metadata.key]){
        this.initializeVocabularyEntries();
      }else{
        this.hasControlledVocabulary = false;
      }
    }
  }

  /**
   * Method to check the validity of a form control
   * @param ngModel
   */
  public checkValidity(ngModel: NgModel) {
    ngModel.control.setValue(ngModel.viewModel);
    ngModel.control.updateValueAndValidity();
    this.objectUpdatesService.setValidFieldUpdate(this.url, this.metadata.uuid, ngModel.control.valid);
  }

  /**
   * Sends a new editable state for this field to the service to change it
   * @param editable The new editable state for this field
   */
  setEditable(editable: boolean) {
    this.objectUpdatesService.setEditableFieldUpdate(this.url, this.metadata.uuid, editable);
  }

  /**
   * Sends a new remove update for this field to the object updates service
   */
  remove() {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.url, cloneDeep(this.metadata));
  }

  /**
   * Notifies the object updates service that the updates for the current field can be removed
   */
  removeChangesFromField() {
    this.objectUpdatesService.removeSingleFieldUpdate(this.url, this.metadata.uuid);
  }

  /**
   * Sets the current metadatafield based on the fieldUpdate input field
   */
  ngOnChanges(): void {
    this.metadata = cloneDeep(this.fieldUpdate.field) as MetadatumViewModel;
  }

  /**
   * Requests all metadata fields that contain the query string in their key
   * Then sets all found metadata fields as metadataFieldSuggestions
   * Ignores fields from metadata schemas "relation" and "relationship"
   * @param query The query to look for
   */
  findMetadataFieldSuggestions(query: string) {
    if (isNotEmpty(query)) {
      return this.registryService.queryMetadataFields(query, null, true, false, followLink('schema')).pipe(
        getFirstSucceededRemoteData(),
        metadataFieldsToString(),
      ).subscribe((fieldNames: string[]) => {
          this.setInputSuggestions(fieldNames);
        });
    } else {
      this.metadataFieldSuggestions.next([]);
    }
  }

  /**
   * Set the list of input suggestion with the given Metadata fields, which all require a resolved MetadataSchema
   * @param fields  list of Metadata fields, which all require a resolved MetadataSchema
   */
  setInputSuggestions(fields: string[]) {
    this.metadataFieldSuggestions.next(
      fields.map((fieldName: string) => {
        return {
          displayValue: fieldName.split('.').join('.&#8203;'),
          value: fieldName
        };
      })
    );
  }

  /**
   * Check if a user should be allowed to edit this field
   * @return an observable that emits true when the user should be able to edit this field and false when they should not
   */
  canSetEditable(): Observable<boolean> {
    return this.editable.pipe(
      map((editable: boolean) => {
        if (editable) {
          return false;
        } else {
          return this.fieldUpdate.changeType !== FieldChangeType.REMOVE;
        }
      })
    );
  }

  /**
   * Check if a user should be allowed to disabled editing this field
   * @return an observable that emits true when the user should be able to disable editing this field and false when they should not
   */
  canSetUneditable(): Observable<boolean> {
    return this.editable;
  }

  /**
   * Check if a user should be allowed to remove this field
   * @return an observable that emits true when the user should be able to remove this field and false when they should not
   */
  canRemove(): Observable<boolean> {
    return observableOf(this.fieldUpdate.changeType !== FieldChangeType.REMOVE && this.fieldUpdate.changeType !== FieldChangeType.ADD);
  }

  /**
   * Check if a user should be allowed to undo changes to this field
   * @return an observable that emits true when the user should be able to undo changes to this field and false when they should not
   */
  canUndo(): Observable<boolean> {
    return this.editable.pipe(
      map((editable: boolean) => this.fieldUpdate.changeType >= 0 || editable)
    );
  }

  protected isNotEmpty(value): boolean {
    return isNotEmpty(value);
  }

  initializeVocabularyEntries() {
    
    if (!this.metadataVocabulary[this.metadata.key]) 
      return;
    this.hasControlledVocabulary = true;
    if (this.metadataVocabulary[this.metadata.key] == this.languagesVocabularyKey) {
      // already loaded in the parent component
      this.vocabularyEntries = this.languageEntries.pipe(
        tap(()=>{
          this.setDropdownOptionToEquivalentLastOption();
        })
      );
      return;
    }
    var vocabOptions = new VocabularyOptions(this.metadataVocabulary[this.metadata.key], true);
    var pageInfo = new PageInfo();
    pageInfo.elementsPerPage = 500;
    // call getVocabularyEntries and populate this.vocabularyEntries (will require a pipe)
    this.vocabularyEntries = this.vocabularyService.getVocabularyEntries(vocabOptions, pageInfo).pipe(
      getFirstSucceededRemoteDataPayload(),
      catchError(() => observableOf(buildPaginatedList(
        new PageInfo(),
        []
        ))
      ),
      map((list: PaginatedList<VocabularyEntry>) => {
        return list.page
      }),
      tap(()=>{
        this.setDropdownOptionToEquivalentLastOption();
      })
      )
    
    //this.vocabularyService.getVocabularyEntries(vocabOptions, pageInfo).pipe
    //this.vocabularyEntries = this.vocabularyService.getVocabularyEntries(this.metadataVocabulary[this.metadata.key]);
  }

  /**
   * Method to check if the language is supported
   * @returns void
   */
  checkIfSupportedLanguage(languageToCheck: string){
    //check if the language in the metadata is supported by the application
    return supportedLanguages.some((supportedLang) => {
      return supportedLang.toString() === languageToCheck.toLowerCase()
    });
  }

  /**
   * Method to get the translated value of the translation key based
   * on the current set language in the metadata
   * @param translationKey The translation key
   * @returns The translated value
   */
  getTranslationValueByKey(translationKey): string{
    
    let languageToFetch;

    //if the metadata language exists and if it is one of the languages supported
    // by the application
    if(this.metadata.language && this.checkIfSupportedLanguage(this.metadata.language)){

      //set the language to fetch to be the metadata language
      languageToFetch = this.metadata.language;

    }else{

      //set the language to fetch to be the currently set language of the application
      languageToFetch = this.localeService.getCurrentLanguageCode();

    }

    //fetch the appropriate language value by the translation key
    return this.jsonService.getValueByKey(translationKey, languageToFetch);
  }

  /**
   * Method to change the dropdown language
   * @returns void
   */
  changeDropdownLanguage(){

    this.hasControlledVocabulary = false;

    this.metadata.value = undefined;

    //recreate dropdown to match metadata language
    this.initializeVocabularyEntries();
  }

  /**
   * Method to set the dropdown selected option to the option that is equivalent
   * to the last selected dropdown option
   * @returns void
   */
  setDropdownOptionToEquivalentLastOption(){

    setTimeout(() => {

      let languageToFetch;

      //if the last metadata language exists and if it is one of the languages supported
      // by the application
      if(this.lastMetadataLanguage && this.checkIfSupportedLanguage(this.lastMetadataLanguage)){

        //set the language to fetch to be the last metadata language
        languageToFetch = this.lastMetadataLanguage;

      }else{

        //set the language to fetch to be the currently set language of the application
        languageToFetch = this.localeService.getCurrentLanguageCode();

      }

      //fetch the translation key by the value
      let lastMetadataValueKey = this.jsonService.getKeyByValue(this.lastMetadataValue, languageToFetch);

      //fetch the equivalent translation value (linked to the last metadata value key) 
      // for the new metadata language
      let translatedMetadataValueForNewLanguage = this.getTranslationValueByKey(lastMetadataValueKey);

      this.metadata.value = translatedMetadataValueForNewLanguage;

      this.cdr.detectChanges();
        
    })
  }

  /**
   * Method to set the last metadata value
   * @returns void
   */
  setLastMetadataValue(){
    this.lastMetadataValue = this.metadata.value;
  }

  /**
   * Method to set the last metadata language
   * @returns void
   */
  setLastMetadataLanguage(){
    this.lastMetadataLanguage = this.metadata.language;
  }
  
}

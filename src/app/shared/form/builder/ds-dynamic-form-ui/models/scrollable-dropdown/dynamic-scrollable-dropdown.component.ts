import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, of as observableOf } from 'rxjs';
import { catchError, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';

import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { DynamicScrollableDropdownModel } from './dynamic-scrollable-dropdown.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { isEmpty } from '../../../../../empty.util';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import {
  PaginatedList,
  buildPaginatedList
} from '../../../../../../core/data/paginated-list.model';
import { DsDynamicVocabularyComponent } from '../dynamic-vocabulary.component';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';

/**
 * Component representing a dropdown input field
 */
@Component({
  selector: 'ds-dynamic-scrollable-dropdown',
  styleUrls: ['./dynamic-scrollable-dropdown.component.scss'],
  templateUrl: './dynamic-scrollable-dropdown.component.html'
})
export class DsDynamicScrollableDropdownComponent extends DsDynamicVocabularyComponent implements OnInit {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DynamicScrollableDropdownModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  public currentValue: Observable<string>;
  public currentIndex: number = 0;
  public loading = false;
  public pageInfo: PageInfo;
  public optionsList: any;

  constructor(protected vocabularyService: VocabularyService,
              protected cdr: ChangeDetectorRef,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(vocabularyService, layoutService, validationService);
  }

  /**
   * Initialize the component, setting up the init form value
   */
  ngOnInit() {
    this.updatePageInfo(this.model.maxOptions, 1);
    this.vocabularyService.getVocabularyEntries(this.model.vocabularyOptions, this.pageInfo).pipe(
      getFirstSucceededRemoteDataPayload(),
      catchError(() => observableOf(buildPaginatedList(
        new PageInfo(),
        []
        ))
      ))
      .subscribe((list: PaginatedList<VocabularyEntry>) => {
        this.optionsList = list.page;
        if (this.model.value) {
          this.setCurrentValue(this.model.value, true);
        }

        this.updatePageInfo(
          list.pageInfo.elementsPerPage,
          list.pageInfo.currentPage,
          list.pageInfo.totalElements,
          list.pageInfo.totalPages
        );
        this.cdr.detectChanges();
      });

    this.group.get(this.model.id).valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.setCurrentValue(value);
      });
  }

  /**
   * Converts an item from the result list to a `string` to display in the `<input>` field.
   */
  inputFormatter = (x: VocabularyEntry): string => x.display || x.value;

  /**
   * Opens dropdown menu
   * @param sdRef The reference of the NgbDropdown.
   */
  openDropdown(sdRef: NgbDropdown) {
    if (!this.model.readOnly) {
      this.group.markAsUntouched();
      sdRef.open();
    }
  }

  /**
   * Loads any new entries
   */
  onScroll() {
    if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
      this.loading = true;
      this.updatePageInfo(
        this.pageInfo.elementsPerPage,
        this.pageInfo.currentPage + 1,
        this.pageInfo.totalElements,
        this.pageInfo.totalPages
      );
      this.vocabularyService.getVocabularyEntries(this.model.vocabularyOptions, this.pageInfo).pipe(
        getFirstSucceededRemoteDataPayload(),
        catchError(() => observableOf(buildPaginatedList(
          new PageInfo(),
          []
          ))
        ),
        tap(() => this.loading = false))
        .subscribe((list: PaginatedList<VocabularyEntry>) => {
          this.optionsList = this.optionsList.concat(list.page);
          this.updatePageInfo(
            list.pageInfo.elementsPerPage,
            list.pageInfo.currentPage,
            list.pageInfo.totalElements,
            list.pageInfo.totalPages
          );
          this.cdr.detectChanges();
        });
    }
  }

  /**
   * Emits a change event and set the current value with the given value.
   * @param event The value to emit.
   */
  onSelect(event) {
    this.group.markAsDirty();
    this.dispatchUpdate(event);
    this.setCurrentIndex(event);
    this.setCurrentValue(event);
  }

  /**
   * Sets the current value with the given value.
   * @param value The value to set.
   * @param init Representing if is init value or not.
   */
  setCurrentValue(value: any, init = false): void {
    let result: Observable<string>;

    if (init) {
      // FOSRC console loging to be removed
      //console.log("Dyanmic-scrollable-dropdown.component: setCurrentValue: init is true, value: ", value);
      result = this.getInitValueFromModel().pipe(
        map((formValue: FormFieldMetadataValueObject) => formValue.display)
      );
    } else {
      if (isEmpty(value)) {
        result = observableOf('');
      } else if (typeof value === 'string') {
        result = observableOf(value);
      } else {
        result = observableOf(value.display);
      }
    }
    this.currentValue = result;
  }
  /**
   * FOSRC Converts an item from the currentValue to a `string` to display the selected value in the `<input>`  field.
   */
  selectedValueFormatter() {
    let ret: string = ''
    if (this.optionsList && (this.currentIndex || this.currentIndex == 0)) {
      //console.log("Not-X selectedValue: ", this.optionsList[this.currentIndex].display);
      ret = this.optionsList[this.currentIndex].display
    } 
    //console.log("selectedValue - ret: ", ret);
    return ret;
  }

  /**  FOSRC
 * Sets the currentIndex value.
 * @param value The value to set.
 */
  setCurrentIndex(value: VocabularyEntry): void {
    if (value && value.type) {
      if (value.type == "vocabularyEntry") {
        //FOSRC use this to get the index of the selected list element
        const testString: string = "fosrc.item.edit.dynamic-field.values."
        if (value.display && value.display.startsWith(testString)) {
          //strip out the tesString part i.e. the string should always conform to "fosrc.item.edit.dynamic-field.values.1.publication_type"
          let myString: string = value.display.substring(testString.length);
          //No the start of MyString up to the first "." will be the index to extract
          let myNum: number = +(myString.substring(0, myString.indexOf('.'))) - 1;
          this.currentIndex = myNum;
        }
      }
    }
  }

}

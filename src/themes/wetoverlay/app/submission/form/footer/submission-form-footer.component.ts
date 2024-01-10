// the OSPR changes shown here have been implemented at both the theme and the app level
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionRestService } from '../../../../../../app/core/submission/submission-rest.service';
import { SubmissionService } from '../../../../../../app/submission/submission.service';
import { SubmissionScopeType } from '../../../../../../app/core/submission/submission-scope-type';
import { isNotEmpty } from '../../../../../../app/shared/empty.util';

/**
 * This component represents a submission from the footer bar.
 */
@Component({
  selector: 'ds-submission-form-footer',
  styleUrls: ['./submission-form-footer.component.scss'],
  templateUrl: './submission-form-footer.component.html'
})
export class SubmissionFormFooterComponent implements OnChanges {

  /**
   * Define the submission id
   * @type {string}
   */
  @Input() submissionId: string;

  /**
   * Define a boolean that represents whether a submission deposit operation is pending
   * @type {Observable<boolean>}
   */
  public processingDepositStatus: Observable<boolean>;

  /**
   * Define a boolean that represents whether a submission save operation is pending
   * @type {Observable<boolean>}
   */
  public processingSaveStatus: Observable<boolean>;

  /**
   * Define a boolean that determines  whether we should be showing the deposit and discard buttons
   * @type {Observable<boolean>}
   */
  public showDepositAndDiscard: Observable<boolean>;

  /**
   * Define a boolean theat that represents whether the submission form is valid or not
   * @type {Observable<boolean>}
   */
  public submissionIsInvalid: Observable<boolean> = observableOf(true);

  /**
   * Define a boolean that represents whether the submission form has unsaved modifications
   */
  public hasUnsavedModification: Observable<boolean>;

  /**
   * Define the instance variables
   *
   * @param {NgbModal} modalService
   * @param {SubmissionRestService} restService
   * @param {SubmissionService} submissionService
   */
  constructor(private modalService: NgbModal,
              private restService: SubmissionRestService,
              private submissionService: SubmissionService) {
  }

  /**
   * Initialize all instance variables, which is conditional on the submission not being empty
   */
  ngOnChanges(changes: SimpleChanges) {
    if (isNotEmpty(this.submissionId)) {
      this.submissionIsInvalid = this.submissionService.getSubmissionStatus(this.submissionId).pipe(
        map((isValid: boolean) => isValid === false)
      );

      this.processingSaveStatus = this.submissionService.getSubmissionSaveProcessingStatus(this.submissionId);
      this.processingDepositStatus = this.submissionService.getSubmissionDepositProcessingStatus(this.submissionId);
      this.showDepositAndDiscard = observableOf(this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkspaceItem);
      this.hasUnsavedModification = this.submissionService.hasUnsavedModification();
    }
  }

  /**
   * Dispatch an (unconditional) submission save action
   */
  save(event) {
    this.submissionService.dispatchSave(this.submissionId, true);
  }

  /**
   * Dispatch an (unconditional) submission save for later action
   */
  saveLater(event) {
    this.submissionService.dispatchSaveForLater(this.submissionId);
  }

  // OSPR change begins here
  /**
   * Dispatch a submission deposit action, which is conditional on the submission not being empty
   */
  public deposit(event) {
    if (!isNotEmpty(this.submissionId)) {
      this.submissionIsInvalid = this.submissionService.getSubmissionStatus(this.submissionId).pipe(
        map((isValid: boolean) => isValid === false)
      );
    }
    else {
        this.submissionService.dispatchDeposit(this.submissionId);
    }
  }
  // OSPR change ends here

  /**
   * Dispatch an (unconditional) submission discard action
   */
  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.submissionService.dispatchDiscard(this.submissionId);
        }
      }
    );
  }
}

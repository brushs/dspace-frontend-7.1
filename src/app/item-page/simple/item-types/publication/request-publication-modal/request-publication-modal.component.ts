import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestPublicationService } from './request-publication.service';
import { LocaleService } from '../../../../../core/locale/locale.service';

@Component({
  selector: 'ds-request-publication-modal',
  templateUrl: './request-publication-modal.component.html',
  styleUrls: ['./request-publication-modal.component.scss']
})
export class RequestPublicationModalComponent implements OnInit {
  @Input() itemUuid: string;
  @Input() itemTitle: string;

  submitting = false;
  submitError = false;
  submitSuccess = false;

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    language: ['', [Validators.required]]
  });

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private requestPublicationService: RequestPublicationService,
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.form.patchValue({
      language: this.localeService.getCurrentLanguageCode()
    });
  }

  submit(): void {
    if (this.form.invalid || !this.itemUuid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.submitError = false;

    this.requestPublicationService.requestPublication({
      publicationUUID: this.itemUuid,
      userEmailAddress: this.form.value.email,
      language: this.form.value.language
    }).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.submitting = false;
      },
      error: () => {
        this.submitError = true;
        this.submitting = false;
      }
    });
  }
}

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Registration } from '../core/shared/registration.model';
import { RemoteData } from '../core/data/remote-data';
import * as e from 'express';

@Component({
  selector: 'ds-register-email-form',
  templateUrl: './register-email-form.component.html'
})
/**
 * Component responsible to render an email registration form.
 */
export class RegisterEmailFormComponent implements OnInit {

  /**
   * The form containing the mail address
   */
  form: FormGroup;

  /**
   * The message prefix
   */
  @Input()
  MESSAGE_PREFIX: string;

  emailIsEmpty: boolean = false;
  emailIsInvalid: boolean = false;  
  email: string;
  
  formSubmitted = false;
  submissionTitle = null;
  submissionMessage = null;

  private readonly EMAIL_VALIDATOR: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
    });

  }

  resetFocus() {
    setTimeout(() => {
      const el = document.getElementById('email');
      if (el) {
        el.focus();
      }
    }, 0);
  }

  resetErrors(): void {
    this.emailIsEmpty = false;
    this.emailIsInvalid = false;
  }

  /**
   * Register an email address
   */
  register() {
    this.resetErrors();
    this.email = this.form.get('email').value;
    // trim values
    this.email.trim();
     if (this.email.length == 0) {
      this.emailIsEmpty = true;
      this.resetFocus();
      return;
    }

    if (!this.email.match(this.EMAIL_VALIDATOR)){
      this.emailIsInvalid = true;
      this.resetFocus();
      return;
    } 


    this.epersonRegistrationService.registerEmail(this.email).subscribe((response: RemoteData<Registration>) => {
      this.submissionTitle = response.hasSucceeded ? `${this.MESSAGE_PREFIX}.success.head`:`${this.MESSAGE_PREFIX}.error.head`;
      this.submissionMessage = response.hasSucceeded ? `${this.MESSAGE_PREFIX}.success.content` : `${this.MESSAGE_PREFIX}.error.content`;
      this.formSubmitted = true;
      this.changeDetectorRef.detectChanges();
    }
    );
    
    // OSPR change starts here
    // Notes:
    // 1. Enabling the Register button is no longer contngent on "form.invalid" being true in register-email.component.html
    // 2. The if clause above ensurew that a success/failrue message is displyed when the input is not blank
    // 3. Hence the else clause below has been added, in order to ensure that a failure message is displayed when
    //    the input is blank
    // else {
    //   this.notificationService.error(this.translateService.get(`${this.MESSAGE_PREFIX}.error.head`),
    //     this.translateService.get(`${this.MESSAGE_PREFIX}.error.content`, { email: this.email.value }));
    // }
    // OSPR change ends here
  }

}

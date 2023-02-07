import { Component, Input } from '@angular/core';
import {
  DynamicFormControlContainerComponent,
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
  DynamicTextAreaModel,

  /* OSPR change starts - add references to various dynamic control models,as needed */
  DynamicCheckboxModel,
  DynamicColorPickerModel,
  DynamicDatePickerModel,
  DynamicEditorModel,
  DynamicFileUploadModel,
  DynamicFormArrayModel,
  DynamicFormGroupModel,
  DynamicRadioGroupModel,
  DynamicSelectModel,
  DynamicSliderModel,
  DynamicSwitchModel
  /* OSPR change ends - add references to various dynamic control models, as needed */

} from '@ng-dynamic-forms/core';
import { Community } from '../../core/shared/community.model';
import { ComColFormComponent } from '../../shared/comcol-forms/comcol-form/comcol-form.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { RequestService } from '../../core/data/request.service';
import { ObjectCacheService } from '../../core/cache/object-cache.service';

/**
 * Form used for creating and editing communities
 */
@Component({
  selector: 'ds-community-form',
  styleUrls: ['../../shared/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol-forms/comcol-form/comcol-form.component.html'
})
export class CommunityFormComponent extends ComColFormComponent<Community> {
  /**
   * @type {Community} A new community when a community is being created, an existing Input community when a community is being edited
   */
  @Input() dso: Community = new Community();

  /**
   * @type {Community.type} This is a community-type form
   */
  type = Community.type;

  /**
   * The dynamic form fields used for creating/editing a community
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'title',
      name: 'dc.title',
      labelTooltip: 'title.hint',
      controlTooltip: 'title.hint',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'title.required'
      },
      hint: 'title.hint'
    }),

    /* OSPR changes start - add/remove fields for testing the new dynamic control models */
  
    new DynamicInputModel({
      id: 'titletranslation',
      name: 'dc.title.fosrctranslation',
      labelTooltip: 'titletranslation.hint',
      controlTooltip: 'titletranslation.hint',
      hint: 'titletranslation.hint',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'titletranslation.required' 
      }
    }),

    new DynamicInputModel({
      id: 'alternative-names',
      name: 'dc.title.alternative',
      labelTooltip: 'alternative-names.hint',
      controlTooltip: 'alternative-names.hint',
      required: false,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'alternative-names.required'
      },
      hint: 'alternative-names.hint'
    }),

    new DynamicInputModel({
      id: 'alternative-names-translation',
      name: 'dc.title.alternativetranslation',
      labelTooltip: 'alternative-names-translation.hint',
      controlTooltip: 'alternative-names-translation.hint',
      required: false,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'alternative-names-translation.required'
      },
      hint: 'alternative-names-translation.hint'
    }),

    new DynamicInputModel({
      id: 'identifiers',
      name: 'dc.identifiers',
      labelTooltip: 'identifiers.hint',
      controlTooltip: 'identifiers.hint',
      required: false,
      validators: {
        required: 'identifiers.required'
      },
      hint: 'identifiers.hint'
    }),
/*
    new DynamicInputModel({
      id: 'description-identifiants',
      name: 'dc.description.identifiants',
      required: false,
      validators: {
        required: null
      }
    }),*/

    new DynamicInputModel({
      id: 'researcharea',
      name: 'dc.subject',
      labelTooltip: 'researcharea.hint',
      controlTooltip: 'researcharea.hint',
      required: true,
      validators: {
        required: 'researcharea.required'
      },
      hint: 'researcharea.hint'
    }),
    new DynamicInputModel({
      id: 'researcharea-fosrctranslation',
      name: 'dc.subject.fosrctranslation',
      labelTooltip: 'researcharea-fosrctranslation.hint',
      controlTooltip: 'researcharea-fosrctranslation.hint',
      required: true,
      validators: {
        required: 'researcharea.required'
      },
      hint: 'researcharea-fosrctranslation.hint'
    }),

    new DynamicInputModel({
      id: 'home-page',
      name: 'dc.identifier.home-page',
      labelTooltip: 'home-page.hint',
      controlTooltip: 'home-page.hint',
      required: false,
      validators: {
        required: 'home-page.required'
      },
      hint: 'home-page.hint'
    }),
    new DynamicInputModel({
      id: 'home-pagetranslation',
      name: 'dc.identifier.home-pagetranslation',
      labelTooltip: 'home-pagetranslation.hint',
      controlTooltip: 'home-pagetranslation.hint',
      required: false,
      validators: {
        required: 'home-pagetranslation.required'
      },
      hint: 'home-pagetranslation.hint'
    }),

    new DynamicInputModel({
      id: 'description-email-address',
      name: 'dc.description.email-address',
      labelTooltip:   'description-email-address.hint',
      controlTooltip: 'description-email-address.hint',
      hint:           'description-email-address.hint',
      required: false,
      validators: {
        required:     'description-email-address.required'
      }
    }),

    /*This is abstract*/
    new DynamicTextAreaModel({
      id: 'abstract',
      name: 'dc.description.abstract',
      labelTooltip:   'abstract.hint',
      controlTooltip: 'abstract.hint',
      hint:           'abstract.hint',
      required: false,
      validators: {
        required:     'abstract.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'abstracttranslation',
      name: 'dc.description.abstracttranslation',
      labelTooltip:   'abstracttranslation.hint',
      controlTooltip: 'abstracttranslation.hint',
      hint:           'abstracttranslation.hint',
      required: false,
      validators: {
        required:     'abstracttranslation.required'
      }
    }),
    /*This is description*/
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description',
      labelTooltip:   'description.hint',
      controlTooltip: 'description.hint',
      hint:           'description.hint',
      required: false,
      validators: {
        required:     'description.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'description-fosrctranslation',
      name: 'dc.description.fosrctranslation',
      labelTooltip:   'description-fosrctranslation.hint',
      controlTooltip: 'description-fosrctranslation.hint',
      hint:           'description-fosrctranslation.hint',
      required: false,
      validators: {
        required:     'description-fosrctranslation.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'description-contact-address',
      name: 'dc.description.contact-address',
      labelTooltip:   'description-contact-address.hint',
      controlTooltip: 'description-contact-address.hint',
      hint:           'description-contact-address.hint',
      required: false,
      validators: {
        required:     'description-contact-address.required'
      }
    }),
    /*This is tableOfContents*/
    new DynamicTextAreaModel({
      id: 'tableofcontents',
      name: 'dc.description.tableofcontents',
      labelTooltip:   'tableofcontents.hint',
      controlTooltip: 'tableofcontents.hint',
      hint:           'tableofcontents.hint',
      required: false,
      validators: {
        required:     'tableofcontents.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'tableofcontentsTranslation',
      name: 'dc.description.tableofcontentsTranslation',
      labelTooltip:   'tableofcontentsTranslation.hint',
      controlTooltip: 'tableofcontentsTranslation.hint',
      hint:           'tableofcontentsTranslation.hint',
      required: false,
      validators: {
        required:     'tableofcontentsTranslation.required'
      }
    }),
    /*This is copyright*/
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights',
      labelTooltip:   'rights.hint',
      controlTooltip: 'rights.hint',
      hint:           'rights.hint',
      required: false,
      validators: {
        required:     'rights.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'rights-fosrctranslation',
      name: 'dc.rights.fosrctranslation',
      labelTooltip:   'rights-fosrctranslation.hint',
      controlTooltip: 'rights-fosrctranslation.hint',
      hint:           'rights-fosrctranslation.hint',
      required: false,
      validators: {
        required:     'rights-fosrctranslation.required'
      }
    }),

    /* OSPR changes end - add/remove fields for testing the new dynamic control models */
  ];

  public constructor(protected formService: DynamicFormService,
    protected translate: TranslateService,
    protected notificationsService: NotificationsService,
    protected authService: AuthService,
    protected dsoService: CommunityDataService,
    protected requestService: RequestService,
    protected objectCache: ObjectCacheService) {
    super(formService, translate, notificationsService, authService, requestService, objectCache);
  }
}

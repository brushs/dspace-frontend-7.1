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
    // Community Name
    new DynamicInputModel({
      id: 'title',
      name: 'dc.title',
/*      labelTooltip: 'title.hint',
      controlTooltip: 'title.hint',
      hint: 'title.hint'
*/    required: true,
      validators: {
        required: null
      },
      errorMessages: {
        //required: 'title.required'
      },
    }),

    /* OSPR changes start - add/remove fields for testing the new dynamic control models */
    // Translated Community Name
    new DynamicInputModel({
      id: 'titletranslation',
      name: 'dc.title.fosrctranslation',
      /*      labelTooltip: 'titletranslation.hint',
            controlTooltip: 'titletranslation.hint',
            hint: 'titletranslation.hint', */
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        //required: 'titletranslation.required' 
      }
    }),

    // Alternative Names
    new DynamicInputModel({
      id: 'alternative-names',
      name: 'dc.title.alternative',
/*      labelTooltip: 'alternative-names.hint',
      controlTooltip: 'alternative-names.hint',
          hint: 'alternative-names.hint'*/
      required: false,
      validators: {
        required: null
      },
      errorMessages: {
        //        required: 'alternative-names.required'
      }
    }),

    // Translated Alternative Names
    new DynamicInputModel({
      id: 'alternative-names-translation',
      name: 'dc.title.alternative-fosrctranslation',
/*      labelTooltip: 'alternative-names-translation.hint',
      controlTooltip: 'alternative-names-translation.hint',
      hint: 'alternative-names-translation.hint'*/
      required: false,
      validators: {
        required: null
      },
      errorMessages: {
        //required: 'alternative-names-translation.required'
      }
    }),

    // Identifiers
    new DynamicInputModel({
      id: 'identifiers',
      name: 'dc.identifier',
/*      labelTooltip: 'identifiers.hint',
      controlTooltip: 'identifiers.hint',
            hint: 'identifiers.hint'*/
      required: false,
      validators: {
        //required: 'identifiers.required'
      }
    }),

    // Main Area of Research
    new DynamicInputModel({
      id: 'researcharea',
      name: 'dc.subject',
/*      labelTooltip: 'researcharea.hint',
      controlTooltip: 'researcharea.hint',
            hint: 'researcharea.hint'*/
      required: true,
      validators: {
        //required: 'researcharea.required'
      }
    }),

    // Translated Main Area of Research
    new DynamicInputModel({
      id: 'researcharea-fosrctranslation',
      name: 'dc.subject.fosrctranslation',
/*      labelTooltip: 'researcharea-fosrctranslation.hint',
      controlTooltip: 'researcharea-fosrctranslation.hint',
      hint: 'researcharea-fosrctranslation.hint'*/
      required: true,
      validators: {
        //required: 'researcharea.required'
      }
    }),

    // Home Page
    new DynamicInputModel({
      id: 'homepage-link',
      name: 'dc.identifier.uri-home-page',
/*      labelTooltip: 'homepage-link.hint',
      controlTooltip: 'homepage-link.hint',
            hint: 'homepage-link.hint'*/
      required: false,
      validators: {
        //required: 'homepage-link.required'
      }
    }),
    new DynamicInputModel({
      id: 'homepage-link-fosrctranslation',
      name: 'dc.identifier.uri-home-page-fosrctranslation',
/*      labelTooltip: 'homepage-link-translation.hint',
      controlTooltip: 'homepage-link-fosrctranslation.hint',
            hint: 'homepage-link-fosrctranslation.hint'*/
      required: false,
      validators: {
        //required: 'homepage-link-fosrctranslation.required'
      }
    }),

    new DynamicInputModel({
      id: 'email-address',
      name: 'dc.description.email-address',
      /*      labelTooltip:   'email-address.hint',
            controlTooltip: 'email-address.hint',
            hint:           'email-address.hint',*/
      required: false,
      validators: {
        //required:     'email-address.required'
      }
    }),

    /*This is short description*/
    new DynamicTextAreaModel({
      id: 'abstract',
      name: 'dc.description.abstract',
      /*      labelTooltip:   'abstract.hint',
            controlTooltip: 'abstract.hint',
            hint:           'abstract.hint',*/
      required: false,
      validators: {
        //required:     'abstract.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'abstracttranslation',
      name: 'dc.description.abstract-fosrctranslation',
      /*      labelTooltip:   'abstracttranslation.hint',
            controlTooltip: 'abstracttranslation.hint',
            hint:           'abstracttranslation.hint',*/
      required: false,
      validators: {
        //required:     'abstracttranslation.required'
      }
    }),
    /*This is description*/
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description',
      /*      labelTooltip:   'description.hint',
            controlTooltip: 'description.hint',
            hint:           'description.hint',*/
      required: false,
      validators: {
        //required:     'description.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'description-fosrctranslation',
      name: 'dc.description.fosrctranslation',
      /*      labelTooltip:   'description-fosrctranslation.hint',
            controlTooltip: 'description-fosrctranslation.hint',
            hint:           'description-fosrctranslation.hint',*/
      required: false,
      validators: {
        //required:     'description-fosrctranslation.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'contact-address',
      name: 'dc.description.contact-address',
      /*      labelTooltip:   'contact-address.hint',
            controlTooltip: 'contact-address.hint',
            hint:           'contact-address.hint',*/
      required: false,
      validators: {
        //required:     'contact-address.required'
      }
    }),
    /*This is tableOfContents --News element*/
    new DynamicTextAreaModel({
      id: 'tableofcontents',
      name: 'dc.description.tableofcontents',
      /*      labelTooltip:   'tableofcontents.hint',
            controlTooltip: 'tableofcontents.hint',
            hint:           'tableofcontents.hint',*/
      required: false,
      validators: {
        //required:     'tableofcontents.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'tableofcontentsTranslation',
      name: 'dc.description.tableofcontents-fosrctranslation',
      /*      labelTooltip:   'tableofcontentsTranslation.hint',
            controlTooltip: 'tableofcontentsTranslation.hint',
            hint:           'tableofcontentsTranslation.hint',*/
      required: false,
      validators: {
        //required:     'tableofcontentsTranslation.required'
      }
    }),
    /*This is copyright*/
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights',
      /*      labelTooltip:   'rights.hint',
            controlTooltip: 'rights.hint',
            hint:           'rights.hint',*/
      required: false,
      validators: {
        //required:     'rights.required'
      }
    }),
    new DynamicTextAreaModel({
      id: 'rights-fosrctranslation',
      name: 'dc.rights.fosrctranslation',
      /*      labelTooltip:   'rights-fosrctranslation.hint',
            controlTooltip: 'rights-fosrctranslation.hint',
            hint:           'rights-fosrctranslation.hint',*/
      required: false,
      validators: {
        //required:     'rights-fosrctranslation.required'
      }
    })

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

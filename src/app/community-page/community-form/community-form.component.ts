import { Component, Input } from '@angular/core';
import {
  DynamicFormControlContainerComponent,
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
  DynamicTextAreaModel,

  /* OSPR change starts - add references to various dynamic control models,as needed */
  //DynamicCheckboxModel,
  //DynamicColorPickerModel,
  //DynamicDatePickerModel,
  //DynamicEditorModel,
  //DynamicFileUploadModel,
  //DynamicFormArrayModel,
  //DynamicFormGroupModel,
  //DynamicRadioGroupModel,
  DynamicSelectModel,
  //DynamicSliderModel,
  //DynamicSwitchModel
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
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'Please enter a name for this title'
      },
      hint: 'create.community.other-name.hint'
    }),

    /* OSPR changes start - add/remove fields for testing the new dynamic control models */

    new DynamicTextAreaModel({
      id: 'description-nom',
      name: 'dc.description.nom',
      hint: 'create.community.other-name.hint'
    }),
    new DynamicTextAreaModel({
      id: 'description-other-names',
      name: 'dc.description.other-names',
      labelTooltip: 'create.community.other-name.hint',
      controlTooltip: 'create.community.other-name.hint'
    }),
    /* Use a text area instread of a dropdown list for now */
    new DynamicTextAreaModel({
      id: 'description-identifications',
      name: 'dc.description.identifications',
    }),
    //new DynamicSelectModel({
    //  id: 'description-identifications',
    //  name: 'dc.description.identifications',
    //}),
    //new DynamicSelectModel({
    //  id: 'description-blank',
    //  name: 'dc.description.blank',
    //}),
    /* Use a text area instread of a dropdown list for now */
    new DynamicTextAreaModel({
      id: 'description-topic-subject',
      name: 'dc.description.topic-subject',
    }),
    //new DynamicSelectModel({
    //  id: 'description-topic-subject',
    //  name: 'dc.description.topic-subject',
    //}),
    //new DynamicSelectModel({
    //  id: 'description-blank',
    //  name: 'dc.description.blank',
    //}),
    new DynamicTextAreaModel({
      id: 'description-home-page',
      name: 'dc.description.home-page',
    }),
    new DynamicTextAreaModel({
      id: 'description-home-page-french',
      name: 'dc.description.home-page-french',
    }),
    new DynamicTextAreaModel({
      id: 'description-email-address',
      name: 'dc.description.email-address',
    }),
    new DynamicTextAreaModel({
      id: 'description-short-description',
      name: 'dc.description.short-descr',
    }),
    new DynamicTextAreaModel({
      id: 'description-short-description-french',
      name: 'dc.description.short-descr-french',
    }),
    new DynamicTextAreaModel({
      id: 'description-description-html',
      name: 'dc.description.description-html',
    }),
    new DynamicTextAreaModel({
      id: 'description-description-html-french',
      name: 'dc.description.description-html-french',
    }),
    new DynamicTextAreaModel({
      id: 'description-contact-address',
      name: 'dc.description.contact-address',
    }),
    new DynamicTextAreaModel({
      id: 'description-copyright',
      name: 'dc.description.copyright',
    }),
    new DynamicTextAreaModel({
      id: 'description-copyright-french',
      name: 'dc.description.copyright-french',
    }),
    new DynamicTextAreaModel({
      id: 'description-news-iframe',
      name: 'dc.description.news-iframe',
    }),
    new DynamicTextAreaModel({
      id: 'description-news-iframe-french',
      name: 'dc.description.news-iframe-french',
    }),

    /* Notes: */
    /* - these are the original fields */
    /* - they should eventually replace the corresponding ones used for testing above */

    //new DynamicTextAreaModel({
    //  id: 'description',
    //  name: 'dc.description',
    //}),
    //new DynamicTextAreaModel({
    //  id: 'poope',
    //  name: 'local.poope',
    //}),
    //new DynamicTextAreaModel({
    //  id: 'poope-more',
    //  name: 'local.poope.more',
    //}),
    //new DynamicTextAreaModel({
    //  id: 'abstract',
    //  name: 'dc.description.abstract',
    //}),
    //new DynamicTextAreaModel({
    //  id: 'rights',
    //  name: 'dc.rights',
    //}),
    //new DynamicTextAreaModel({
    //  id: 'tableofcontents',
    //  name: 'dc.description.tableofcontents',
    //}),
    /* OSPR changes end - add/remove fields for testing the new dynamic control models */

    /* OSPR changes start - add placeholders for additional dynamic control models */
    //new DynamicCheckboxModel({
    //  id: 'description-other-names',
    //  name: 'dc.description.other-names',
    //}),
    //new DynamicRadioModel({
    //  id: 'description-other-names',
    //  name: 'dc.description.other-names',
    //}),
    //new DynamicColorPickerModel({
    //  id: 'description-other-names',
    //  name: 'dc.description.other-names',
    //}),
    //new DynamicDatePickerModel({
    //  id: 'description-other-names',
    //  name: 'dc.description.other-names',
    //}),
    //new DynamicFileUploadModel({
    //  id: 'description-other-names',
    //  name: 'dc.description.other-names',
    //}),
    //new DynamicFormArrayModel({
    //  id: 'description-other-names',
    //  name: 'dc.description.other-names',
    //}),
    //new DynamicFormGroupModel({
    //  id: 'description-other-names',
    //  name: 'dc.description.other-names',
    //}),
    //new DynamicSliderModel({
    //  id: 'description-other-names',
    //  name: 'dc.description.other-names',
    //}),
    //new DynamicSwitchModel({
    //  id: 'description-other-names',
    //  name: 'dc.description.other-names',
    //}),
    /* OSPR changes end - add placeholders for additional dynamic control models */
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
/* OSPR changes start - add examples of test code for the various dynamic control models */
/* (see form-builder.service.spec.ts) */

  //TestBed.configureTestingModule({
  //  imports: [ReactiveFormsModule],
  //  providers: [
  //    { provide: FormBuilderService, useClass: FormBuilderService },
  //    { provide: DynamicFormValidationService, useValue: { } },
  //    { provide: NG_VALIDATORS, useValue: testValidator, multi: true },
  //    { provide: NG_ASYNC_VALIDATORS, useValue: testAsyncValidator, multi: true }
  //  ]
  //});

  //const vocabularyOptions: VocabularyOptions = {
  //  name: 'type_programme',
  //  closed: false
  //};

  //testModel = [

  //  new DynamicSelectModel<string>(
  //    {
  //      id: 'testSelect',
  //      options: [
  //        {
  //          label: 'Option 1',
  //          value: 'option-1'
  //        },
  //        {
  //          label: 'Option 2',
  //          value: 'option-2'
  //        }
  //      ],
  //      value: 'option-3'
  //    }
  //  ),

  //  new DynamicInputModel(
  //    {
  //      id: 'testInput',
  //      mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
  //    }
  //  ),

  //  new DynamicCheckboxGroupModel(
  //    {
  //      id: 'testCheckboxGroup',
  //      group: [
  //        new DynamicCheckboxModel(
  //          {
  //            id: 'testCheckboxGroup1',
  //            value: true
  //          }
  //        ),
  //        new DynamicCheckboxModel(
  //          {
  //            id: 'testCheckboxGroup2',
  //            value: true
  //          }
  //        )
  //      ]
  //    }
  //  ),

  //  new DynamicRadioGroupModel<string>(
  //    {
  //      id: 'testRadioGroup',
  //      options: [
  //        {
  //          label: 'Option 1',
  //          value: 'option-1'
  //        },
  //        {
  //          label: 'Option 2',
  //          value: 'option-2'
  //        }
  //      ],
  //      value: 'option-3'
  //    }
  //  ),

  //  new DynamicTextAreaModel({ id: 'testTextArea' }),

  //  new DynamicCheckboxModel({ id: 'testCheckbox' }),

  //  new DynamicFormArrayModel(
  //    {
  //      id: 'testFormArray',
  //      initialCount: 5,
  //      groupFactory: () => {
  //        return [
  //          new DynamicInputModel({ id: 'testFormArrayGroupInput' }),
  //          new DynamicFormArrayModel({
  //            id: 'testNestedFormArray', groupFactory: () => [
  //              new DynamicInputModel({ id: 'testNestedFormArrayGroupInput' })
  //            ]
  //          })
  //        ];
  //      }
  //    }
  //  ),

  //  new DynamicFormGroupModel(
  //    {
  //      id: 'testFormGroup',
  //      group: [
  //        new DynamicInputModel({ id: 'nestedTestInput' }),
  //        new DynamicTextAreaModel({ id: 'nestedTestTextArea' })
  //      ]
  //    }
  //  ),

  //  new DynamicSliderModel({ id: 'testSlider' }),

  //  new DynamicSwitchModel({ id: 'testSwitch' }),

  //  new DynamicDatePickerModel({ id: 'testDatepicker', value: new Date() }),

  //  new DynamicFileUploadModel({ id: 'testFileUpload' }),

  //  new DynamicEditorModel({ id: 'testEditor' }),

  //  new DynamicTimePickerModel({ id: 'testTimePicker' }),

  //  new DynamicRatingModel({ id: 'testRating' }),

  //  new DynamicColorPickerModel({ id: 'testColorPicker' }),

  //  new DynamicOneboxModel({
  //    id: 'testOnebox',
  //    repeatable: false,
  //    metadataFields: [],
  //    submissionId: '1234',
  //    hasSelectableMetadata: false
  //  }),

  //  new DynamicScrollableDropdownModel({
  //    id: 'testScrollableDropdown',
  //    vocabularyOptions: vocabularyOptions,
  //    repeatable: false,
  //    metadataFields: [],
  //    submissionId: '1234',
  //    hasSelectableMetadata: false
  //  }),

  //  new DynamicTagModel({
  //    id: 'testTag',
  //    repeatable: false,
  //    metadataFields: [],
  //    submissionId: '1234',
  //    hasSelectableMetadata: false
  //  }),

  //  new DynamicListCheckboxGroupModel({
  //    id: 'testCheckboxList',
  //    vocabularyOptions: vocabularyOptions,
  //    repeatable: true
  //  }),

  //  new DynamicListRadioGroupModel({ id: 'testRadioList', vocabularyOptions: vocabularyOptions, repeatable: false }),

  //  new DynamicRelationGroupModel({
  //    submissionId,
  //    id: 'testRelationGroup',
  //    formConfiguration: [{
  //      fields: [{
  //        hints: 'Enter the name of the author.',
  //        input: { type: 'onebox' },
  //        label: 'Authors',
  //        languageCodes: [],
  //        mandatory: 'true',
  //        mandatoryMessage: 'Required field!',
  //        repeatable: false,
  //        selectableMetadata: [{
  //          controlledVocabulary: 'RPAuthority',
  //          closed: false,
  //          metadata: 'dc.contributor.author'
  //        }]
  //      } as FormFieldModel]
  //    } as FormRowModel, {
  //      fields: [{
  //        hints: 'Enter the affiliation of the author.',
  //        input: { type: 'onebox' },
  //        label: 'Affiliation',
  //        languageCodes: [],
  //        mandatory: 'false',
  //        repeatable: false,
  //        selectableMetadata: [{
  //          controlledVocabulary: 'OUAuthority',
  //          closed: false,
  //          metadata: 'local.contributor.affiliation'
  //        }]
  //      } as FormFieldModel]
  //    } as FormRowModel],
  //    mandatoryField: '',
  //    name: 'testRelationGroup',
  //    relationFields: [],
  //    scopeUUID: '',
  //    submissionScope: '',
  //    repeatable: false,
  //    metadataFields: [],
  //    hasSelectableMetadata: true
  //  }),

  //  new DynamicDsDatePickerModel({ id: 'testDate' }),

  //  new DynamicLookupModel({
  //    id: 'testLookup',
  //    repeatable: false,
  //    metadataFields: [],
  //    submissionId: '1234',
  //    hasSelectableMetadata: true
  //  }),

  //  new DynamicLookupNameModel({
  //    id: 'testLookupName',
  //    repeatable: false,
  //    metadataFields: [],
  //    submissionId: '1234',
  //    hasSelectableMetadata: true
  //  }),

  //  new DynamicQualdropModel({ id: 'testCombobox', readOnly: false, required: false }),

  //  new DynamicRowArrayModel(
  //    {
  //      id: 'testFormRowArray',
  //      initialCount: 5,
  //      notRepeatable: false,
  //      relationshipConfig: undefined,
  //      submissionId: '1234',
  //      isDraggable: true,
  //      groupFactory: () => {
  //        return [
  //          new DynamicInputModel({ id: 'testFormRowArrayGroupInput' })
  //        ];
  //      },
  //      required: false,
  //      metadataKey: 'dc.contributor.author',
  //      metadataFields: ['dc.contributor.author'],
  //      hasSelectableMetadata: true
  //    },
  //  ),
  //];

  /* OSPR changes end - add examples of test code for the various dynamic control models */

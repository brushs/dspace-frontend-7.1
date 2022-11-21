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
  
    new DynamicInputModel({
      id: 'description-nom',
      name: 'dc.dc.description.nom',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'Please enter a name for this title'
      },
      hint: 'create.community.other-name.hint'
    }),

    // new DynamicTextAreaModel({
    //   id: 'description-nom',
    //   name: 'dc.description.nom',
    //   hint: 'create.community.other-name.hint'
    // }),
    new DynamicTextAreaModel({
      id: 'description-other-names',
      name: 'dc.description.other-names',
      labelTooltip: 'create.community.other-name.hint',
      controlTooltip: 'create.community.other-name.hint'
    }),
    /* Use a text area instread of a dropdown list for now */
    // new DynamicTextAreaModel({
    //   id: 'description-identifications',
    //   name: 'dc.description.identifications',
    // }),
    new DynamicSelectModel({
     id: 'description-identifications',
     name: 'dc.description.identifications',
    }),
    // new DynamicSelectModel({
    //  id: 'description-blank',
    //  name: 'dc.description.blank',
    // }),
    /* Use a text area instread of a dropdown list for now */
    new DynamicTextAreaModel({
      id: 'description-topic-subject',
      name: 'dc.description.topic-subject',
    }),
    new DynamicTextAreaModel({
      id: 'description-topic-subject-french',
      name: 'dc.description.topic-subject-french',
    }),
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
      id: 'description-news-iframe',
      name: 'dc.description.news-iframe',
    }),
    new DynamicTextAreaModel({
      id: 'description-news-iframe-french',
      name: 'dc.description.news-iframe-french',
    }),
    new DynamicTextAreaModel({
      id: 'description-copyright',
      name: 'dc.description.copyright',
    }),
    new DynamicTextAreaModel({
      id: 'description-copyright-french',
      name: 'dc.description.copyright-french',
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
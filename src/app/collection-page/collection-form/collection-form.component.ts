import { Component, Input } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { Collection } from '../../core/shared/collection.model';
import { ComColFormComponent } from '../../shared/comcol-forms/comcol-form/comcol-form.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { RequestService } from '../../core/data/request.service';
import { ObjectCacheService } from '../../core/cache/object-cache.service';

/**
 * Form used for creating and editing collections
 */
@Component({
  selector: 'ds-collection-form',
  styleUrls: ['../../shared/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol-forms/comcol-form/comcol-form.component.html'
})
export class CollectionFormComponent extends ComColFormComponent<Collection> {
  /**
   * @type {Collection} A new collection when a collection is being created, an existing Input collection when a collection is being edited
   */
  @Input() dso: Collection = new Collection();

  /**
   * @type {Collection.type} This is a collection-type form
   */
  type = Collection.type;

  /**
   * The dynamic form fields used for creating/editing a collection
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
    }),
    /* OSPR changes start - add/remove fields for testing the new dynamic control models */
    new DynamicInputModel({
      id: 'description-nom',
      name: 'dc.description.nom',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'Please enter a name for this title'
      },
    }),

    new DynamicInputModel({
      id: 'description-topic-subject',
      name: 'dc.description.topic-subject',
      required: true,
      validators: {
        required: null
      }
    }),
    new DynamicInputModel({
      id: 'description-topic-subject-french',
      name: 'dc.description.topic-subject-french',
      required: true,
      validators: {
        required: null
      }
    }),

    /*This is description*/
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description',
    }),
    new DynamicTextAreaModel({
      id: 'description-french',
      name: 'dc.description.french',
    }),

    new DynamicInputModel({
      id: 'description-email-address',
      name: 'dc.description.email-address',
      required: false,
      validators: {
        required: null
      }
    }),

    /*This is copyright*/
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights',
    }),
    new DynamicTextAreaModel({
      id: 'rights-french',
      name: 'dc.rights.french',
    }),

    /*This is rights.license*/
    new DynamicTextAreaModel({
      id: 'license',
      name: 'dc.rights.license',
    }),
    new DynamicTextAreaModel({
      id: 'description-license-french',
      name: 'dc.description.license-french',
    }),

    new DynamicInputModel({
      id: 'provenance',
      name: 'dc.description.provenance',
      required: false,
      validators: {
        required: null
      }
    }),
    new DynamicInputModel({
      id: 'description-provenance-french',
      name: 'dc.description.provenance-french',
      required: false,
      validators: {
        required: null
      }
    }),

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

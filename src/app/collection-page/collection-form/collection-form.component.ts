import { Component, Input } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
  DynamicTextAreaModel,
  DynamicSelectModel,
  DynamicFormGroupModel
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
    //new DynamicFormGroupModel(new DynamicFormGroupModelConfig
    new DynamicInputModel({
      id: 'title',
      name: 'dc.title', //this.translate.currentLang === 'en' ? 'dc.title' : 'dc.title.fosrctranslation',
      required: true,
      //languageCodes: [{'code': 'en', 'display': 'En'}, {'code': 'fr', 'display': 'Fr'}],
      validators: {
        required: null
      },
      errorMessages: {
        //required: 'Please enter a name for this title'
      },
    }, {'grid': {
      control: "col-sm-10",
      label: "col-sm-3"
    }
    }),
    /*
    new DynamicSelectModel({
      id: 'dc-title-lang',
      name: 'dc.title-lang',//(this.translate.currentLang === 'en' ? 'dc.title' : 'dc.title.fosrctranslation') + '-lang',
      label: 'Language',
//      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),

    /* OSPR changes start - add/remove fields for testing the new dynamic control models *//*
    new DynamicInputModel({
      id: 'translatedTitle',
      name: 'dc.title.fosrctranslation',//this.translate.currentLang === 'fr' ? 'dc.title' : 'dc.title.fosrctranslation',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        //required: 'Please enter a name for this title'
      },
    }),
    new DynamicSelectModel({
      id: 'dc-title-fosrctranslation-lang',
      name: 'dc.title.fosrctranslation-lang', //(this.translate.currentLang === 'fr' ? 'dc.title' : 'dc.title.fosrctranslation') + '-lang',
      label: 'Language',
//      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),

    new DynamicInputModel({
      id: 'subject',
      name: 'dc.subject', //this.translate.currentLang === 'en' ? 'dc.subject' : 'dc.subject.fosrctranslation',
      required: true,
      validators: {
        required: null
      }
    }),
    new DynamicSelectModel({
      id: 'subject-lang',
      name: 'dc.subject-lang', //(this.translate.currentLang === 'en' ? 'dc.subject' : 'dc.subject.fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),

    new DynamicInputModel({
      id: 'subject-fosrctranslation',
      name: 'dc.subject.fosrctranslation', //this.translate.currentLang === 'fr' ? 'dc.subject' : 'dc.subject.fosrctranslation',
      required: true,
      validators: {
        required: null
      }
    }),
    new DynamicSelectModel({
      id: 'subject-fosrctranslation-lang',
      name: 'dc.subject.fosrctranslation-lang', //(this.translate.currentLang === 'fr' ? 'dc.subject' : 'dc.subject.fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),


    /*This is description*//*
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description', //this.translate.currentLang === 'en' ? 'dc.description' : 'dc.description.fosrctranslation',
    }),
    new DynamicSelectModel({
      id: 'description-lang',
      name: 'dc.description-lang', //(this.translate.currentLang === 'en' ? 'dc.description' : 'dc.description.fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),

    new DynamicTextAreaModel({
      id: 'description-fosrctranslation',
      name: 'dc.description.fosrctranslation', //this.translate.currentLang === 'fr' ? 'dc.description' : 'dc.description.fosrctranslation',
    }),
    new DynamicSelectModel({
      id: 'description-fosrctranslation-lang',
      name: 'dc.description.fosrctranslation-lang', //(this.translate.currentLang === 'fr' ? 'dc.description' : 'dc.description.fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),


    new DynamicInputModel({
      id: 'email-address',
      name: 'dc.description.email-address',
      required: false,
    }),

    /*This is copyright*//*
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights', //this.translate.currentLang === 'en' ? 'dc.rights' : 'dc.rights.fosrctranslation',
    }),
    new DynamicSelectModel({
      id: 'rights-lang',
      name: 'dc.rights-lang', //(this.translate.currentLang === 'en' ? 'dc.rights' : 'dc.rights.fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),

    new DynamicTextAreaModel({
      id: 'rights-fosrctranslation',
      name: 'dc.rights.fosrctranslation', //this.translate.currentLang === 'fr' ? 'dc.rights' : 'dc.rights.fosrctranslation',
    }),
    new DynamicSelectModel({
      id: 'rights-fosrctranslation-lang',
      name: 'dc.rights.fosrctranslation-lang', //(this.translate.currentLang === 'fr' ? 'dc.rights' : 'dc.rights.fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),


    /*This is rights.license*//*
    new DynamicTextAreaModel({
      id: 'license',
      name: 'dc.rights.license', //this.translate.currentLang === 'en' ? 'dc.rights.license' : 'dc.rights.license-fosrctranslation',
    }),
    new DynamicSelectModel({
      id: 'license-lang',
      name: 'dc.rights.license-lang', //(this.translate.currentLang === 'en' ? 'dc.rights.license' : 'dc.rights.license-fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),

    new DynamicTextAreaModel({
      id: 'license-fosrctranslation',
      name: 'dc.rights.license-fosrctranslation', //this.translate.currentLang === 'fr' ? 'dc.rights.license' : 'dc.rights.license-fosrctranslation',
    }),
    new DynamicSelectModel({
      id: 'license-fosrctranslation-lang',
      name: 'dc.rights.license-fosrctranslation-lang', //(this.translate.currentLang === 'fr' ? 'dc.rights.license' : 'dc.rights.license-fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),


    new DynamicInputModel({
      id: 'provenance',
      name: 'dc.description.provenance', //this.translate.currentLang === 'en' ? 'dc.description.provenance' : 'dc.description.provenance-fosrctranslation',
      required: false,
    }),
    new DynamicSelectModel({
      id: 'provenance-lang',
      name: 'dc.description.provenance-lang', //(this.translate.currentLang === 'en' ? 'dc.description.provenance' : 'dc.description.provenance-fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),

    new DynamicInputModel({
      id: 'provenance-fosrctranslation',
      name: 'dc.description.provenance-fosrctranslation', //this.translate.currentLang === 'fr' ? 'dc.description.provenance' : 'dc.description.provenance-fosrctranslation',
      required: false,
    }),
    new DynamicSelectModel({
      id: 'provenance-fosrctranslation-lang',
      name: 'dc.description.provenance-fosrctranslation-lang', //(this.translate.currentLang === 'fr' ? 'dc.description.provenance' : 'dc.description.provenance-fosrctranslation') + '-lang',
      label: 'Language',
      value: this.translate.currentLang,
      options: [{
        value: 'en',
        label: 'EN'
        },
        {
          value: 'fr',
          label: 'FR'
        }]
    }, {'grid': {
      control: "col-sm-2",
      label: "col-sm-3"
    }}),
    */

  ];

  public constructor(protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CommunityDataService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService) {
    super(formService, translate, notificationsService, authService, requestService, objectCache);
    console.log("current Language from collection-form: " + translate.currentLang);
  }
}

// the OSPR changes shown here have been implemented at both the theme and the app level
import { Bitstream } from '../../../../../app/core/shared/bitstream.model';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../../app/core/shared/item.model';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemBitstreamsComponent } from './item-bitstreams.component';
import { ItemDataService } from '../../../../../app/core/data/item-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectUpdatesService } from '../../../../../app/core/data/object-updates/object-updates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from '../../../../../app/shared/notifications/notifications.service';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { FieldChangeType } from '../../../../../app/core/data/object-updates/object-updates.actions';
import { INotification, Notification } from '../../../../../app/shared/notifications/models/notification.model';
import { NotificationType } from '../../../../../app/shared/notifications/models/notification-type';
import { BitstreamDataService } from '../../../../../app/core/data/bitstream-data.service';
import { ObjectCacheService } from '../../../../../app/core/cache/object-cache.service';
import { RequestService } from '../../../../../app/core/data/request.service';
import { ObjectValuesPipe } from '../../../../../app/shared/utils/object-values-pipe';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { BundleDataService } from '../../../../../app/core/data/bundle-data.service';
import { Bundle } from '../../../../../app/core/shared/bundle.model';
import { RestResponse } from '../../../../../app/core/cache/response.models';
import { SearchConfigurationService } from '../../../../../app/core/shared/search/search-configuration.service';
import { RouterStub } from '../../../../../app/shared/testing/router.stub';
import { getMockRequestService } from '../../../../../app/shared/mocks/request.service.mock';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../../../app/shared/remote-data.utils';
import { createPaginatedList } from '../../../../../app/shared/testing/utils.test';
// OSPR fix begins here
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
// OSPR fix ends here
let comp: ItemBitstreamsComponent;
let fixture: ComponentFixture<ItemBitstreamsComponent>;

const infoNotification: INotification = new Notification('id', NotificationType.Info, 'info');
const warningNotification: INotification = new Notification('id', NotificationType.Warning, 'warning');
const successNotification: INotification = new Notification('id', NotificationType.Success, 'success');
const bitstream1 = Object.assign(new Bitstream(), {
  id: 'bitstream1',
  uuid: 'bitstream1'
});
const bitstream2 = Object.assign(new Bitstream(), {
  id: 'bitstream2',
  uuid: 'bitstream2'
});
const fieldUpdate1 = {
  field: bitstream1,
  changeType: undefined
};
const fieldUpdate2 = {
  field: bitstream2,
  changeType: FieldChangeType.REMOVE
};
const bundle = Object.assign(new Bundle(), {
  id: 'bundle1',
  uuid: 'bundle1',
  _links: {
    self: { href: 'bundle1-selflink' }
  },
  bitstreams: createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1, bitstream2]))
});
const moveOperations = [
  {
    op: 'move',
    from: '/0',
    path: '/1'
  }
];
const date = new Date();
const url = 'thisUrl';
let item: Item;
let itemService: ItemDataService;
let objectUpdatesService: ObjectUpdatesService;
let router: any;
let route: ActivatedRoute;
let notificationsService: NotificationsService;
let bitstreamService: BitstreamDataService;
let objectCache: ObjectCacheService;
let requestService: RequestService;
let searchConfig: SearchConfigurationService;
let bundleService: BundleDataService;

describe('ItemBitstreamsComponent', () => {
  beforeEach(waitForAsync(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [bitstream1.uuid]: fieldUpdate1,
          [bitstream2.uuid]: fieldUpdate2,
        }),
        getFieldUpdatesExclusive: observableOf({
          [bitstream1.uuid]: fieldUpdate1,
          [bitstream2.uuid]: fieldUpdate2,
        }),
        saveAddFieldUpdate: {},
        discardFieldUpdates: {},
        discardAllFieldUpdates: {},
        reinstateFieldUpdates: observableOf(true),
        initialize: {},
        getUpdatedFields: observableOf([bitstream1, bitstream2]),
        getLastModified: observableOf(date),
        hasUpdates: observableOf(true),
        isReinstatable: observableOf(false),
        isValidPage: observableOf(true),
        getMoveOperations: observableOf(moveOperations)
      }
    );
    router = Object.assign(new RouterStub(), {
      url: url
    });
    notificationsService = jasmine.createSpyObj('notificationsService',
      {
        info: infoNotification,
        warning: warningNotification,
        success: successNotification
      }
    );
    bitstreamService = jasmine.createSpyObj('bitstreamService', {
      delete: jasmine.createSpy('delete')
    });
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove')
    });
    requestService = getMockRequestService();
    searchConfig = Object.assign({
      paginatedSearchOptions: observableOf({})
    });

    item = Object.assign(new Item(), {
      uuid: 'item',
      id: 'item',
      _links: {
        self: { href: 'item-selflink' }
      },
      bundles: createSuccessfulRemoteDataObject$(createPaginatedList([bundle])),
      lastModified: date
    });
    itemService = Object.assign({
      getBitstreams: () => createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1, bitstream2])),
      findByHref: () => createSuccessfulRemoteDataObject$(item),
      findById: () => createSuccessfulRemoteDataObject$(item),
      getBundles: () => createSuccessfulRemoteDataObject$(createPaginatedList([bundle]))
    });
    route = Object.assign({
      parent: {
        data: observableOf({ dso: createSuccessfulRemoteDataObject(item) })
      },
      data: observableOf({}),
      url: url
    });
    bundleService = jasmine.createSpyObj('bundleService', {
      patch: observableOf(new RestResponse(true, 200, 'OK'))
    });

    // OSPR fix begins here
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ItemBitstreamsComponent, ObjectValuesPipe, VarDirective],
      providers: [
        { provide: ItemDataService, useValue: itemService },
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: BitstreamDataService, useValue: bitstreamService },
        { provide: ObjectCacheService, useValue: objectCache },
        { provide: RequestService, useValue: requestService },
        { provide: SearchConfigurationService, useValue: searchConfig },
        { provide: BundleDataService, useValue: bundleService },
        ChangeDetectorRef
      ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    // OSPR fix ends here
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBitstreamsComponent);
    comp = fixture.componentInstance;
    //comp.url = url;
    fixture.detectChanges();
  });

  describe('when submit is called', () => {
    beforeEach(() => {
      comp.submit();
    });

    it('should call delete on the bitstreamService for the marked field', () => {
      expect(bitstreamService.delete).toHaveBeenCalledWith(bitstream2.id);
    });

    it('should not call delete on the bitstreamService for the unmarked field', () => {
      expect(bitstreamService.delete).not.toHaveBeenCalledWith(bitstream1.id);
    });
  });

  describe('when dropBitstream is called', () => {
    const event = {
      fromIndex: 0,
      toIndex: 50,
      // tslint:disable-next-line:no-empty
      finish: () => {
      }
    };

    beforeEach(() => {
      comp.dropBitstream(bundle, event);
    });
  });

  describe('when dropBitstream is called', () => {
    beforeEach((done) => {
      comp.dropBitstream(bundle, {
        fromIndex: 0,
        toIndex: 50,
        // tslint:disable-next-line:no-empty
        finish: () => {
          done();
        }
      });
    });

    it('should send out a patch for the move operation', () => {
      expect(bundleService.patch).toHaveBeenCalled();
    });
  });

  describe('discard', () => {
    it('should discard ALL field updates', () => {
      comp.discard();
      expect(objectUpdatesService.discardAllFieldUpdates).toHaveBeenCalled();
    });
  });

  describe('reinstate', () => {
    it('should reinstate field updates on the bundle', () => {
      comp.reinstate();
      expect(objectUpdatesService.reinstateFieldUpdates).toHaveBeenCalledWith(bundle.self);
    });
  });
});

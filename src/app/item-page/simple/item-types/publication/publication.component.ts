import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ItemComponent } from '../shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LocaleService } from '../../../../core/locale/locale.service';
import { RouteService } from '../../../../core/services/route.service';
import { Router } from '@angular/router';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent('Publication', ViewMode.StandalonePage)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent implements OnInit {
  displayLarge = false;
  uniLanguage = false;
  isMultimediaCollection$: Observable<boolean>;

  constructor(
    protected dsoNameService: DSONameService,
    protected localeService: LocaleService,
    protected routeService: RouteService,
    protected router: Router,
    protected collectionDataService: CollectionDataService
  ) {
    super(dsoNameService, localeService, routeService, router);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const flag = (this.object?.firstMetadataValue('nrcan.unilingual') || '').toLowerCase();
    this.uniLanguage = flag === 'true' || flag === 'yes' || flag === 'y'

    // Check if the item belongs to the "Multimedia" collection
    this.isMultimediaCollection$ = this.collectionDataService.findOwningCollectionFor(this.object).pipe(
      map((collectionRD) => {
        if (collectionRD?.hasSucceeded && collectionRD.payload) {
          var collectionName = collectionRD.payload.name;
          console.log('Collection Name:', collectionName);
          return collectionName?.toLowerCase().includes('multim')
        }
        return false;
      })
    );
  }

  handleShouldHide(shouldHide: boolean) {
    // shouldHide means should hide the normal file download link
    // also means show the large file download link
    this.displayLarge = shouldHide;
    //console.log('shouldHide:', shouldHide);
  }
}

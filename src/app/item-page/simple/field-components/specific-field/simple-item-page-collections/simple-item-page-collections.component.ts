import { Component, OnInit } from '@angular/core';
import { CollectionsComponent } from '../../../../field-components/collections/collections.component';

@Component({
  selector: 'ds-simple-item-page-collections',
  templateUrl: './simple-item-page-collections.component.html',
  styleUrls: ['./simple-item-page-collections.component.scss']
})
export class SimpleItemPageCollectionsComponent extends CollectionsComponent {

  showCollections: boolean = false;
  ngOnInit(): void {
    super.ngOnInit();
    this.collectionsRD$.subscribe((collections) => {
      this.showCollections =
      collections.hasSucceeded &&
      !!collections.payload?.page &&
      collections.payload.page.length > 0 &&
      !(collections.payload.page.length === 1 && collections.payload.page[0].name.length === 0);
    });
  }


}

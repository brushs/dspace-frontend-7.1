import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ItemPageComponent } from './simple/item-page.component';
import { ItemPageRoutingModule } from './item-page-routing.module';
import { MetadataUriValuesComponent } from './field-components/metadata-uri-values/metadata-uri-values.component';
import { ItemPageAuthorFieldComponent } from './simple/field-components/specific-field/author/item-page-author-field.component';
import { ItemPageDateFieldComponent } from './simple/field-components/specific-field/date/item-page-date-field.component';
import { ItemPageAbstractFieldComponent } from './simple/field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageUriFieldComponent } from './simple/field-components/specific-field/uri/item-page-uri-field.component';
import { ItemPageTitleFieldComponent } from './simple/field-components/specific-field/title/item-page-title-field.component';
import { ItemPageFieldComponent } from './simple/field-components/specific-field/item-page-field.component';
import { FileSectionComponent } from './simple/field-components/file-section/file-section.component';
import { CollectionsComponent } from './field-components/collections/collections.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { FullFileSectionComponent } from './full/field-components/file-section/full-file-section.component';
import { PublicationComponent } from './simple/item-types/publication/publication.component';
import { ItemComponent } from './simple/item-types/shared/item.component';
import { EditItemPageModule } from './edit-item-page/edit-item-page.module';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { AbstractIncrementalListComponent } from './simple/abstract-incremental-list/abstract-incremental-list.component';
import { UntypedItemComponent } from './simple/item-types/untyped-item/untyped-item.component';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { MediaViewerVideoComponent } from './media-viewer/media-viewer-video/media-viewer-video.component';
import { MediaViewerImageComponent } from './media-viewer/media-viewer-image/media-viewer-image.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { ItemPageAlternateTitleFieldComponent } from './simple/field-components/specific-field/alternateTitle/item-page-alternate-title-field.component';
import { ItemPageSponsorshipFieldComponent } from './simple/field-components/specific-field/sponsorship/item-page-sponsorship-field.component';
import { ItemPageDoiFieldComponent } from './simple/field-components/specific-field/doi/item-page-doi-field.component';
import { ItemPageGovdocFieldComponent } from './simple/field-components/specific-field/govdoc/item-page-govdoc-field.component';
import { ItemPageIsbnFieldComponent } from './simple/field-components/specific-field/isbn/item-page-isbn-field.component';
import { ItemPagePubMedFieldComponent } from './simple/field-components/specific-field/pubmed/item-page-pubmed-field.component';
import { ItemPageIssnFieldComponent } from './simple/field-components/specific-field/issn/item-page-issn-field.component';
import { ItemPageRightsFieldComponent } from './simple/field-components/specific-field/rights/item-page-rights-field.component';
import { ItemPageIsoFieldComponent } from './simple/field-components/specific-field/iso/item-page-iso-field.component';
import { ItemPageKeywordsFieldComponent } from './simple/field-components/specific-field/keywords/item-page-keywords-field.component';
import { ItemPageOrganizationFieldComponent } from './simple/field-components/specific-field/organization/item-page-organization-field.component';
import { ItemPageOtherFieldComponent } from './simple/field-components/specific-field/other/item-page-other-field.component';
import { ItemPageFOSRCProjectIdFieldComponent } from './simple/field-components/specific-field/fosrc-projectid/item-page-fosrc-projectid-field.component';
import { SimpleMetadataSectionComponent } from './simple/field-components/specific-field/simple-metadata-section/simple-metadata-section.component';
import { GenericSimpleMetadataSectionComponent } from './simple/field-components/specific-field/generic-simple-metadata-section/generic-simple-metadata-section.component';
import { SimpleItemPageCollectionsComponent } from './simple/field-components/specific-field/simple-item-page-collections/simple-item-page-collections.component';

import { ResultsBackButtonModule } from '../shared/results-back-button/results-back-button.module';


const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  PublicationComponent,
  UntypedItemComponent
];

const DECLARATIONS = [
  ItemPageComponent,
  ThemedItemPageComponent,
  FullItemPageComponent,
  ThemedFullItemPageComponent,
  MetadataUriValuesComponent,
  ItemPageAuthorFieldComponent,
  ItemPageAlternateTitleFieldComponent,
  ItemPageSponsorshipFieldComponent,
  ItemPageDoiFieldComponent,
  ItemPageGovdocFieldComponent,
  ItemPageIsbnFieldComponent,
  ItemPagePubMedFieldComponent,
  ItemPageIssnFieldComponent,
  ItemPageFOSRCProjectIdFieldComponent,
  ItemPageRightsFieldComponent,
  ItemPageIsoFieldComponent,
  ItemPageKeywordsFieldComponent,
  ItemPageOrganizationFieldComponent,
  ItemPageOtherFieldComponent,
  ItemPageDateFieldComponent,
  ItemPageAbstractFieldComponent,
  ItemPageUriFieldComponent,
  ItemPageTitleFieldComponent,
  ItemPageFieldComponent,
  FileSectionComponent,
  CollectionsComponent,
  FullFileSectionComponent,
  PublicationComponent,
  UntypedItemComponent,
  ItemComponent,
  UploadBitstreamComponent,
  AbstractIncrementalListComponent,
  MediaViewerComponent,
  MediaViewerVideoComponent,
  MediaViewerImageComponent,
  SimpleMetadataSectionComponent,
  GenericSimpleMetadataSectionComponent,
  SimpleItemPageCollectionsComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    ItemPageRoutingModule,
    EditItemPageModule,
    StatisticsModule.forRoot(),
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
    NgxGalleryModule,
    ResultsBackButtonModule,
  ],
  declarations: [
    ...DECLARATIONS
  ],
  exports: [
    ...DECLARATIONS
  ]
})
export class ItemPageModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during CSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: ItemPageModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }

}

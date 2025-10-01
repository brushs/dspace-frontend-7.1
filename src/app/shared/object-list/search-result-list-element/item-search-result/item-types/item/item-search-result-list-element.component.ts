
import {
  ChangeDetectorRef,
  Component, OnDestroy, Inject,
  PLATFORM_ID
} from '@angular/core';
import { listableObjectComponent } from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
import { MetadataTranslatePipe } from '../../../../../utils/metadata-translate.pipe';
import { LocaleService, supportedLanguages } from '../../../../../../core/locale/locale.service';
import { DSONameService } from '../../../../../../core/breadcrumbs/dso-name.service';
import { TruncatableService } from '../../../../../truncatable/truncatable.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {
  CustomNativeWindowService
} from '../../../../../../core/services/window.service';
import { Console } from 'console';
import { isPlatformBrowser } from '@angular/common';
import { CollectionDataService } from '../../../../../../core/data/collection-data.service';
import { Collection } from '../../../../../../core/shared/collection.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html'
})


/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements OnDestroy {

  /**
   * isCollapsed$ observable that tracks whether
   * the truncatable area has been collapsed
   */
  isCollapsed$;
  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  descriptionText: string;
  descriptionParagraphId: string  = 'description-paragraph-';
  descriptionSpanId: string = 'description-span-';
  originalObserver: MutationObserver;
  // manual declaration of ResizeObserver to avoid error (once typescript is updated to at least 4.2, this can be removed )
  // @ts-ignore
  resizeObserver: ResizeObserver;
  initialShorteningOccurred: boolean = false;
  overrideTruncation = false;
  isCollapsedBool: boolean;
  // issue 247 start
  showThumbnails: boolean = false;
  emptyThumbnails: boolean = false;
  // issue 247 end
  doi: string;
  citation: string;
  isMultimediaCollection: boolean = false;
  multimediaCitation: string = '';

  readonly MAX_NUMBER_OF_LINES: number = 3;

  constructor(
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService,
    protected localeService: LocaleService,
    private changeDetectorRef: ChangeDetectorRef,
    public translate: TranslateService,
    private router: Router,
    private customNativeWindowService: CustomNativeWindowService,
    private collectionDataService: CollectionDataService,
    @Inject(PLATFORM_ID) private platformId: any,
    ) {
    super(truncatableService, dsoNameService, localeService);
  }
  ngOnDestroy(): void {
    if (this.resizeObserver)
      this.resizeObserver.disconnect();
    // should already be disconnected, but just in case
    if (this.originalObserver)
    this.originalObserver.disconnect();
  }

  ngOnInit(): void {
    super.ngOnInit();
    // get random number either 0 or 1
    //translate this template code to component code: (['dc.description.abstract', 'dc.description.abstract-fosrctranslation'] | metaTranslate : dso)
    this.descriptionText = this.getDescriptionText();
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.isCollapsed$ = this.isCollapsed();
    this.descriptionParagraphId = this.descriptionParagraphId + this.dso.id;
    this.descriptionSpanId = this.descriptionSpanId + this.dso.id;
    this.doi = this.dso.allMetadata('dc.identifier.doi')[0]?.value;
    this.citation = this.dso.allMetadata('dc.identifier.citation')[0]?.value;

    // Fetch the owning collection and check if it's a multimedia collection
    this.collectionDataService.findOwningCollectionFor(this.dso).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((collection: Collection) => {
      this.checkMultimediaCollection(collection);
    });

    this.configureObservers();
    // issue 247 start
    if (this.context) {
      if (this.constructor.name == "ItemSearchResultListElementComponent") {
        // issue 370 start: advance search is also ItemSearchResultListElementComponent, but we have context = 'search'
        if (this.context =='search') {
          this.showThumbnails = true;
        } else {
          this.emptyThumbnails = true;
        }
        // issue 370 end
      } else {
        this.showThumbnails = true;
        //Bug fix for SSR: under SSR when search language in admin panel, the code goes this branch instead of line 100
        //Deal with it by checking if 'language' is in itemPageRoute, if yes then duplicate the case in line 100 while keep the orignal logic
        let itemPageRoute = this.itemPageRoute;
        let  fieldForCheck = ['language','publisher', 'serial', 'country','province','sponsor', 'division','corporateauthor'];
        for (let i = 0; i < fieldForCheck.length; i++) {
          if (itemPageRoute.includes(fieldForCheck[i])) {
            this.showThumbnails = false;
            this.emptyThumbnails = true;
            break;
          }
        }
      }
    } else {
      // issue 349, 360 start
      if (this.firstMetadataValue('dspace.entity.type') == 'Publication') {
        this.showThumbnails = true;
      } else {
        this.emptyThumbnails = true;
      }
      // issue 349, 360 end
    }
    // issue 247 end
  }

  configureObservers() {
    if (isPlatformBrowser(this.platformId)) {

      // manual declaration of ResizeObserver to avoid error (once typescript is updated to at least 4.2, this can be removed )
      // @ts-ignore
      this.resizeObserver = new ResizeObserver(_ => {
          if (this.isCollapsedBool){
            this.shortenDescriptionText();
          }
      });
      // original observer observes the entire document
      // due to how the truncatable component works, the description text is not rendered even after ngOnAfterViewInit
      // original observer will only observe the document until the description text is rendered
      // then it will disconnect and the resize observer will take over
      this.originalObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {

            const element = this.customNativeWindowService.nativeDocument.getElementById(this.descriptionParagraphId);
            if (element && !this.initialShorteningOccurred) {
              this.initialShorteningOccurred = true;
              this.shortenDescriptionText();
              // disconnect original observer
              this.originalObserver.disconnect();

              this.resizeObserver.observe(element);
            }
          }
        });

      });

      // Start observing the entire body or some specific element
      this.originalObserver.observe(this.customNativeWindowService.nativeDocument.body, { childList: true, subtree: true });

      this.isCollapsed().subscribe({
        next: (collapsed: boolean) => {
          this.isCollapsedBool = collapsed;
          if (collapsed)
          {
            this.shortenDescriptionText();
          }
          else {
            this.expandText();
          }
        }
      });
    }
  }

  translateMetadata(keys: string | string[], dso: any) {
    const pipe = new MetadataTranslatePipe(this.dsoNameService, this.localeService);
    return pipe.transform(keys, dso);
  }

  getTranslatedValue(dso: any): any {
    return this.translateMetadata(['dc.description.abstract', 'dc.description.abstract-fosrctranslation'], dso)[0];
  }

  getDescLanguageAttribute(payload: any): string | undefined {
    const translatedDesc = this.getTranslatedValue(payload);
    const language = translatedDesc?.language;
    return this.getLanguageAttribute(language);
  }

  getLanguageAttribute(language: any): string | undefined {
    return supportedLanguages.includes(language?.toLowerCase()) ? language : undefined;
  }

  shortenDescriptionText(): void {
    // NRC Requirement. Do not want text to be truncated in the middle of a word or if there is a trailing comma
    const textElement = this.customNativeWindowService.nativeDocument.getElementById(this.descriptionSpanId);

    //Called before textElement rendered?
    if (!textElement || this.descriptionText == null) {
      return;
    }

    //TODO: update this to translated metadata
    let originalText = this.descriptionText;
    let words = originalText.split(' ');

    let fittedText = '';
    let lineHeight = 0;
    for (let i = 0; i < words.length; i++) {
      // updated the actual element to see if it's height is greater than the max height
      textElement.innerHTML = fittedText + words[i] + ' ';
      // get line height
      if (i == 0)
        lineHeight = textElement.offsetHeight;
      if (textElement.offsetHeight >= (this.MAX_NUMBER_OF_LINES + 1) * lineHeight) {
        let lastWord = fittedText.trim().split(" ").pop();
        fittedText = fittedText.substring(0, fittedText.lastIndexOf(lastWord)).trim();

        // Ensure the last character isn't a comma before appending the ellipsis
        while (fittedText.trim().endsWith(',')) {
          let lastWord = fittedText.trim().split(" ").pop();
          if (!lastWord) break;  // Safety check in case fittedText becomes empty
          fittedText = fittedText.substring(0, fittedText.lastIndexOf(lastWord)).trim();
        }

        fittedText += '...';
        textElement.innerHTML = fittedText;
        this.overrideTruncation = true;
        // force rerender (detectChanges())
        this.changeDetectorRef.detectChanges();


        return;
      }
      fittedText += words[i] + ' ';
    }
    // if we are here, then the text was not truncated
    this.overrideTruncation = false;
  }

  expandText(): void {
    const textElement = this.customNativeWindowService.nativeDocument.getElementById(this.descriptionSpanId);
    if (textElement && this.descriptionText != null)
      textElement.innerHTML = this.descriptionText;
  }

  storeSearchBreadCrumbUrlPath(event: MouseEvent){
    if(event.button === 0 || event.button === 1){
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem("previousSearchPageUrlPath", this.router.url);
      }
    }
  }

  getDescriptionText(): string {
    // check if the description exists
    if(this.firstMetadataValue('dc.description') != null && this.firstMetadataValue('dc.description') != "") {
      return this.translateMetadata(['dc.description'], this.dso)[0]?.value;
      //return this.firstMetadataValue('dc.description');
    }
    else if(this.firstMetadataValue('dc.description.abstract') != null && this.firstMetadataValue('dc.description.abstract') != "") {
      return this.translateMetadata(['dc.description.abstract'], this.dso)[0]?.value;
      //return this.firstMetadataValue('dc.description.abstract');
    }
    return ""
  }
//284394 for sandbox and prod, 272057 for local
  checkMultimediaCollection(collection?: Collection): void {
    // Check if this item belongs to the "Multimedia" collection
    if (collection) {
      // Use the actual collection object
      const collectionName = collection.name;
      if (collectionName?.toLowerCase().includes('multim')) { //catch both multimedia and multimédia
        this.isMultimediaCollection = true;
        this.generateMultimediaCitation();
      }
    } else {
      console.warn('Owning collection not found for item:', this.dso.id);
    }
  }

  generateMultimediaCitation(): void {
    // Generate citation in format: Author, I. (Date). Photonumber.
    const author = this.firstMetadataValue('dc.contributor.author');
    const date = this.firstMetadataValue('dc.date.issued');
    const photoNumber = this.firstMetadataValue('dc.identifier.photonumber');

    let citation = '';

    if (author) {
      citation += author;
    }

    if (date) {
      if (citation) citation += ' ';
      const year = date.substring(0, 4); // Extract only the year (YYYY) as requested
      citation += `(${year}).`;
    }

    if (photoNumber) {
      if (citation) citation += ' ';
      citation += photoNumber + '.';
    }

    this.multimediaCitation = citation;
  }

}

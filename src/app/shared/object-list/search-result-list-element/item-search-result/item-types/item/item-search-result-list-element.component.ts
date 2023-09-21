  import { 
    ChangeDetectorRef,
    Component, OnDestroy, Renderer2, ViewChild
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
    resizeObserver: ResizeObserver;
    initialShorteningOccurred: boolean = false;
    overrideTruncation = false;
    isCollapsedBool: boolean;

    readonly MAX_NUMBER_OF_LINES: number = 3;

    constructor(protected truncatableService: TruncatableService, protected dsoNameService: DSONameService, protected localeService: LocaleService, private changeDetectorRef: ChangeDetectorRef ) {
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
      this.descriptionText = this.translateMetadata(['dc.description.abstract', 'dc.description.abstract-fosrctranslation'], this.dso)[0]?.value;
      this.itemPageRoute = getItemPageRoute(this.dso);
      this.isCollapsed$ = this.isCollapsed();
      this.descriptionParagraphId = this.descriptionParagraphId + this.dso.id;
      this.descriptionSpanId = this.descriptionSpanId + this.dso.id;
      this.configureObservers();
    }

    configureObservers() {
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
            
            const element = document.getElementById(this.descriptionParagraphId);
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
      this.originalObserver.observe(document.body, { childList: true, subtree: true });
      
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
      const textElement = document.getElementById(this.descriptionSpanId);
      //Called before textElement rendered?
      if (!textElement)
        return;
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
      const textElement = document.getElementById(this.descriptionSpanId);
      if (textElement)
        textElement.innerHTML = this.descriptionText;
    }


    
  }
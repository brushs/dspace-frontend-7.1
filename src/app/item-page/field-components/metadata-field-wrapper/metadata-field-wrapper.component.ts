import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

/**
 * This component renders any content inside this wrapper.
 * The wrapper prints a label before the content (if available)
 */
@Component({
  selector: 'ds-metadata-field-wrapper',
  styleUrls: ['./metadata-field-wrapper.component.scss'],
  templateUrl: './metadata-field-wrapper.component.html'
})
export class MetadataFieldWrapperComponent {

  /**
   * The label (title) for the content
   */
  @Input() label: string;

  @Input() subheading: boolean;

  @Input() hideIfNoTextContent = true;

  @Input() useGcWeb = false;
  
  // Dynamic projected content checker 
  @ViewChild('GcContent', {static: false}) GcContentRef: ElementRef;

  noContent = false;
  observer;

  constructor(private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if(this.GcContentRef?.nativeElement) {
        this.observer = new (window as any).MutationObserver(() => {
          this.checkForContent()
        })
      this.observer.observe(this.GcContentRef.nativeElement, {childList: true });
    }
  }

  checkForContent() {
    this.noContent = (this.GcContentRef.nativeElement.textContent.trim().length === 0 && this.GcContentRef.nativeElement.innerText.trim().length === 0);
    this.cdr.detectChanges()
  }

  ngOnDestroy() {
    if(this.observer) {
      this.observer.disconnect();
    }
  }
}

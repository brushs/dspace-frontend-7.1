import { Component, Input, SimpleChanges } from '@angular/core';

/**
 * This component renders any content inside this wrapper.
 * The wrapper prints a label before the content (if available)
 */
@Component({
  selector: 'ds-metadata-field-wrapper-dl',
  styleUrls: ['./metadata-field-wrapper-description-list.component.scss'],
  templateUrl: './metadata-field-wrapper-description-list.component.html'
})
export class MetadataFieldWrapperDlComponent {

  /**
   * The label (title) for the content
   */
  @Input() label: string;

  @Input() subheading: boolean;

  @Input() hideIfNoTextContent = true;

  ngOnInit(): void {
  }
}

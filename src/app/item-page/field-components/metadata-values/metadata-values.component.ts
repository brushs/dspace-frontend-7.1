import { Component, Input } from '@angular/core';
import { LocaleService } from '../../../core/locale/locale.service';
import { MetadataValue } from '../../../core/shared/metadata.models';


/**
 * This component renders the configured 'values' into the ds-metadata-field-wrapper component.
 * It puts the given 'separator' between each two values.
 */
@Component({
  selector: 'ds-metadata-values',
  styleUrls: ['./metadata-values.component.scss'],
  templateUrl: './metadata-values.component.html'
})
export class MetadataValuesComponent {

  /**
   * The metadata values to display
   */
  @Input() mdValues: MetadataValue[];

  /**
   * The seperator used to split the metadata values (can contain HTML)
   */
  @Input() separator: string;

  /**
   * The label for this iteration of metadata values
   */
  @Input() label: string;

  @Input() subheading: boolean;

  @Input() filterLang: boolean = false;

  /**
   * Whether or not the component is rendered inside a description list
   */
  @Input() isDescriptionList: boolean;

  constructor(
    public localeService: LocaleService
  ) { }

  ngOnInit(): void {
    if(this.filterLang) {
      this.mdValues = this.mdValues.filter(mdValue => mdValue.language === this.localeService.getCurrentLanguageCode());
    }
  }

}

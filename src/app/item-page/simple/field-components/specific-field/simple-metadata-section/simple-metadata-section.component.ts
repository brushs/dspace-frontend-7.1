import { Component, Input, OnInit } from '@angular/core';
import { LocaleService } from 'src/app/core/locale/locale.service';
import { MetadataValue } from 'src/app/core/shared/metadata.models';


@Component({
  selector: 'ds-simple-metadata-section',
  templateUrl: './simple-metadata-section.component.html',
  styleUrls: ['./simple-metadata-section.component.scss']
})
export class SimpleMetadataSectionComponent implements OnInit {

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

  @Input() filterLang: boolean = false

  @Input() isDescriptionList: boolean = false;

  constructor(
    public localeService: LocaleService,
  ) { }

  ngOnInit(): void {
    if(this.filterLang) {
      this.mdValues = this.mdValues.filter(mdValue => mdValue.language === this.localeService.getCurrentLanguageCode());
    }
  }

}

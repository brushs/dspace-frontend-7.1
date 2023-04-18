import { hasValue, isEmpty, isNotEmpty, isNotNull } from '../../../empty.util';
import { ConfidenceType } from '../../../../core/shared/confidence-type';
import { MetadataValueInterface, VIRTUAL_METADATA_PREFIX } from '../../../../core/shared/metadata.models';
import { PLACEHOLDER_PARENT_METADATA } from '../ds-dynamic-form-ui/ds-dynamic-form-constants';
import { AppInjector } from '../../../../app.injector';
import { TranslateService } from '@ngx-translate/core';

export interface OtherInformation {
  [name: string]: string;
}

/**
 * A class representing a specific input-form field's value
 */
export class FormFieldMetadataValueObject implements MetadataValueInterface {
  metadata?: string;
  value: any;
  display: string;
  language: any;
  authority: string;
  confidence: ConfidenceType;
  place: number;
  label: string;
  otherInformation: OtherInformation;
  //private translationService; //FOSRC inject this into this file to translate keys

  constructor(value: any = null,
              language: any = null,
              authority: string = null,
              display: string = null,
              place: number = 0,
              confidence: number = null,
              otherInformation: any = null,
    metadata: string = null, private translationService: TranslateService = null) {
    // FOSRC console loging to be removed
    if (isNotNull(value) && typeof value === 'string') {
      console.log("FormFieldMetadataValueObject: StringValue: %s display: %s metadata: %s", value, display, metadata);
    } else if (isNotNull(value)) {
      console.log("FormFieldMetadataValueObject: ObjectValue:", value);
    }
    //FOSRC inject this into this file to translate keys
    this.value = isNotNull(value) ? ((typeof value === 'string') ? value.trim() : value) : null;
    //this.translationService = AppInjector.get(TranslateService);
    //this.value = isNotNull(value) ? ((typeof value === 'string') ? ((value.startsWith("fosrc.item.edit.dynamic-field.values.")) ? this.translationService.instant(value.trim()) : value)  : value) : null;
    this.language = language;
    this.authority = authority;
    //FOSRC get translation for display this.display = display || value;
    this.display = display || value;
    //this.display = isNotNull(display) ? ((display.startsWith("fosrc.item.edit.dynamic-field.values.")) ? this.translationService.instant(display) : display) : value;

    this.confidence = confidence;
    if (authority != null && (isEmpty(confidence) || confidence === -1)) {
      this.confidence = ConfidenceType.CF_ACCEPTED;
    } else if (isNotEmpty(confidence)) {
      this.confidence = confidence;
    } else {
      this.confidence = ConfidenceType.CF_UNSET;
    }

    this.place = place;
    if (isNotEmpty(metadata)) {
      this.metadata = metadata;
    }

    this.otherInformation = otherInformation;
    // FOSRC console loggin to be removed 
    console.log("FormFieldMetadataValueObject: Everything: ", this);
  }

  /**
   * Returns true if this this object has an authority value
   */
  hasAuthority(): boolean {
    return isNotEmpty(this.authority);
  }

  /**
   * Returns true if this this object has a value
   */
  hasValue(): boolean {
    return isNotEmpty(this.value);
  }

  /**
   * Returns true if this this object has otherInformation property with value
   */
  hasOtherInformation(): boolean {
    return isNotEmpty(this.otherInformation);
  }

  /**
   * Returns true if this object value contains a placeholder
   */
  hasPlaceholder() {
    return this.hasValue() && this.value === PLACEHOLDER_PARENT_METADATA;
  }

  /**
   * Returns true if this Metadatum's authority key starts with 'virtual::'
   */
  get isVirtual(): boolean {
    return hasValue(this.authority) && this.authority.startsWith(VIRTUAL_METADATA_PREFIX);
  }

  /**
   * If this is a virtual Metadatum, it returns everything in the authority key after 'virtual::'.
   * Returns undefined otherwise.
   */
  get virtualValue(): string {
    if (this.isVirtual) {
      return this.authority.substring(this.authority.indexOf(VIRTUAL_METADATA_PREFIX) + VIRTUAL_METADATA_PREFIX.length);
    } else {
      return undefined;
    }
  }

  toString() {
    const display = isNotNull(this.display) ? ((this.display.startsWith("fosrc.item.edit.dynamic-field.values.")) ? this.translationService.instant(this.display) : this.display) : this.value;
    return display;
    //return this.display || this.value;
  }
}

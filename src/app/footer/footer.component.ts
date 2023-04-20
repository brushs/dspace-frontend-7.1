import { Component, Optional } from '@angular/core';
import { hasValue } from '../shared/empty.util';
import { KlaroService } from '../shared/cookies/klaro.service';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html'
})
export class FooterComponent {
  dateObj: number = Date.now();

  /**
   * A boolean representing if to show or not the top footer container
   */
  showTopFooter = false;

  constructor(@Optional() private cookies: KlaroService) {
  }

  showCookieSettings() {
    /* Start FOSRC Changes - 1620 
    // disable any chance for cookie setting pop up
    if (hasValue(this.cookies)) {
      this.cookies.showSettings();
    }
    return false;
    End of FOSRC changes */
  }
}

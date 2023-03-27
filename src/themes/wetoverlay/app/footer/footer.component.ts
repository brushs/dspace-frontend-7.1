import { AfterViewInit, Component } from '@angular/core';
import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss', '../../styles/wet-theme.scss'],
  //styleUrls: ['../../../../app/footer/footer.component.scss'],
  templateUrl: 'footer.component.html'
  //templateUrl: '../../../../app/footer/footer.component.html'
})
export class FooterComponent extends BaseComponent {

  ngAfterViewInit(): void {
    // import('../../assets/scripts/jquery.magnific-popup.min.js');
    //  import('../../assets/scripts/wet-boew.min.js');
    //  import('../../assets/scripts/theme.min.js');
  }
}
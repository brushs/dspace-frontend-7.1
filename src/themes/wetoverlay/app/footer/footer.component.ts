import { AfterViewInit, Component } from '@angular/core';
import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { AppInjector } from '../../../../app/app.injector';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  //styleUrls: ['../../../../app/footer/footer.component.scss'],
  templateUrl: 'footer.component.html'
  //templateUrl: '../../../../app/footer/footer.component.html'
})
export class FooterComponent extends BaseComponent {
  translate: TranslateService
  ngOnInit() {
    this.translate = AppInjector.get(TranslateService);
  }
}
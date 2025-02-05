import { AfterViewInit, Component } from '@angular/core';
import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { RouteService } from '../../../../app/core/services/route.service';
// import { AppInjector } from '../../../../app/app.injector';
// import { KlaroService } from '../../../../app/shared/cookies/klaro.service';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  //styleUrls: ['../../../../app/footer/footer.component.scss'],
  templateUrl: 'footer.component.html'
  //templateUrl: '../../../../app/footer/footer.component.html'
})
export class FooterComponent extends BaseComponent {
  // translate: TranslateService

  constructor(
    public translate: TranslateService, 
    public routeService: RouteService){
    super();
  }
  ngOnInit() {
    // this.translate = AppInjector.get(TranslateService);
  }
}
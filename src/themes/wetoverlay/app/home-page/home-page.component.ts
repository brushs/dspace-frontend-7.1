import { Component } from '@angular/core';
import { HomePageComponent as BaseComponent } from '../../../../app/home-page/home-page.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ds-home-page',
  // styleUrls: ['./home-page.component.scss'],
   styleUrls: ['../../../../themes/wetoverlay/styles/static-pages.scss'],
  // templateUrl: './home-page.component.html'
   templateUrl: '../../../../app/home-page/home-page.component.html'
})
export class HomePageComponent extends BaseComponent {

}

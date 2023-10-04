import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleService } from '../core/locale/locale.service';
// import { LocaleService } from '../../themes/wetoverlay/assets/gcweb/css/theme.css';

@Component({
  selector: 'ds-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: [
    // './welcome-page.component.scss'
    '../../themes/wetoverlay/assets/wet-boew/css/noscript.css',
    '../../themes/wetoverlay/assets/gcweb/css/messages.css',
    '../../themes/wetoverlay/assets/gcweb/css/theme.css'
    
  ]
})
export class WelcomePageComponent implements OnInit {

  imageNumber: number;

  constructor(private localeService: LocaleService,
    private router: Router
    ) { }

  ngOnInit(): void {
    //12 images are used as background images
    this.imageNumber = Math.floor(Math.random() * (12)) + 1;
  }

  onClickButton(lang: string): void {
      this.localeService.setCurrentLanguageCode(lang);
      this.localeService.refreshAfterChangeLanguage();
      this.router.navigate(['/home'])
  }
}

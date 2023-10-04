import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleService } from '../core/locale/locale.service';

@Component({
  selector: 'ds-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['../../themes/wetoverlay/assets/gcweb/css/theme.scss', '../../themes/wetoverlay/assets/wet-boew/css/noscript.scss', '../../themes/wetoverlay/assets/gcweb/css/messages.scss']
})
export class WelcomePageComponent implements OnInit {

  constructor(private localeService: LocaleService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  onClickButton(lang: string): void {
      this.localeService.setCurrentLanguageCode(lang);
      this.localeService.refreshAfterChangeLanguage();
      this.router.navigate(['/home'])
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleService } from '../core/locale/locale.service';

@Component({
  selector: 'ds-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
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

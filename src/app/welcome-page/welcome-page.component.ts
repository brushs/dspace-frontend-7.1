import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleService } from '../core/locale/locale.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'ds-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: [
    './welcome-page.component.scss',
    // '../../themes/wetoverlay/assets/wet-boew/css/noscript.css',
    // '../../themes/wetoverlay/assets/gcweb/css/messages.css',
    // '../../themes/wetoverlay/assets/gcweb/css/theme.css'
    
  ]
})
export class WelcomePageComponent implements OnInit {

  /**
   * Array of scripts to load to allow the background
   * images to load randomly
   */
  scriptsToLoad: Array<string> = [
    "assets/wet-boew/js/jquery/2.2.4/jquery.min.js",
    "assets/wet-boew/js/wet-boew.min.js",
    "assets/gcweb/js/theme.min.js",
    "assets/wet-boew/js/i18n/en.min.js"
  ];

  /**
   * Count of the number of scripts loaded
   */
  scriptsLoadedCount: number = 0

  constructor(private localeService: LocaleService,
    private router: Router,
    private renderer2: Renderer2, 
    @Inject(DOCUMENT) private document: Document,
    ) { }

  ngOnInit(): void {

    //start loading the scripts sequentially
    this.loadNextScript();

  }

  onClickButton(lang: string): void {
      this.localeService.setCurrentLanguageCode(lang);
      this.localeService.refreshAfterChangeLanguage();
      this.router.navigate(['/home'])
  }

  /**
   * Method that loads each script sequentially
   * @returns void
   */
  loadNextScript() {
    if (this.scriptsLoadedCount >= this.scriptsToLoad.length) {
      console.log('All scripts loaded.');
      return;
    }

    const scriptPromise = new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.onload = resolve;
      script.onerror = reject;
      script.async = true;
      script.src = this.scriptsToLoad[this.scriptsLoadedCount];
      if(this.scriptsToLoad[this.scriptsLoadedCount] === "assets/wet-boew/js/jquery/2.2.4/jquery.min.js"){
        script.integrity = "sha384-rY/jv8mMhqDabXSo+UCggqKtdmBfd3qC2/KvyTDNQ6PcUJXaxK1tMepoQda4g5vB";
        script.crossOrigin = "anonymous";
      };
      this.renderer2.appendChild(this.document.body, script);
    });

    scriptPromise.then(() => {
        console.log(this.scriptsToLoad[this.scriptsLoadedCount], 'loaded');
        this.scriptsLoadedCount++;
        this.loadNextScript();
        
      })
      .catch((error) => {
        console.error(this.scriptsToLoad[this.scriptsLoadedCount], 'failed', error);
          this.scriptsLoadedCount++;
      })

  }

}

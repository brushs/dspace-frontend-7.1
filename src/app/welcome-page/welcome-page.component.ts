import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LocaleService } from '../core/locale/locale.service';
import { DOCUMENT } from '@angular/common';
import { filter} from 'rxjs/operators';

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
  scriptsLoadedCount: number = 0;

  /**
   * Requested URL
   */
  requestedUrl: string;

  constructor(private localeService: LocaleService,
    private router: Router,
    private renderer2: Renderer2, 
    @Inject(DOCUMENT) private document: any,
    ) { }

  ngOnInit(): void {

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.requestedUrl = event.url;
    });

    //load the links
    this.loadLinks();

    //start loading the scripts sequentially
    this.loadNextScript();

  }

  onClickButton(lang: string): void {
      this.localeService.setCurrentLanguageCode(lang);
      this.localeService.refreshAfterChangeLanguage();

      //navigating to /home from the welcome page does not work
      // this.router.navigate(['/home'])
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

  loadLinks(){
    const link1 = this.renderer2.createElement('link');
    link1.rel = "apple-touch-icon";
    link1.sizes = "57x57 72x72 114x114 144x144 150x150";
    link1.class = "wb-favicon";
    link1.href = "assets/gcweb/assets/favicon-mobile.png";
    this.renderer2.appendChild(this.document.head, link1);
      
    const link2 = this.renderer2.createElement('link');
    link2.rel = "icon";
    link2.type = "image/x-icon";
    link2.class = "wb-init wb-favicon-inited";
    link2.href = "assets/gcweb/assets/favicon.ico";
    this.renderer2.appendChild(this.document.head, link2);

    const link3 = this.renderer2.createElement('link');
    link3.rel = "stylesheet";
    link3.href = "assets/gcweb/css/theme.min.css";
    this.renderer2.appendChild(this.document.head, link3);

    const link4 = this.renderer2.createElement('link');
    link4.rel = "stylesheet";
    link4.href = "assets/gcweb/css/messages.min.css";
    this.renderer2.appendChild(this.document.head, link4);

    const noScript = this.renderer2.createElement('noscript');
    const link5 = this.renderer2.createElement('link');
    link5.rel = "stylesheet";
    link5.href = "assets/wet-boew/css/noscript.min.css";
    this.renderer2.appendChild(this.document.head, noScript);
    this.renderer2.appendChild(noScript, link5);

    console.log('All links loaded.');

  }

}

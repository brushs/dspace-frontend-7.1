import { Component, Injectable, Input } from '@angular/core';

/**
 * This component builds a URL from the value of "handle"
 */

@Component({
  selector: 'ds-comcol-page-handle',
  styleUrls: ['./comcol-page-handle.component.scss'],
  templateUrl: './comcol-page-handle.component.html'
})

@Injectable()
export class ComcolPageHandleComponent {

  // Optional title
  @Input() title: string;

  // The value of "handle"
  @Input() content: string;

  // Whether the title should be displayed as a heading or a paragraph
  @Input() useHeading: boolean = true;

  public getHandle(): string {
    //FOSRC made this function domain aware to fix #1820
    const domainList = ['dev.ospr.link', 'ospr.link', 'localhost', 'open-science.canada.ca', 'science-ouverte.canada.ca', 'ospr.g.ent.cloud-nauge.canada.ca']
    const rawValue = this.content;
    if (!domainList.some((x: string) => rawValue.includes(x))) {
      return rawValue;
    }
    //console.log("outside domainAware if statement: " + rawValue)
    try {
      const urlObj = new URL(rawValue);
      const currentHostname = location.hostname;
      return rawValue.replace(urlObj.hostname, currentHostname);
    } catch (Error) {
      return rawValue;
    }
    //return this.content;
  }

}

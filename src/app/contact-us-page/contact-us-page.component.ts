import { Component } from '@angular/core';
/**
 * This component represents the contact us page
 */
@Component({
  selector: 'ds-contact-us-page',
  styleUrls: ['./contact-us-page.component.scss'],
  templateUrl: './contact-us-page.component.html'
})
export class ContactUsPageComponent {

  links: Array<{label: string, email: string}> = [
    {label: 'agriculture', email: 'FOSRC-DFSOC@nrc-cnrc.gc.ca'},
    {label: 'food-inspection', email: 'cfia.sciencecollaboration-collaborationscientifiques.acia@inspection.gc.ca'},
    {label: 'space', email: 'FOSRC-DFSOC@nrc-cnrc.gc.ca'},
    {label: 'environment', email: 'bibliotheque.library@ec.gc.ca'},
    {label: 'fisheries', email: 'DFO.Library-Bibliotheque.MPO@dfo-mpo.gc.ca '},
    {label: 'health', email: 'spimsadministrator.aministrateursgpsi@hc-sc.gc.ca'},
    {label: 'public-health', email: 'FOSRC-DFSOC@nrc-cnrc.gc.ca'},
    {label: 'transport', email: 'TC.InnovationCentre-Centredinnovation.TC@tc.gc.ca'},
  ];

}

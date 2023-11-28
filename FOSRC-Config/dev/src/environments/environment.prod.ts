

export const environment = {
  production: true,
  ui: {
    ssl: true,
    host: 'dev-ospr.g.ent.cloud-nuage.canada.ca', //'0.0.0.0', //'10.153.200.0', //'ospr.g.ent.cloud-nuage.canada.ca',//'10.153.200.0', //'localhost',
    port: 4000,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/',
    // The rateLimiter settings limit each IP to a "max" of 500 requests per "windowMs" (1 minute).
    rateLimiter: {
      windowMs: 1 * 60 * 1000,   // 1 minute
      max: 500 // limit each IP to 500 requests per windowMs
    }
  },
  rest: {
	  ssl: true,	 
	  host: 'dev-ospr.g.ent.cloud-nuage.canada.ca', 
	  port: 443,
	  nameSpace: '/server',
  },
  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
  },
  themes: [{
	name: 'wetoverlay'
  }],
   mediaViewer: {
	 image: false,
	video: false,
   }
};

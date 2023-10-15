export const environment = {
	"production": false,
	"ui": {
		"ssl": false,
		"host": "localhost",
		"port": 4000,
		"nameSpace": "/",
		"rateLimiter": {
			"windowMs": 60000,
			"max": 500
		},
		"baseUrl": "http://localhost:4000/"
	},
	"rest": {
		"ssl": false,
		"host": "localhost",
		"port": 8080,
		// NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
		"nameSpace": "/server",
    "baseUrl": "http://localhost:8080/server",
	},
	"cache": {
		"msToLive": {
			"default": 900000
		},
		"control": "max-age=60",
		"autoSync": {
			"defaultTime": 0,
			"maxBufferSize": 100,
			"timePerMethod": {
				"PATCH": 3
			}
		}
	},
	"auth": {
		"ui": {
			"timeUntilIdle": 900000,
			"idleGracePeriod": 300000
		},
		"rest": {
			"timeLeftBeforeTokenRefresh": 120000
		},
		"login": {
			"enablePassword": true
		}
	},
	"form": {
		"validatorMap": {
			"required": "required",
			"regex": "pattern"
		}
	},
	"notifications": {
		"rtl": false,
		"position": [
			"top",
			"right"
		],
		"maxStack": 8,
		"timeOut": 5000,
		"clickToClose": true,
		"animate": "scale"
	},
	"submission": {
		"autosave": {
			"metadata": [],
			"timer": 0
		},
		"icons": {
			"metadata": [
				{
					"name": "dc.author",
					"style": "fas fa-user"
				},
				{
					"name": "default",
					"style": ""
				}
			],
			"authority": {
				"confidence": [
					{
						"value": 600,
						"style": "text-success"
					},
					{
						"value": 500,
						"style": "text-info"
					},
					{
						"value": 400,
						"style": "text-warning"
					},
					{
						"value": "default",
						"style": "text-muted"
					}
				]
			}
		}
	},
	"universal": {
		"preboot": true,
		"async": true,
		"time": false
	},
	"debug": false,
	"defaultLanguage": "en",
	"languages": [
		{
			"code": "en",
			"label": "English",
			"active": true
		},
		{
			"code": "fr",
			"label": "Français",
			"active": true
		}
	],
	"browseBy": {
		"oneYearLimit": 10,
		"fiveYearLimit": 30,
		"defaultLowerLimit": 1900,
		"types": [
			{
				"id": "title",
				"type": "title"
			},
			{
				"id": "dateissued",
				"type": "date",
				"metadataField": "dc.date.issued"
			},
			{
				"id": "author",
				"type": "metadata"
			},
			{
				"id": "subject",
				"type": "metadata"
			}
		]
	},
	"item": {
		"edit": {
			"undoTimeout": 10000
		}
	},
	"collection": {
		"edit": {
			"undoTimeout": 10000
		}
	},
	"themes": [
		{
			"name": "wetoverlay"
		}
	],
	"mediaViewer": {
		"image": false,
		"video": false
	}
}

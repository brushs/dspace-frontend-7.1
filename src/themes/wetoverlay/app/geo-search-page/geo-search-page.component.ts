import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';



//For geometry from data
const myStyle = {
  color: 'green',
  weight: 5,
  opacity: 0.65,
};


@Component({
  selector: 'geo-search-page',
  templateUrl: './geo-search-page.component.html',
  styleUrls: ['./geo-search-page.component.scss']
})
export class GeoSearchPageComponent implements OnInit {

  L: any;
  name = 'Dspace';
  home  = 'Home';
  map: any;
  lat: number = 59; //45.4215;
  lon: number = -105; //-75.6972;
  maker: any;
  dbmaker: any[];

  markers: any[];
  drawnItems: any;

  datachild: any;
  isAddFieldTask: boolean;
  isSave: boolean;
  data: any;
  lat1: any;
  lng1: any;
  lat2: any;
  lng2: any;
  @Input() geodata: any;
  @Output() geoChangeEvent = new EventEmitter<string>();

// leaflet injection is done after the browser is initialized bsed on modified solution published by Fiehra
// https://stackoverflow.com/questions/78538054/angular-17-ssr-and-leaflet-ngx-leaflet-ngx-leaflet-draw
  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { 
  }

  ngOnInit(): void {
    if (this._platformId === 'browser') {
        this.L = import('leaflet');
        this.loadLeaflet().then(leafletLib => {
          this.createMap(leafletLib);
        })
      }
  }

  private async loadLeaflet() {
    this.L = await this.L;
    await import('leaflet-draw');
    return this.L;
  }

  private createMap(lib: any): void {
    
    const markerIcon = lib.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        // specify the path here
        iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    });
    lib.Marker.prototype.options.icon = markerIcon;
    this.map = lib.map('map').setView([this.lat, this.lon], 4);
    this.data = 'Please draw a rectangle, using solid square icon';
    const baselayers = {
      openstreetmap: lib.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ),
      googleStreets: lib.tileLayer(
        'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      ),
      googleHybrid: lib.tileLayer(
        'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      ),
      googleSat: lib.tileLayer(
        'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      ),
    };

    var overlays = {};

    lib.control.layers(baselayers, overlays).addTo(this.map);

    //baselayers['openstreetmap'].addTo(this.map);
    baselayers['googleStreets'].addTo(this.map);

        this.drawnItems = new lib.FeatureGroup();

    this.map.addLayer(this.drawnItems);

    const options = {
      position: 'topright',
      draw: {
        circle: false,
        circlemarker: false, // Turns off this drawing tool
        polygon: false,
        //marker: {
        //  icon: markerIcon,
        //},
        marker: false,
        polyline: false,
      },
      edit: {
        featureGroup: this.drawnItems, //REQUIRED!!
        // remove: false
      },
    };

    const drawControl = new lib.Control.Draw(options);
    this.map.addControl(drawControl);

    var app = this;
    this.map.on('draw:created', function (e) {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'marker') {
        layer.bindPopup('A popup!');
        console.log(layer.getLatLng());
      } else if (type == 'rectangle') {
        var latLng = layer.getLatLngs()[0];
        app.updateData(latLng);
      } else {
        console.log('type, lan/long:' + type + ',' + layer.getLatLngs());
      }
      app.drawnItems.addLayer(layer);
      console.log("draw");
    });

    this.map.on('draw:deleted', function (e) {
      app.lat1 = '';
      app.lng1 = '';
      app.lat2 = '';
      app.lng2 = '';
      app.geodata = '';
      console.log("geo data deleted");
    });

    setTimeout(
        function () { this.map.invalidateSize(); console.log("resize"); }.bind({ map: this.map }),
        200);

  }

  private updateData(value: any) {
    if (value instanceof Array) {
      var lb = value[0];
      var tr = value[2];
      //console.log(lb, tr);
    }
    //this.data = lb + ' to: ' + tr;
    this.lat1 = lb.lat.toFixed(5);
    this.lng1 = lb.lng.toFixed(5);
    this.lat2 = tr.lat.toFixed(5);
    this.lng2 = tr.lng.toFixed(5);
    this.geodata = this.lat1 + ',' + this.lng1 + ',' + this.lat2 + ',' + this.lng2;
    this.cdr.detectChanges();
    //this.geoChangeEvent.emit(this.geodata);
    this.geoChangeEvent.emit("geoChanged");
  }

  onShow() {
    console.log("test clicked");
  }

  getGeoData() {
    return this.geodata;
  }
}
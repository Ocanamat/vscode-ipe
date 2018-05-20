import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() geojson: string;
  @ViewChild('map') mapChild: ElementRef;

  constructor() {}
  ngOnInit(){
    const map = new google.maps.Map(this.mapChild.nativeElement as HTMLElement);
    // // NOTE: This uses cross-domain XHR, and may not work on older browsers.
    map.data.addGeoJson(this.geojson);
    this.zoom(map);
  }

  private zoom(map) {
    const bounds = new google.maps.LatLngBounds();
    map.data.forEach((feature) =>
      this.processPoints(feature.getGeometry(), bounds.extend, bounds)
    );
    map.fitBounds(bounds);
  }

  private processPoints(geometry, callback, thisArg) {
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else {
      geometry.getArray().forEach(function(g) {
        this.processPoints(g, callback, thisArg);
      });
    }
  }
}

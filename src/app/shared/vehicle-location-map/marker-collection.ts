import { VehicleLocation } from '../../core/vehicle-locations/vehicle-location';

declare var google: any;

export class MarkerCollection {
  private hash = {};

  constructor(private map: any) {}

  merge(loc: VehicleLocation, show: boolean): void {
    if (this.markerExists(loc)) {
      this.moveMarker(loc, show);
    } else {
      this.addMarker(loc, show);
    }
    this.removeFromOtherRoutes(loc);
  }

  hide(route: string) {
    this.setMapOnMarkers(route, null);
  }

  show(route: string) {
    this.setMapOnMarkers(route, this.map);
  }

  private addMarker(loc: VehicleLocation, show: boolean): void {
    this.hash[loc.routeTag] = this.hash[loc.routeTag] || {};
    this.hash[loc.routeTag][loc.id] = new google.maps.Marker({
      position: new google.maps.LatLng(loc.lat, loc.lon),
      map: show ? this.map : null,
      title: loc.id,
      animation: google.maps.Animation.DROP
    });
  }

  private markerExists(loc: VehicleLocation): boolean {
    return this.hash[loc.routeTag] && this.hash[loc.routeTag][loc.id];
  }

  private moveMarker(loc: VehicleLocation, show: boolean): void {
    const marker = this.hash[loc.routeTag][loc.id];
    marker.setPosition(new google.maps.LatLng(loc.lat, loc.lon));
    marker.setMap(show ? this.map : null);
  }

  private removeFromOtherRoutes(loc: VehicleLocation): void {
    const routes = Object.keys(this.hash);
    routes.forEach(route => {
      if (route !== loc.routeTag && this.hash[route][loc.id]) {
        this.hash[route][loc.id].map = null;
        delete this.hash[route][loc.id];
      }
    });
  }

  private setMapOnMarkers(route: string, map: any) {
    if (this.hash[route]) {
      const keys = Object.keys(this.hash[route]);
      keys.forEach(key => {
        this.hash[route][key].setAnimation(google.maps.Animation.DROP);
        this.hash[route][key].setMap(map);
      });
    }
  }
}

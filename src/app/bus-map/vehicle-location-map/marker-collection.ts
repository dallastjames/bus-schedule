import { VehicleLocation } from '@bus/models';

export class MarkerCollection {
  private hash = {};

  constructor(private map: google.maps.Map) {}

  merge(loc: VehicleLocation, show: boolean): void {
    if (this.markerExists(loc)) {
      this.moveMarker(loc, show);
    } else {
      this.addMarker(loc, show);
    }
    this.removeFromOtherRoutes(loc);
  }

  hide(routeTag: string) {
    this.setMapOnMarkers(routeTag, null);
  }

  show(routeTag: string) {
    this.setMapOnMarkers(routeTag, this.map);
  }

  private addMarker(loc: VehicleLocation, show: boolean): void {
    this.hash[loc.routeTag] = this.hash[loc.routeTag] || {};
    this.hash[loc.routeTag][loc.id] = new google.maps.Marker({
      position: new google.maps.LatLng(+loc.lat, +loc.lon),
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
    marker.setPosition(new google.maps.LatLng(+loc.lat, +loc.lon));
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

  private setMapOnMarkers(routeTag: string, map: any) {
    if (this.hash[routeTag]) {
      const keys = Object.keys(this.hash[routeTag]);
      keys.forEach(key => {
        this.hash[routeTag][key].setAnimation(google.maps.Animation.DROP);
        this.hash[routeTag][key].setMap(map);
      });
    }
  }
}

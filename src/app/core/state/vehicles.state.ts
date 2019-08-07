import { State, StateContext, Selector } from '@ngxs/store';
import { VehicleLocation } from '@bus/models';
import { Receiver } from '@ngxs-labs/emitter';
import { ImmutableContext, ImmutableSelector } from '@ngxs-labs/immer-adapter';
import { VehicleLocationsService } from '@bus/services';

interface VehiclesStateModel {
  vehicleInformation: VehicleLocation[];
  vehicleMarkersDict: { [key: string]: google.maps.Marker };
  vehicleMarkersByRouteTag: { [key: string]: google.maps.Marker[] };
  lastRequestTime: Date;
}

@State<VehiclesStateModel>({
  name: 'vehicles',
  defaults: {
    vehicleInformation: [],
    vehicleMarkersDict: {},
    vehicleMarkersByRouteTag: {},
    lastRequestTime: new Date(0)
  }
})
export class VehiclesState {
  private static vehicleLocationsService: VehicleLocationsService;

  constructor(vehicleLocationsService: VehicleLocationsService) {
    VehiclesState.vehicleLocationsService = vehicleLocationsService;
  }

  @Selector([VehiclesState])
  @ImmutableSelector()
  public static vehicleInformation(
    state: VehiclesStateModel
  ): VehicleLocation[] {
    return state.vehicleInformation;
  }

  @Selector([VehiclesState])
  @ImmutableSelector()
  public static vehicleMarkersByRouteTag(
    state: VehiclesStateModel
  ): { [key: string]: google.maps.Marker[] } {
    return state.vehicleMarkersByRouteTag;
  }

  @Receiver()
  @ImmutableContext()
  public static async requestUpdate(
    { setState, getState }: StateContext<VehiclesStateModel>,
    { payload }: { payload: string }
  ): Promise<void> {
    const currentState = getState();
    const lastRequestTime = currentState.lastRequestTime;
    const markersDict = currentState.vehicleMarkersDict || {};
    const locations = await VehiclesState.vehicleLocationsService
      .getLatestVehicleLocations(payload, lastRequestTime)
      .toPromise();

    locations.forEach(location => {
      const marker = markersDict[location.id];
      if (!!marker && marker instanceof google.maps.Marker) {
        markersDict[location.id].setPosition(
          new google.maps.LatLng(+location.lat, +location.lon)
        );
      } else {
        markersDict[location.id] = new google.maps.Marker({
          position: new google.maps.LatLng(+location.lat, +location.lon),
          map: null,
          title: location.id,
          animation: google.maps.Animation.DROP
        });
      }
    });

    const routeIdToRouteTagDict: { [key: string]: string } = {};
    for (const location of locations) {
      routeIdToRouteTagDict[location.id] = location.routeTag;
    }
    const markersByRouteTag: { [key: string]: google.maps.Marker[] } = {};
    for (const id of Object.keys(markersDict)) {
      const routeTag = routeIdToRouteTagDict[id] || null;
      if (!!routeTag) {
        if (typeof markersByRouteTag[routeTag] === 'undefined') {
          markersByRouteTag[routeTag] = [];
        }
        markersByRouteTag[routeTag].push(markersDict[id]);
      }
    }

    setState((state: VehiclesStateModel) => {
      state.vehicleInformation = locations;
      state.vehicleMarkersDict = markersDict;
      state.vehicleMarkersByRouteTag = markersByRouteTag;
      state.lastRequestTime = new Date();
      return state;
    });
  }
}

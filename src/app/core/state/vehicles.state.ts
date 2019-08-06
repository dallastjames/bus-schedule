import { State, StateContext } from '@ngxs/store';
import { VehicleLocation } from '@bus/models';
import { Receiver } from '@ngxs-labs/emitter';
import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { VehicleLocationsService } from '@bus/services';

interface VehiclesStateModel {
  vehicleInformation: VehicleLocation[];
  vehicleMarkers: google.maps.Marker[];
  lastRequestTime: Date;
}

@State<VehiclesStateModel>({
  name: 'vehicles',
  defaults: {
    vehicleInformation: [],
    vehicleMarkers: [],
    lastRequestTime: new Date(0)
  }
})
export class VehiclesState {
  private static vehicleLocationsService: VehicleLocationsService;

  constructor(vehicleLocationsService: VehicleLocationsService) {
    VehiclesState.vehicleLocationsService = vehicleLocationsService;
  }

  @Receiver()
  @ImmutableContext()
  public static async requestUpdate(
    { setState, getState }: StateContext<VehiclesStateModel>,
    { payload }: { payload: string }
  ): Promise<void> {
    const lastRequestTime = getState().lastRequestTime;
    const locations = await VehiclesState.vehicleLocationsService
      .getLatestVehicleLocations(payload, lastRequestTime)
      .toPromise();
    setState((state: VehiclesStateModel) => {
      state.vehicleInformation = locations;
      state.lastRequestTime = new Date();
      return state;
    });
  }
}

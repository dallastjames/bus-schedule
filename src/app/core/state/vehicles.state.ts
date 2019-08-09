import { State, StateContext, Selector } from '@ngxs/store';
import { VehicleLocation } from '@bus/models';
import { Receiver } from '@ngxs-labs/emitter';
import { ImmutableContext, ImmutableSelector } from '@ngxs-labs/immer-adapter';
import { VehicleLocationsService } from '@bus/services';

interface VehiclesStateModel {
  vehicleInformation: VehicleLocation[];
  lastRequestTime: Date;
}

@State<VehiclesStateModel>({
  name: 'vehicles',
  defaults: {
    vehicleInformation: [],
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

  @Receiver()
  @ImmutableContext()
  public static async requestUpdate(
    { setState, getState }: StateContext<VehiclesStateModel>,
    { payload }: { payload: string }
  ): Promise<void> {
    const currentState = getState();
    const lastRequestTime = currentState.lastRequestTime;
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

import { VehicleLocation } from './vehicle-location.model';

export interface VehicleLoctationsResponse {
  lastTime: number;
  locations: Array<VehicleLocation>;
}

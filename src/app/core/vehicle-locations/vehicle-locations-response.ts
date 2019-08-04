import { VehicleLocation } from './vehicle-location';

export interface VehicleLoctationsResponse {
  lastTime: number;
  locations: Array<VehicleLocation>;
}

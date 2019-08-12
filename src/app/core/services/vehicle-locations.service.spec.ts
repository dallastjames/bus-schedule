import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { VehicleLocationsService } from './vehicle-locations.service';
import { TestBed } from '@angular/core/testing';
import { environment } from '@bus/env';

describe('VehicleLocationService', () => {
  let service: VehicleLocationsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VehicleLocationsService]
    });
    httpController = TestBed.get(HttpTestingController);
    service = TestBed.get(VehicleLocationsService);
  });

  it('exists', () => {
    expect(service).toBeTruthy();
  });

  describe('getLatestVehicleLocations', () => {
    it('loads the data for the agency using the passed "since" Date', () => {
      service
        .getLatestVehicleLocations('umn-twin', new Date(1499622348293))
        .subscribe();
      const url = `${environment.dataServiceUrl}?command=vehicleLocations&a=umn-twin&t=1499622348293`;
      const req = httpController.expectOne(url);

      expect(req).toBeTruthy();
      req.flush(null);
    });

    it('emits new data', () => {
      let body = '<body><lastTime time="1499622357839" />';
      body += location('42', 'wauk', 13.995, -122.005);
      body += location('314', 'wauk', 73.995, -122.005);
      body += location('73', 'mad', 75.223, -132.005);
      body += location('1138', 'wauk', 77.995, -127.753);
      body += '</body>';
      service
        .getLatestVehicleLocations('umn-twin', new Date(1499622348293))
        .subscribe(res => {
          expect(res).toEqual({
            lastTime: 1499622357839,
            locations: [
              {
                id: '42',
                routeTag: 'wauk',
                dirTag: '30___O_S10',
                lat: '13.995',
                lon: '-122.005',
                secsSinceReport: '20',
                predictable: 'true',
                heading: '350',
                speedKmHr: '0'
              },
              {
                id: '314',
                routeTag: 'wauk',
                dirTag: '30___O_S10',
                lat: '73.995',
                lon: '-122.005',
                secsSinceReport: '20',
                predictable: 'true',
                heading: '350',
                speedKmHr: '0'
              },
              {
                id: '73',
                routeTag: 'mad',
                dirTag: '30___O_S10',
                lat: '75.223',
                lon: '-132.005',
                secsSinceReport: '20',
                predictable: 'true',
                heading: '350',
                speedKmHr: '0'
              },
              {
                id: '1138',
                routeTag: 'wauk',
                dirTag: '30___O_S10',
                lat: '77.995',
                lon: '-127.753',
                secsSinceReport: '20',
                predictable: 'true',
                heading: '350',
                speedKmHr: '0'
              }
            ]
          });
        });

      const url = `${environment.dataServiceUrl}?command=vehicleLocations&a=umn-twin&t=1499622348293`;
      const req = httpController.expectOne(url);

      req.flush(body);
    });

    it('emits an array of one with a single vehicle in the response', () => {
      let body = '<body><lastTime time="1499622357839" />';
      body += location('314', 'wauk', 73.995, -122.005);
      body += '</body>';
      service
        .getLatestVehicleLocations('umn-twin', new Date(1499622348293))
        .subscribe(res => {
          expect(res).toEqual({
            lastTime: 1499622357839,
            locations: [
              {
                id: '314',
                routeTag: 'wauk',
                dirTag: '30___O_S10',
                lat: '73.995',
                lon: '-122.005',
                secsSinceReport: '20',
                predictable: 'true',
                heading: '350',
                speedKmHr: '0'
              }
            ]
          });
        });

      const url = `${environment.dataServiceUrl}?command=vehicleLocations&a=umn-twin&t=1499622348293`;
      const req = httpController.expectOne(url);

      req.flush(body);
    });

    it('emits an empty array with no vehicles in the response', () => {
      let body = '<body><lastTime time="1499622357839" />';
      body += '</body>';
      service
        .getLatestVehicleLocations('umn-twin', new Date(1499622348293))
        .subscribe(res => {
          expect(res).toEqual({
            body: {
              lastTime: {
                time: 1499622357839
              }
            }
          });
        });

      const url = `${environment.dataServiceUrl}?command=vehicleLocations&a=umn-twin&t=1499622348293`;
      const req = httpController.expectOne(url);

      req.flush(body);
    });
  });

  function location(id: string, route: string, lat: number, lon: number) {
    return (
      `<vehicle id="${id}" routeTag="${route}" dirTag="30___O_S10" lat="${lat}" lon="${lon}" ` +
      `secsSinceReport="20" predictable="true" heading="350" speedKmHr="0"/>`
    );
  }
});

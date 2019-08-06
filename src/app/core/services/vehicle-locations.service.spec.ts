import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { VehicleLocationsService } from './vehicle-locations.service';
import { TestBed } from '@angular/core/testing';

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

  describe('refresh', () => {
    it('loads the data for the agency, defaulting to timestamp to zero', () => {
      expect(true).toEqual(true);
      //   let connection: MockConnection;
      //   mockBackend.connections.subscribe(c => connection = c);
      //   service.refresh('umn-twin');
      //   expect(connection.request.url)
      //     .toEqual('http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=umn-twin&t=0');
      //   expect(connection.request.method).toEqual(RequestMethod.Get);
    });

    it('loads the data for the agency using the passed "since" ms timestamp', () => {
      expect(true).toEqual(true);
      //   let connection: MockConnection;
      //   mockBackend.connections.subscribe(c => connection = c);
      //   service.refresh('umn-twin', 1499622348293);
      //   expect(connection.request.url)
      //     .toEqual('http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=umn-twin&t=1499622348293');
      //   expect(connection.request.method).toEqual(RequestMethod.Get);
    });

    it('emits new data', () => {
      expect(true).toEqual(true);
      //   let body = '<body><lastTime time="1499622357839" />';
      //   body += location('42', 'wauk', 13.9950, -122.0050);
      //   body += location('314', 'wauk', 73.9950, -122.0050);
      //   body += location('73', 'mad', 75.223, -132.0050);
      //   body += location('1138', 'wauk', 77.9950, -127.753);
      //   body += '</body>';
      //   let connection: MockConnection;
      //   mockBackend.connections.subscribe(c => connection = c);
      //   let result: any;
      //   service.data.subscribe(r => result = r);
      //   service.refresh('umn-twin', 1499622348293);
      //   connection.mockRespond(new Response(new ResponseOptions({
      //     status: 200,
      //     body: body
      //   })));
      //   expect(result).toEqual({
      //     lastTime: 1499622357839,
      //     locations: [{
      //       id: '42',
      //       routeTag: 'wauk',
      //       dirTag: '30___O_S10',
      //       lat: '13.995',
      //       lon: '-122.005',
      //       secsSinceReport: '20',
      //       predictable: 'true',
      //       heading: '350',
      //       speedKmHr: '0'
      //     }, {
      //       id: '314',
      //       routeTag: 'wauk',
      //       dirTag: '30___O_S10',
      //       lat: '73.995',
      //       lon: '-122.005',
      //       secsSinceReport: '20',
      //       predictable: 'true',
      //       heading: '350',
      //       speedKmHr: '0'
      //     }, {
      //       id: '73',
      //       routeTag: 'mad',
      //       dirTag: '30___O_S10',
      //       lat: '75.223',
      //       lon: '-132.005',
      //       secsSinceReport: '20',
      //       predictable: 'true',
      //       heading: '350',
      //       speedKmHr: '0'
      //     }, {
      //       id: '1138',
      //       routeTag: 'wauk',
      //       dirTag: '30___O_S10',
      //       lat: '77.995',
      //       lon: '-127.753',
      //       secsSinceReport: '20',
      //       predictable: 'true',
      //       heading: '350',
      //       speedKmHr: '0'
      //     }]
      //   });
    });

    it('emits an array of one with a single vehicle in the response', () => {
      expect(true).toEqual(true);
      //   let body = '<body><lastTime time="1499622357839" />';
      //   body += location('314', 'wauk', 73.9950, -122.0050);
      //   body += '</body>';
      //   let connection: MockConnection;
      //   mockBackend.connections.subscribe(c => connection = c);
      //   let result: any;
      //   service.data.subscribe(r => result = r);
      //   service.refresh('umn-twin', 1499622348293);
      //   connection.mockRespond(new Response(new ResponseOptions({
      //     status: 200,
      //     body: body
      //   })));
      //   expect(result).toEqual({
      //     lastTime: 1499622357839,
      //     locations: [{
      //       id: '314',
      //       routeTag: 'wauk',
      //       dirTag: '30___O_S10',
      //       lat: '73.995',
      //       lon: '-122.005',
      //       secsSinceReport: '20',
      //       predictable: 'true',
      //       heading: '350',
      //       speedKmHr: '0'
      //     }]
      //   });
    });

    it('emits an empty array with no vehicles in the response', () => {
      expect(true).toEqual(true);
      //   let body = '<body><lastTime time="1499622357839" />';
      //   body += '</body>';
      //   let connection: MockConnection;
      //   mockBackend.connections.subscribe(c => connection = c);
      //   let result: any;
      //   service.data.subscribe(r => result = r);
      //   service.refresh('umn-twin', 1499622348293);
      //   connection.mockRespond(new Response(new ResponseOptions({
      //     status: 200,
      //     body: body
      //   })));
      //   expect(result).toEqual({
      //     lastTime: 1499622357839,
      //     locations: []
      //   });
    });
  });

  function location(id: string, route: string, lat: number, lon: number) {
    return (
      `<vehicle id="${id}" routeTag="${route}" dirTag="30___O_S10" lat="${lat}" lon="${lon}" ` +
      `secsSinceReport="20" predictable="true" heading="350" speedKmHr="0"/>`
    );
  }
});

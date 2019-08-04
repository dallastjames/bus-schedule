// TODO: Come back and fix this test with the updated HttpClient Library

// import {
//   Http,
//   Response,
//   ResponseOptions,
//   RequestMethod,
//   BaseRequestOptions
// } from '@angular/http';
// import { MockBackend, MockConnection } from '@angular/http/testing';

// import { RoutesService } from './routes.service';

// describe('RoutesService', () => {
//   let mockBackend: MockBackend;
//   let service: RoutesService;

//   beforeEach(() => {
//     const opt = new BaseRequestOptions();
//     mockBackend = new MockBackend();
//     const http = new Http(mockBackend, opt);

//     service = new RoutesService(http);
//   });

//   it('exists', () => {
//     expect(service).toBeTruthy();
//   });

//   describe('refresh', () => {
//     it('loads the data for the agency', () => {
//       let connection: MockConnection;
//       mockBackend.connections.subscribe(c => (connection = c));
//       service.refresh('umn-twin');
//       expect(connection.request.url).toEqual(
//         'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=umn-twin'
//       );
//       expect(connection.request.method).toEqual(RequestMethod.Get);
//     });

//     it('emits new data', () => {
//       let body = '<body>';
//       body += route('1', '1-California');
//       body += route('1AX', '1AX-California A Express');
//       body += route('1BX', '1BX-California B Express');
//       body += route('2', '2-Clement');
//       body += route('3', '3-Jackson');
//       body += route('5', '5-Fulton');
//       body += route('5R', '5R-Fulton Rapid');
//       body += '</body>';
//       let connection: MockConnection;
//       mockBackend.connections.subscribe(c => (connection = c));
//       let result: any;
//       service.data.subscribe(r => (result = r));
//       service.refresh('sf-muni');
//       connection.mockRespond(
//         new Response(
//           new ResponseOptions({
//             status: 200,
//             body: body
//           })
//         )
//       );
//       expect(result).toEqual([
//         { tag: '1', title: '1-California' },
//         { tag: '1AX', title: '1AX-California A Express' },
//         { tag: '1BX', title: '1BX-California B Express' },
//         { tag: '2', title: '2-Clement' },
//         { tag: '3', title: '3-Jackson' },
//         { tag: '5', title: '5-Fulton' },
//         { tag: '5R', title: '5R-Fulton Rapid' }
//       ]);
//     });

//     it('emits an array of one with a single route in the response', () => {
//       let body = '<body>';
//       body += route('1BX', '1BX-California B Express');
//       body += '</body>';
//       let connection: MockConnection;
//       mockBackend.connections.subscribe(c => (connection = c));
//       let result: any;
//       service.data.subscribe(r => (result = r));
//       service.refresh('sf-muni');
//       connection.mockRespond(
//         new Response(
//           new ResponseOptions({
//             status: 200,
//             body: body
//           })
//         )
//       );
//       expect(result).toEqual([
//         { tag: '1BX', title: '1BX-California B Express' }
//       ]);
//     });

//     it('emits an empty array with no routes in the response', () => {
//       let body = '<body><lastTime time="1499622357839" />';
//       body += '</body>';
//       let connection: MockConnection;
//       mockBackend.connections.subscribe(c => (connection = c));
//       let result: any;
//       service.data.subscribe(r => (result = r));
//       service.refresh('sf-muni');
//       connection.mockRespond(
//         new Response(
//           new ResponseOptions({
//             status: 200,
//             body: body
//           })
//         )
//       );
//       expect(result).toEqual([]);
//     });
//   });

//   function route(tag: string, title: string) {
//     return `<route tag="${tag}" title="${title}"/>`;
//   }
// });

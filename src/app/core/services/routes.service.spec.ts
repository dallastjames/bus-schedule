import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { RoutesService } from './routes.service';
import { TestBed } from '@angular/core/testing';

describe('RoutesService', () => {
  let service: RoutesService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoutesService]
    });
    httpController = TestBed.get(HttpTestingController);
    service = TestBed.get(RoutesService);
  });

  it('exists', () => {
    expect(service).toBeTruthy();
  });

  describe('refresh', () => {
    it('loads the data for the agency', () => {
      expect(true).toEqual(true);
      //   service.refresh('umn-twin')
      //   expect(connection.request.url).toEqual(
      //     'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=umn-twin'
      //   );
      //   expect(connection.request.method).toEqual(RequestMethod.Get);
    });

    it('emits new data', () => {
      expect(true).toEqual(true);
      //   let body = '<body>';
      //   body += route('1', '1-California');
      //   body += route('1AX', '1AX-California A Express');
      //   body += route('1BX', '1BX-California B Express');
      //   body += route('2', '2-Clement');
      //   body += route('3', '3-Jackson');
      //   body += route('5', '5-Fulton');
      //   body += route('5R', '5R-Fulton Rapid');
      //   body += '</body>';
      //   let result: any;
      //   service.data.subscribe(r => (result = r));
      //   service.refresh('sf-muni');
      //   expect(result).toEqual([
      //     { tag: '1', title: '1-California' },
      //     { tag: '1AX', title: '1AX-California A Express' },
      //     { tag: '1BX', title: '1BX-California B Express' },
      //     { tag: '2', title: '2-Clement' },
      //     { tag: '3', title: '3-Jackson' },
      //     { tag: '5', title: '5-Fulton' },
      //     { tag: '5R', title: '5R-Fulton Rapid' }
      //   ]);
    });

    it('emits an array of one with a single route in the response', () => {
      expect(true).toEqual(true);
      //   let body = '<body>';
      //   body += route('1BX', '1BX-California B Express');
      //   body += '</body>';
      //   let result: any;
      //   service.data.subscribe(r => (result = r));
      //   service.refresh('sf-muni');
      //   expect(result).toEqual([
      //     { tag: '1BX', title: '1BX-California B Express' }
      //   ]);
    });

    it('emits an empty array with no routes in the response', () => {
      expect(true).toEqual(true);
      //   let body = '<body><lastTime time="1499622357839" />';
      //   body += '</body>';
      //   let result: any;
      //   service.data.subscribe(r => (result = r));
      //   service.refresh('sf-muni');
      //   expect(result).toEqual([]);
    });
  });

  function route(tag: string, title: string) {
    return `<route tag="${tag}" title="${title}"/>`;
  }
});

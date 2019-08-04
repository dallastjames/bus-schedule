import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Subject } from 'rxjs';
import { parseString } from 'xml2js';

import { environment } from '../../../environments/environment';
import { VehicleLoctationsResponse } from './vehicle-locations-response';

@Injectable()
export class VehicleLocationsService {
  data: Subject<VehicleLoctationsResponse>;

  constructor(private http: HttpClient) {
    this.data = new Subject();
  }

  refresh(agency: string, since?: number): void {
    since = since || 0;
    let params = new HttpParams();
    params = params.append('command', 'vehicleLocations');
    params = params.append('a', agency);
    params = params.append('t', since.toString());
    this.http
      .get(environment.dataServiceUrl, {
        params,
        responseType: 'text'
      })
      .subscribe(xml => this.unpackXML(xml));
  }

  private unpackXML(xml: string) {
    parseString(
      xml,
      { explicitArray: false, mergeAttrs: true },
      (err, result) => {
        this.data.next({
          lastTime: parseInt(result.body.lastTime.time, 10),
          locations: !result.body.vehicle
            ? []
            : Array.isArray(result.body.vehicle)
            ? result.body.vehicle
            : [result.body.vehicle]
        });
      }
    );
  }
}

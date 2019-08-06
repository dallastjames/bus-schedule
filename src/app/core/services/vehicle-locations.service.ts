import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Subject, Observable, bindNodeCallback } from 'rxjs';
import { parseString, convertableToString } from 'xml2js';

import { environment } from '@bus/env';
import { VehicleLoctationsResponse, VehicleLocation } from '@bus/models';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehicleLocationsService {
  constructor(private http: HttpClient) {}

  getLatestVehicleLocations(
    agency: string,
    since: Date
  ): Observable<VehicleLocation[]> {
    let params = new HttpParams();
    params = params.append('command', 'vehicleLocations');
    params = params.append('a', agency);
    params = params.append('t', since.getTime().toString());
    return this.http
      .get(environment.dataServiceUrl, {
        params,
        responseType: 'text'
      })
      .pipe(
        switchMap(xml =>
          bindNodeCallback<
            convertableToString,
            any,
            { body: { vehicle: VehicleLocation[] } }
            // tslint:disable-next-line: ter-func-call-spacing
          >(parseString)(xml, {
            explicitArray: false,
            mergeAttrs: true
          })
        ),
        map(xmlRes => {
          if (!!xmlRes && !!xmlRes.body && !!xmlRes.body.vehicle) {
            if (Array.isArray(xmlRes.body.vehicle)) {
              return xmlRes.body.vehicle;
            } else {
              return [xmlRes.body.vehicle as VehicleLocation];
            }
          }
          return [];
        })
      );
  }
}

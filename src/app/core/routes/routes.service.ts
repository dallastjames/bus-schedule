import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { parseString } from 'xml2js';

import { environment } from '../../../environments/environment';
import { Route } from './route';

@Injectable()
export class RoutesService {
  data: Subject<Array<Route>>;

  constructor(private http: HttpClient) {
    this.data = new Subject();
  }

  refresh(agency: string): void {
    let params = new HttpParams();
    params = params.append('command', 'routeList');
    params = params.append('a', agency);
    this.http
      .get(environment.dataServiceUrl, {
        params: params,
        responseType: 'text'
      })
      .subscribe(xml => this.unpackXML(xml));
  }

  private unpackXML(xml: string) {
    parseString(
      xml,
      { explicitArray: false, mergeAttrs: true },
      (err, result) => {
        this.data.next(
          !result.body.route
            ? []
            : Array.isArray(result.body.route)
            ? result.body.route
            : [result.body.route]
        );
      }
    );
  }
}

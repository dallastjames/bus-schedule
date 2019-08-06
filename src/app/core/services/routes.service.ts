import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, bindNodeCallback } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { parseString, convertableToString } from 'xml2js';

import { environment } from '@bus/env';
import { Route } from '@bus/models';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  constructor(private http: HttpClient) {}

  loadAllRoutes(agency: string): Observable<Route[]> {
    let params = new HttpParams();
    params = params.append('command', 'routeList');
    params = params.append('a', agency);
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
            { body: { route: Route[] } }
            // tslint:disable-next-line: ter-func-call-spacing
          >(parseString)(xml, {
            explicitArray: false,
            mergeAttrs: true
          })
        ),
        map(xmlRes => {
          if (!!xmlRes && !!xmlRes.body && !!xmlRes.body.route) {
            if (Array.isArray(xmlRes.body.route)) {
              return xmlRes.body.route;
            } else {
              return [xmlRes.body.route as Route];
            }
          }
          return [];
        }),
        map(routes =>
          routes.sort((a, b) => {
            if (a.title > b.title) {
              return 1;
            } else if (a.title < b.title) {
              return -1;
            } else {
              return 0;
            }
          })
        )
      );
  }
}

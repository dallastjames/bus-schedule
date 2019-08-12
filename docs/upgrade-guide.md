# Upgrade Guide

This document will detail the steps needed to upgrade this application from
its current version to the latest version to date. It includes details on
not only the libraries to update but also how to successfully implement these
upgrades.

# Upgrading Angular

The version of Angular currently installed in this project is version `^4.0.0`
which at the current time is 4 major revisions behind. Angular provides a
webpage that gives instructions on how to update versions and what caveats to
be aware of. In this instance we will be following the
[version 4.0 to 8.0 upgrade guide](https://update.angular.io/#4.0:8.0).

> Note: While Angular does not recommend moving across multiple versions
> at the same time, the app in our case is simple enough that our upgrade
> path does not require moving through each individual version, rather we can
> make all of the required changes easily to make the move.

![Angular Update Guide version 4.0 -> 8.0](./images/angular-update-4-8.png)

Above are noted the settings we will be using for the angular update helper.

- Version 4.0 -> Version 8.0
- Basic complexity (the app is simple having only 1 page and 2-3 components)
- Angular Material checked
- Package manager of your choice (in this document we will use npm)

Clicking <i>Show me how to update!</i> will reveal a list of items that will
need to be addressed for the upgrade to be successful. This document will
condense down the steps required for a successful upgrade as not everything
in the list provided applies to this application.

## Make sure you are running Node 10 or later

The first step to updating successfully is verifying that you are running
Node version 10.x.x or later. You can verify this by running

```sh
$ node --version
v10.15.3
```

If you do not have node installed or are running a version lower than 10.x,
you can obtain the latest version from the [node.js official website](https://nodejs.org/en/).

We will also want to make sure that our npm version is up to date. This can be
done by updating npm, either by installing the latest version of node or running:

> The `@latest` part of the command installs the latest stable version

```sh
$ npm install -g npm@latest
```

## Update TSLint

As the first step in our update process, we will update TSLint to latest.

> the `-D` flag is used to install as a devdepedency

```sh
$ npm i -D tslint@latest
```

There are 5 lint rules that no longer have implementations or that have been
deprecated in the current version of TSLint that we should remove.

- no-access-missing-member
- templates-use-public
- invoke-injectable
- no-use-before-declare
- typeof-compare

Additionally, there are 2 rules with invalid configurations. They are corrected
by using the following: (for information on how to use each rule [see this page](https://palantir.github.io/tslint/rules/)).

```json
"member-ordering": [
    true,
    {
        "order": "fields-first"
    }
],

"semicolon": [true, "always"],
```

Fixing these rules will show reveal several TSLint errors that will need to be
cleaned.

## Update the Angular CLI

We will update the Angular CLI to latest stable. This can be done by running
the following command at the root of the project.

```sh
$ npm install @angular/cli@latest
```

This will install the latest version of the Angular CLI. This version of the
CLI provides several helpful features that we will be able to use to update
the app successfully.

## Remove unneeded dependencies

In Angular version 5, the `@angular/http` package was deprecated in favor of
a newer package. We will want to remove this package from our code. We also
have `@angular/flex-layout` installed but the library isn't used anywhere in
our code. This package will also be removed. Remove these packages with the
following command.

```sh
$ npm uninstall @angular/http @angular/flex-layout
```

## Updating `@angular/core`

At this point, we will want to commit our changes. The Angular CLI provides
a helpful update command that we can use, but it requires that the code
be free of uncommitted changes. Once the previous changes are committed,
we will run ng update with the help of [npx](https://www.npmjs.com/package/npx)
(This library comes installed with the latest versions of npm)

```sh
$ npx ng update @angular/cli
```

This command will make several changes to the code to work with the latest
revision of the Angular CLI. It will:

- Rename `.angular-cli.json` to `angular.json` and update the structure
- Update the `browserlist` file
- Update `karma.conf.js`
- Update the various `tsconfig.json` files
- Update the `polyfills.ts` file.

Once this command is complete, we will once again commit our code. Once
our code is committed we will next update `@angular/core`

> Note that here we use `--force` on this command. Because we are jumping multiple
> versions, the update script will complain that the `@angular/material` version
> is incompatible with the proposed changes. This is OK as we will be manually
> updating this package in the next step.

```sh
$ npx ng update @angular/core --force
```

This command will update all of the versions in the `package.json` file. You
can see that the versions were updated to the latest versions.

One minor but important change we need to make is in the `VehicleLocationMapComponent`.
Currently, we are creating the map in the `ngOnInit` lifecycle hook. However,
rather than using this hook, we need to use the `ngAfterViewInit` hook, as
the on init hook does not guarentee that the view elements are available,
whereas the after view init hook does. ([read more about lifecyle hooks here](https://angular.io/guide/lifecycle-hooks#lifecycle-sequence)).

To make this change, we simply adjust the following in our `vehicle-location-map.component.ts`
file.

```typescript
import { AfterViewInit } from '@angular/core';

export class VehicleLocationMapComponent
  implements OnDestroy, OnInit, AfterViewInit {
  ngOnInit() {
    // Moved to AfterViewInit hook
  }

  ngAfterViewInit() {
    this.createMap();
    this.subscribeToVehicleData();
    this.subscribeToRouteOptionsChanges();
  }
}
```

We previously removed the `@angular/http` package from our repo. We need to
update several places that were using the package to use the new
`HttpClient` from `@angular/common/http`. We can identify the affected files
by searching for `@angular/http` in our codebase.

#### Affected Files

- core.module.ts
- routes.service.ts
- routes.service.spec.ts
- vehicle-locations.service.ts
- vehicle-locations.service.spec.ts

In the `CoreModule` we will replace the `HttpModule` with the new `HttpClientModule`

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [HttpClientModule]
})
```

In our two services files, we will replace `Http` with `HttpClient`

```typescript
import { HttpClient } from '@angular/common/http';

export class SomeService {
  constructor(private http: HttpClient) {}
}
```

We then need to adjust the response type of the requests in our services to `text`
since we are expecting XML responses, not json (which is the default)

```typescript
this.http.get(url, { params, responseType: 'text' });
```

In `vehicle-locations.service.ts`, we have one other small change, query params
cannot be a number and so we need to adjust our fallback for time to be a string.

```typescript
// VehicleLocationsService.refresh
params: {
    command: 'vehicleLocations',
    a: agency,
    t: since ? since.toString() : '0' // This change here
}
```

Lastly, we will need to update the service test files to use the
`HttpClientTestingModule`. In both `*.spec.ts` files, we can safely remove
both lines importing from `@angular/http` and `@angular/http/testing`; We will
then rewrite the `beforeEach`. It should look like this:

```typescript
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { SomeService } from './some.service';

describe('SomeService', () => {
  let service: SomeService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SomeService]
    });
    httpController = TestBed.get(HttpTestingController);
    service = TestBed.get(SomeService);
  });
});
```

Now that we have our initial setup for using the `HttpClientTestingModule`,
we need to refactor our tests to use the new testing library. To do that, we
make the following changes to each test:

- We remove any reference to the `connection` (in all of the tests, there is
  a variable called `connection` that we need to remove).
- We get access to the request being made by using the `httpController`.
- We make our checks in the subscription to the data
- We "flush" the requests made in the test with the data we want it to receive

Some examples of making these changes:

```typescript
// The original test
it('loads the data for the agency', () => {
  let connection: MockConnection;
  mockBackend.connections.subscribe(c => (connection = c));
  service.refresh('sf-muni');
  expect(connection.request.url).toEqual(
    'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni'
  );
  expect(connection.request.method).toEqual(RequestMethod.Get);
});

// The updated test
it('loads the data for the agency', () => {
  service.refresh('sf-muni');

  const url = `http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni`;
  // Here we are expecting to find one request with the given URL.
  const req = httpController.expectOne(url);
  // We expect the request object to be truthy
  expect(req).toBeTruthy();
  // We expect that the request method was a GET request
  expect(req.request.method).toEqual('GET');
  // For this test, we aren't checking the response so we just flush the request
  // with an empty response
  req.flush('<body></body>');
});
```

```typescript
// The original test
it('emits new data', () => {
  let body = '<body>';
  body += route('1', '1-California');
  body += route('1AX', '1AX-California A Express');
  body += route('1BX', '1BX-California B Express');
  body += route('2', '2-Clement');
  body += route('3', '3-Jackson');
  body += route('5', '5-Fulton');
  body += route('5R', '5R-Fulton Rapid');
  body += '</body>';
  let connection: MockConnection;
  mockBackend.connections.subscribe(c => (connection = c));
  let result: any;
  service.data.subscribe(r => (result = r));
  service.refresh('sf-muni');
  connection.mockRespond(
    new Response(
      new ResponseOptions({
        status: 200,
        body: body
      })
    )
  );
  expect(result).toEqual([
    { tag: '1', title: '1-California' },
    { tag: '1AX', title: '1AX-California A Express' },
    { tag: '1BX', title: '1BX-California B Express' },
    { tag: '2', title: '2-Clement' },
    { tag: '3', title: '3-Jackson' },
    { tag: '5', title: '5-Fulton' },
    { tag: '5R', title: '5R-Fulton Rapid' }
  ]);
});

// The updated test
it('emits new data', () => {
  let body = '<body>';
  body += route('1', '1-California');
  body += route('1AX', '1AX-California A Express');
  body += route('1BX', '1BX-California B Express');
  body += route('2', '2-Clement');
  body += route('3', '3-Jackson');
  body += route('5', '5-Fulton');
  body += route('5R', '5R-Fulton Rapid');
  body += '</body>';
  service.data.subscribe(res => {
    // Here we listen for the response to check that it is what we expect
    expect(res).toEqual([
      { tag: '1', title: '1-California' },
      { tag: '1AX', title: '1AX-California A Express' },
      { tag: '1BX', title: '1BX-California B Express' },
      { tag: '2', title: '2-Clement' },
      { tag: '3', title: '3-Jackson' },
      { tag: '5', title: '5-Fulton' },
      { tag: '5R', title: '5R-Fulton Rapid' }
    ]);
  });
  service.refresh('sf-muni');

  const url = `http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni`;
  const req = httpController.expectOne(url);

  // We finalize and respond to the pending request with the data in `body`
  req.flush(body);
});
```

## Updating `@angular/material`

While the Angular CLI does provide an update script for updating `@angular/material`
the same as we did for the CLI and the core package, at the current time that
script installs the beta version `9.0.0-next.0`. We want to avoid that and make
sure that we keep all of the major versions of our Angular packages in sync
so we will manually install the version we want to with the following command:

```sh
$ npm i @angular/material@latest @angular/cdk@latest
```

As part of the Angular Material components upgrade, the prefix for the various
components was changed from `md-*` to `mat-*`. We will need to go through the
components in our app and make these changes.

#### Affected Files

- app.component.html
- app.component.scss
- route-item.component.html
- route-list.component.html

> A simple way to fix all of these is a global find and replace `md-` for `mat-`.
> There are no collisions in this project that would cause any problems.

The final part of upgrading Angular Material is to update the various module
imports. As with the component prefixes, the Module prefixes have been updated
from `Md*Module` to `Mat*Module`. In addition to the updated prefix, Angular
Material provides the individual component modules from their own unique import
path to help with the tree-shakability of the code (reducing final bundle size).

#### Affected Files

- app.module.ts
- app.component.spec.ts

```typescript
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    imports: [
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule
    ]
})
```

- route-list.module.ts
- route-list.component.spec.ts
- route-item.component.spec.ts

```typescript
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

@NgModule({
    imports: [
        MatCheckboxModule,
        MatListModule
    ]
})
```

Angular Material also makes use of the Angular Animations package. We need to
import the animations package into our root `app.module.ts` file.

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [BrowserAnimationsModule]
})
```

In our test files, we also need to add animation support to avoid any errors,
however, we don't want to actually load and execute any animations during tests.
To accomplish this, we use the `NoopAnimationsModule` (short for no operation
animations module).

```typescript
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [NoopAnimationsModule]
})
```

## Updating `rxjs`

As a result of upgrading `@angular/core` earlier, rxjs was upgraded to the
latest stable version in addition to a new dependency `rxjs-compat`. This
new dependency is used to bridge the breaking changes between rxjs versions 5
and 6. There are two main upgrades that we will be doing to make the application
compatible with rxjs 6.x.x. The first of these is to remove all of the
observable prototype patches from the application and the second is to update
all the observables to use [pipeable operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md) with the rxjs pipe instead of
using patched operators.

#### Affected Files

- routes.service.ts
- vehicle-locations.service.ts

```typescript
import 'rxjs/add/operator/map';
```

Any patched operators should be removed from the code. These can easily be
found by searching for `rxjs/add/` in the codebase. In our two service files,
because we are using the new `HttpClient`, we can safely remove the two `.map()`
operators from our http requests.

> We no longer need to map the response to text since we specified that as the
> response type for each request.

We also need to update any imports not using the root `rxjs` export. We can
find these by searching for `'rxjs/` in the codebase. To correct these, we
simply need to change the import to use `rxjs` only.

```typescript
// Before
import { Subject } from 'rxjs/Subject';

// After
import { Subject } from 'rxjs';
```

#### Affected Files

- app.component.ts
- route-options.service.ts
- routes.service.ts
- vehicle-locations.service.ts
- vehicle-location-map.component.spec.ts
- vehicle-location-map.component.ts

We can now safely uninstall the `rxjs-compat` library as we have completed the
required updates.

```sh
$ npm uninstall rxjs-compat
```

## Update `angular-2-local-storage`

The final step in our update process is to handle the `angular-2-local-storage`
library. Because this guide continues with [state management integration](./state-management.md),
we will remove this library and replace it with a storage option provided by our
state management packages. If we didn't want to implement a state management
solution, or wanted to keep using this library, we would need to update this
library to the latest.

> Only run this command if you are planning on following the State Management
> guide provided.

```sh
$ npm uninstall angular-2-local-storage
```

The application is now successfully updated to latest! In the next step we will
integrate a state management solution into the application.

> Only run this command if you are **not** planning on following the State Management
> guide provided.

```sh
$ npm i angular-2-local-storage@latest
```

In `app.module.ts` the importing of `LocalStorageModule` needs to be updated to
the following:

```typescript
@NgModule({
    imports: [
        // Change .withConfig() to .forRoot()
        LocalStorageModule.forRoot({
            prefix: 'bus-sched',
            storageType: 'localStorage'
        })
    ]
})
```

The application is now succesfully updated to latest! You should be able to
start the application using `ng serve` as before and see the application run.

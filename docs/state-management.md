# State Management Integration

This document will detail thet steps needed to integrate a state management
solution into the application. We will be using the NGXS state management
library.

## About NGXS

NGXS is a state management library for Angular. It is modeled after libraries
such as Redux and NgRx but takes advantage of Typescript features to reduce
the boilerplate code. Much of this information can be found in the official
documenation for NGXS located [here](https://ngxs.gitbook.io/ngxs/) and
[here](https://ngxs.gitbook.io/ngxs/concepts/intro). This guide will briefly
summarize the concepts and how they relate to this application, however for a
more in-depth understanding of how this library functions, please refer to the
documetation linked above.

## NGXS concepts

NGXS is made up of 4 primary concepts. These are: the Store, Actions, State, and
Selects. Below, these 4 concepts will be explained.

### Store ([additional info](https://ngxs.gitbook.io/ngxs/concepts/store))

The store is the global manager for the state. It handles both dispatching
actions into the state and selecting data from the state.

### Actions ([additional info](https://ngxs.gitbook.io/ngxs/concepts/actions))

Actions are typically thought of as Commands that the state acts upon. This
could be triggering a change in the data, or the resulting event of something
that already happened. Actions may or may not have a data payload
associated with them.

### State ([additional info](https://ngxs.gitbook.io/ngxs/concepts/state))

State (in the NGXS world) are special decorated typescript classes that
define a state container. These classes represent a piece of the structure of
data in our store.

### Select ([additional info](https://ngxs.gitbook.io/ngxs/concepts/select))

A Select is a function that returns a specific portion of state from the
global state container. This follows the pattern from Redux of keeping
READ and WRITE actions separate.

### Plugins ([additional info](https://ngxs.gitbook.io/ngxs/plugins/intro))

NGXS is a framework that allows for plugins. In our application, we will be
taking advantage of several of these plugins to provide various pieces of
functionality.

### ER Pattern ([additional info](https://github.com/ngxs-labs/emitter))

We make a special note of the ER Pattern for this application. The ER Pattern
is a plugin to the NGXS library that allows us to work without actions. It
uses Typescript decorators to connect the store to the application, allowing
use to write less boilerplate in our application and get up and running quicker.

## Integration into the App

The following sections will cover the actual integration details.

### Installing NGXS

To install NGXS we will run the following command

```sh
$ npm i @ngxs/store @ngxs/devtools-plugin @ngxs/storage-plugin @ngxs-labs/emitter @ngxs-labs/immer-adapter immer
```

Here we are installing the core NGXS library, in addition to several helpful
plugins that are made available to us.

- @ngxs/devtools-plugin will integrate our NGXS store with the redux devtools
  [browser extensions](https://github.com/zalmoxisus/redux-devtools-extension)
- @ngxs/storage-plugin will automatically store our state in localstorage and
  restore it on application start for us.
- @ngxs-labs/emitter is a plugin that lets us bypass writing actions, allowing
  us to connect our views to our state quicker.
- @ngxs-labs/immer-adapter and immer are two libraries that will help us keep
  our state immutable.

### Creating our State

First step to integrating our state management solution is to build our states.
We will start by creating a new folder and module `state` inside of our
`core` folder. We can do this by running a command with the Angular CLI.

```sh
$ ng generate module core/state
```

This will give us our StateModule to work with. To connect it to our application
we will import it in the `core.module.ts` file.

```typescript
import { StateModule } from './state/state.module';

@NgModule({
    imports: [StateModule]
})
```

Now we will want to create our state classes. We will create two files alongside
the `StateModule`.

- routes.state.ts
- vehicles.state.ts

#### Routes State (routes.state.ts)

Our routes state will track what agency we are currently getting data for, in
addition to tracking what routets are available, what routes are selected,
and what the last toggled routes were. To create our state, first we need to
define what that state should look like:

```typescript
interface RoutesStateModel {
  agency: string;
  availableRoutes: Route[];
  selectedRouteTags: string[];
  lastToggledRoutes: Route[];
}
```

Once we have our state shape defined, we need to create the actual state. When
we define our state, we need to supply the name of this state in our store, and
what the default values for each field will be. (defaults can be omitted and
all fields will begin as undefined).

```typescript
import { State } from '@ngxs/store';

interface RoutesStateModel {...}

@State<RoutesStateModel>({
    name: 'routes',
    defaults: {
        agency: '',
        availableRoutes: [],
        selectedRouteTags: [],
        lastToggledRoutes: []
    }
})
export class RoutesState {}
```

#### VehiclesState (vehicles.state.ts)

We will do with VehiclesState, the same as we did with the RoutesState. In
this case, we want to store the latest vehicle information and the date stamp
of the last time we interacted with the API. Our VehiclesState should look like
this:

```typescript
import { State } from '@ngxs/store';

interface VehiclesStateModel {
  vehicleInformation: VehicleLocation[];
  lastRequestTime: number;
}

@State<VehiclesStateModel>({
  name: 'vehicles',
  defaults: {
    vehicleInformation: [],
    lastRequestTime: 0
  }
})
export class VehiclesState {}
```

Next, in our `state.module.ts` file that we newly created, we will import the
various NGXS libraries into our application.

> We will run NGXS in development mode while we are not in production. This helps
> track down any issues we may be running into when working in our store. We are
> also using the recommended options by NGXS to provide forward compatibility
> with the expected breaking changes in the next version of NGXS. Lastly, we
> want to disable the devtools extension for our application when we are in
> production.

```typescript
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([RoutesState, VehiclesState], {
      developmentMode: !environment.production,
      selectorOptions: {
        injectContainerState: false,
        suppressErrors: false
      }
    }),
    // Storage plugin should be the first plugin registered after
    // the main NgxsModule so that it can restore data for any other plugins
    NgxsStoragePluginModule.forRoot(),
    NgxsEmitPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    })
  ],
  providers: []
})
```

At this point our states are created and available to the application. The value
of the states will be saved into local storage and restored into our store when
the application is restarted.

### Populating Route Information

Now that we have our states defined, we need to put data into them. We will start
with the `RoutesState`. The goal of this state is to track what routes are
currently available to display, what routes are selected, and what routes the
user clicks on.

#### Getting Available Routes

In the application, we get the list of routes in our `AppComponent` file on
application start. We want to keep this functionality, but we want to store the
data in our store and reference it from the store, rather than keeping it half
in the `RoutesService` and half in the `AppComponent`. To do this, we will need
to refactor both the `RoutesService` and our `AppComponent` files.

In our `RoutesService` we want to return the response of our HTTP request to
the requester, as opposed to making that data available through a subject. We
no longer want to expose that data here, rather we want the store to consume it
and make it available through [selectors](#Select).

> For type information to work correctly, we need to install the types for
> the xml2js library. This can be done with
>
> ```sh
> $ npm i -D @types/xml2js
> ```
>
> This will install the types for this library and make them available here.

```typescript
import { Observable, bindNodeCallback } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { parseString, convertableToString } from 'xml2js';

export class RoutesService {
  refresh(agency: string): Observable<Route[]> {
    return this.http
      .get(environment.dataServiceUrl, {
        params: {
          command: 'routeList',
          a: agency
        },
        responseType: 'text'
      })
      .pipe(
        /**
         * Use rxjs switchMap and bindNodeCallback operators to parse XML string and return
         * the response as an observable
         */
        switchMap(xml =>
          bindNodeCallback<
            convertableToString,
            any,
            { body: { route: Route[] } }
          >(parseString)(xml, {
            explicitArray: false,
            mergeAttrs: true
          })
        ),
        /**
         * Map the parsed XML to the route response and make sure it
         * is an array, whether 0, 1 or many results were returned
         */
        map(parsedXML => {
          if (!!parsedXML && !!parsedXML.body && !!parsedXML.body.route) {
            if (Array.isArray(parsedXML.body.route)) {
              return parsedXML.body.route;
            } else {
              return [parsedXML.body.route];
            }
          }
          return [];
        }),
        /**
         * Sort the routes by title
         */
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
```

Next, we will connect this data with our store and create a way for our
`AppComponent` to populate it. To do this, we will create a new loadRoutes
static method in our `routes.state.ts` file. We will also create a handful of
selectors here that will be used to select data from this state.

> We also need to create a new interface for the Routes with selection information
> We will call this `RouteSelection` and it extends the existing `Routes` interface
> and adds an additional `selected: boolean` field to the class.

```typescript
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { ImmutableSelector, ImmutableContext } from '@ngxs-labs/immer-adapter';

@State<RoutesStateModel>(...)
export class RoutesState {
  private static routesService: RoutesService;

  constructor(routesService: RoutesService) {
    // We can use Angular's DI system to get services and make
    // them available in the static context of our state
    RoutesState.routesService = routesService;
  }

  // This creates a selector that can be used to retrieve data from the store
  // These selectors are memoized and only will emit a new value when the
  // input properties change. For this selector, we are choosing to only select
  // from the RoutesState
  @Selector([RoutesState])
  // ImmutableSelector decorator ensures that if we make any changes to the data
  // they are kept immutable, allowing us to use methods such as Array.splice()
  // without fear of mutation-related bugs
  @ImmutableSelector()
  static currentAgency(state: RoutesStateModel): string {
    return state.agency;
  }

  @Selector([RoutesState])
  @ImmutableSelector()
  static routesWithSelectionData(state: RoutesStateModel): RouteSelection[] {
    // Here we get the available routes and add the additional
    // data information about whether or not this route is currently selected
    return state.availableRoutes.map(route => ({
      ...route,
      selected: state.selectedRouteTags.includes(route.tag)
    }));
  }

  @Selector([RoutesState])
  @ImmutableSelector()
  static lastToggledRoutes(state: RoutesStateModel): RouteSelection[] {
    // Selects the last toggled routes and whether or not they are selected
    // So the view can react to those changes as needed
    return state.lastToggledRoutes.map(route => ({
      ...route,
      selected: state.selectedRouteTags.includes(route.tag)
    }));
  }

  @Selector([RoutesState])
  @ImmutableSelector()
  static selectedRouteTags(state: RoutesStateModel): string[] {
    return state.selectedRouteTags;
  }

  // Receiver Decorator configures this action to work with the Emitter decorator
  @Receiver()
  // ImmutableContext Decorator allows us to make any changes to the state
  // within this method and the state with be changed without mutation,
  // even if we use methods that mutate, such as Array.splice()
  @ImmutableContext()
  public static async loadRoutes(
    { setState, getState }: StateContext<RoutesStateModel>,
    { payload }: EmitterAction<string>
  ): Promise<void> {
    // Get all routes, turning our observable into a promise here for easy
    // state manipulation with async/await
    const routes = await RoutesState.routesService.refresh(payload).toPromise();
    const availableRouteTags = routes.map(route => route.tag);
    setState((state: RoutesStateModel) => {
      // Our payload is the agency requested
      state.agency = payload;
      // We set the available routes from the API response
      state.availableRoutes = routes;
      // We filter any selected routes that may not be selected anymore
      // due to us changing agencies
      state.selectedRouteTags = state.selectedRouteTags.filter(tag =>
        availableRouteTags.includes(tag)
      );
      // If we need to deselect any routes from refreshing the data or by
      // changing the agency, we do that here by identifying them and
      // marking them as toggled
      state.lastToggledRoutes = state.availableRoutes
        .filter(route => !availableRouteTags.includes(route.tag))
        .map(route => ({ ...route, selected: false }));
      return state;
    });
  }
}
```

Finally, we need to connect our `RoutesState` with our app component. This makes
use of more decorators from NGXS. Since our route data will be in an observable
now, we will also make use of the async pipe to pass this route data to our
`bus-route-list` component.

```typescript
@Component(...)
export class AppComponent {
    // Select the routes with selection data
    @Select(RoutesState.routesWithSelectionData)
    routes$: Observable<RouteSelection[]>;
    // Configure an emitter that we will call to load new route data
    @Emitter(RoutesState.loadRoutes)
    loadRoutes: Emittable<string>;

    constructor() {
        // We want to load routes for our current agency
        this.loadRoutes.emit('sf-muni');
    }

    ngOnInit() {}
}
```

```html
<!-- app.component.html -->

<bus-route-list [routes]="routes$ | async"></bus-route-list>
```

#### Selecting Routes

Now that we have the routes loaded into our view, we need to notify the store
when a user clicks on one of the routes to select it. This will involve adding
a new `Receiver` into our state and connecting it to our `bus-route-item`
component.

```typescript
export class RoutesState {
  @Receiver()
  @ImmutableContext()
  static async toggleRoute(
    { setState }: StateContext<RoutesStateModel>,
    { payload }: EmitterAction<Route>
  ): Promise<void> {
    setState((state: RoutesStateModel) => {
      const selectedRouteIndex = state.selectedRouteTags.indexOf(payload.tag);
      if (selectedRouteIndex > -1) {
        // Route is selected, so we need to unselect it
        state.selectedRouteTags = [
          ...state.selectedRouteTags.slice(0, selectedRouteIndex),
          ...state.selectedRouteTags.slice(selectedRouteIndex + 1)
        ];
      } else {
        // Route is not selected, so we need to select it
        state.selectedRouteTags = [...state.selectedRouteTags, payload.tag];
      }
      state.lastToggledRoutes = [payload];
      return state;
    });
  }
}
```

> We changed the type information on the `RouteItemComponent` since we are passing
> the RouteSelection data now instead of just the route. It would be good code
> hygeine to make this same change in the `RouteListComponent`.

```typescript
export class RouteItemComponent {
  // Note that we changed the type here
  @Input() route: RouteSelection;
  @Emitter(RoutesState.toggleRoute)
  toggleRoute: Emittable<Route>;

  constructor() {}
}
```

```html
<!-- route-item.component.html -->

<mat-checkbox [checked]="route.selected" (change)="toggleRoute.emit(route)">
  {{ route.title }}
</mat-checkbox>
```

With these changes our `RoutesState` is now complete. Next we will integrate our
`VehiclesState` into our application to truely make our application reactive.

### Tracking Vehicle Information

Integrating the vehicle information into our state will follow the same pattern
that we just followed with our routes state. For this reason, this section will
be brief, only showing the relavent parts of the code to note and not as much
information on the exact implementation details.

As with the `RoutesService` we need to adjust the refresh method to return its
response as an observable as opposed to storing it in a subject.

```typescript
export class VehicleLocationsService {
  refresh(agency: string, since?: number): Observable<VehicleLocation[]> {
    return this.http
      .get(environment.dataServiceUrl, {
        params: {
          command: 'vehicleLocations',
          a: agency,
          t: since ? since.toString() : '0'
        },
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
        map(parsedXML => {
          if (!!parsedXML && !!parsedXML.body && !!parsedXML.body.vehicle) {
            if (Array.isArray(parsedXML.body.vehicle)) {
              return parsedXML.body.vehicle;
            } else {
              return [parsedXML.body.vehicle as VehicleLocation];
            }
          }
          return [];
        })
      );
  }
}
```

Our `VehiclesState` can then be updated to add both the `Receiver` to trigger
fetching the data in addition to the selector to retrieve the data

```typescript
export class VehiclesState {
  private static vehicleLocationsService: VehicleLocationsService;

  constructor(vehicleLocationsService: VehicleLocationsService) {
    VehiclesState.vehicleLocationsService = vehicleLocationsService;
  }

  @Selector([VehiclesState])
  @ImmutableSelector()
  public static vehicleInformation(
    state: VehiclesStateModel
  ): VehicleLocation[] {
    return state.vehicleInformation;
  }

  @Receiver()
  @ImmutableContext()
  public static async requestUpdate(
    { setState, getState }: StateContext<VehiclesStateModel>,
    { payload }: EmitterAction<string>
  ): Promise<void> {
    const currentState = getState();
    const lastRequestTime = currentState.lastRequestTime;
    const locations = await VehiclesState.vehicleLocationsService
      .refresh(payload, lastRequestTime)
      .toPromise();

    setState((state: VehiclesStateModel) => {
      state.vehicleInformation = locations;
      state.lastRequestTime = new Date().getTime();
      return state;
    });
  }
}
```

Finally, we connect these pieces to our `VehicleLocationMapComponent`.

> Learn more about using `takeUntil` to unsubscribe [here](https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription/41177163#41177163)
> and [here](https://medium.com/@benlesh/rxjs-dont-unsubscribe-6753ed4fda87)

```typescript
export class VehicleLocationMapComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('vehicleLocationMap', { static: true, read: ElementRef })
  mapEl: ElementRef<HTMLDivElement>;

  // Configure our emitter that we will use to request to update the vehicle
  // location information
  @Emitter(VehiclesState.requestUpdate)
  updateVehiclePositions: Emittable<string>;
  // Select the current agency so we can use it in our requestUpdate payload
  @Select(RoutesState.currentAgency)
  currentAgency$: Observable<string>;
  // Select the last toggled routes so we can toggle the vehicle icons on the map
  @Select(RoutesState.lastToggledRoutes)
  toggledRoutes$: Observable<RouteSelection[]>;
  // Select the selected route tags so we can toggle the vehicle icons on the map
  @Select(RoutesState.selectedRouteTags)
  selectedRouteTags$: Observable<string[]>;
  // Select the vehicle information so we can place the icons on the map
  @Select(VehiclesState.vehicleInformation)
  vehicles$: Observable<VehicleLocation[]>;

  private map: google.maps.Map;
  // We will use this unsub variable to unsubscribe from our observables when
  // the component is destroyed to prevent memory leaks.
  private unsub: Subject<void> = new Subject<void>();
  private markerCollection: MarkerCollection;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createMap();
    this.createIntervalUpdater();
    this.createMarkerWatcher();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  private createMap() {
    this.map = new google.maps.Map(this.mapEl.nativeElement, {
      center: new google.maps.LatLng(37.7749, -122.4194),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    this.markerCollection = new MarkerCollection(this.map);
  }

  private createMarkerWatcher() {
    this.vehicles$
      .pipe(
        // We take our vehicle information together with the selected route tags
        // so we can know if we should display the vehicle marker or not when
        // its position changes
        withLatestFrom(this.selectedRouteTags$),
        takeUntil(this.unsub)
      )
      .subscribe(([vehicleData, selectedRouteTags]) => {
        for (const vehicle of vehicleData) {
          this.markerCollection.merge(
            vehicle,
            selectedRouteTags.includes(vehicle.routeTag)
          );
        }
      });
    this.toggledRoutes$
      .pipe(takeUntil(this.unsub))
      .subscribe(lastToggledRoutes => {
        // Whenever a route is toggled, we can show or hide it by its tag
        for (const route of lastToggledRoutes) {
          if (route.selected) {
            this.markerCollection.show(route.tag);
          } else {
            this.markerCollection.hide(route.tag);
          }
        }
      });
  }

  private createIntervalUpdater() {
    // We create an interval that runs every 15 seconds
    interval(15000)
      .pipe(
        // Using startWith operator, it will immediately emit a value instead
        // of waiting 15 seconds for the first interval value to omit
        startWith(null),
        // combine the data with the latest value from the currently viewed agency
        withLatestFrom(this.currentAgency$),
        takeUntil(this.unsub)
      )
      .subscribe(([_, agency]) => this.updateVehiclePositions.emit(agency));
  }
}
```

At this point, we have successfully integrated our state management solution
into our application. Using `ng serve` our application should start up correctly
and work same as before, with the added benefits of reactive state management.

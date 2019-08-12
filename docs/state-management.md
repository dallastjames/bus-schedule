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
  lastRequestTime: Date;
}

@State<VehiclesStateModel>({
  name: 'vehicles',
  defaults: {
    vehicleInformation: [],
    lastRequestTime: new Date(0)
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

```typescript
import { switchMap, map } from 'rxjs/operators';

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
         * Use rxjs switchMap operator to parse XML string and return
         * the response as an observable
         */
        switchMap(xml =>
          bindNodeCallback(parseString)(xml, {
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

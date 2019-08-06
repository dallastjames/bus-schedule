import { State, Selector, StateContext } from '@ngxs/store';
import { ImmutableSelector, ImmutableContext } from '@ngxs-labs/immer-adapter';
import { Receiver } from '@ngxs-labs/emitter';
import { Route } from '@bus/models';
import { Observable } from 'rxjs';
import { RoutesService } from '@bus/services';

interface RoutesStateModel {
  routes: Route[];
}

@State<RoutesStateModel>({
  name: 'busRoutes',
  defaults: {
    routes: []
  }
})
export class RoutesState {
  private static routesService: RoutesService;

  constructor(routesService: RoutesService) {
    RoutesState.routesService = routesService;
  }

  @Selector()
  @ImmutableSelector()
  public static routes(state: RoutesStateModel): Route[] {
    return state.routes;
  }

  @Receiver()
  @ImmutableContext()
  public static async loadRoutes(
    { setState }: StateContext<RoutesStateModel>,
    { payload }: { payload: string }
  ): Promise<void> {
    const routes = await RoutesState.routesService
      .loadAllRoutes(payload)
      .toPromise();
    setState((state: RoutesStateModel) => {
      routes.map(route => {
        const routeInState = state.routes.find(r => route.title === r.title);
        if (!!routeInState) {
          route.selected = routeInState.selected;
        } else {
          route.selected = false;
        }
      });
      state.routes = routes;
      return state;
    });
  }

  @Receiver()
  @ImmutableContext()
  public static async toggleRoute(
    { setState }: StateContext<RoutesStateModel>,
    { payload }: { payload: Route }
  ): Promise<void> {
    setState((state: RoutesStateModel) => {
      const routeIndex = state.routes.findIndex(r => r.title === payload.title);
      if (routeIndex > -1) {
        const route = state.routes[routeIndex];
        route.selected = !route.selected;
        state.routes[routeIndex] = route;
      }
      return state;
    });
  }
}

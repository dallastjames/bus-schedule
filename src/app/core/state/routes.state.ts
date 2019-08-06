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
        // Toggle, but we need to make our check a bit more specific
        // to handle the case when selected === undefined
        route.selected = route.selected === true ? false : true;
        state.routes[routeIndex] = route;
      }
      return state;
    });
  }
}

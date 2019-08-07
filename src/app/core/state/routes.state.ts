import { State, Selector, StateContext } from '@ngxs/store';
import { ImmutableSelector, ImmutableContext } from '@ngxs-labs/immer-adapter';
import { Receiver } from '@ngxs-labs/emitter';
import { Route } from '@bus/models';
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

  @Selector([RoutesState])
  @ImmutableSelector()
  public static routes(state: RoutesStateModel): Route[] {
    return state.routes;
  }

  @Selector([RoutesState])
  @ImmutableSelector()
  public static selectedRoutes(state: RoutesStateModel): Route[] {
    return state.routes.filter(route => route.selected === true);
  }

  @Receiver()
  @ImmutableContext()
  public static async loadRoutes(
    { setState, getState }: StateContext<RoutesStateModel>,
    { payload }: { payload: string }
  ): Promise<void> {
    const currentRoutes = getState().routes;
    const routes = await RoutesState.routesService
      .loadAllRoutes(payload)
      .toPromise();
    const mergedRoutes = routes.map(route => {
      const routeInState = currentRoutes.find(r => route.title === r.title);
      if (!!routeInState) {
        route.selected = routeInState.selected;
      } else {
        route.selected = false;
      }
      return route;
    });
    setState((state: RoutesStateModel) => {
      state.routes = mergedRoutes;
      return state;
    });
  }

  @Receiver()
  @ImmutableContext()
  public static async toggleRoute(
    { setState }: StateContext<RoutesStateModel>,
    { payload }: { payload: Route }
  ): Promise<void> {
    let updatedRoutes: Route[];
    setState((state: RoutesStateModel) => {
      const routeIndex = state.routes.findIndex(r => r.title === payload.title);
      if (routeIndex > -1) {
        const route = state.routes[routeIndex];
        route.selected = !route.selected;
        state.routes[routeIndex] = route;
        updatedRoutes = state.routes;
      }
      return state;
    });
  }
}

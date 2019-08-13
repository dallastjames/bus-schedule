import { State, Selector, StateContext } from '@ngxs/store';
import { ImmutableSelector, ImmutableContext } from '@ngxs-labs/immer-adapter';
import { Receiver, EmitterAction } from '@ngxs-labs/emitter';
import { Route, RouteSelection } from '@bus/models';
import { RoutesService } from '@bus/services';

interface RoutesStateModel {
  agency: string;
  availableRoutes: Route[];
  selectedRouteTags: string[];
  lastToggledRoutes: Route[];
}

@State<RoutesStateModel>({
  name: 'routes',
  defaults: {
    agency: '',
    availableRoutes: [],
    selectedRouteTags: [],
    lastToggledRoutes: []
  }
})
export class RoutesState {
  private static routesService: RoutesService;

  constructor(routesService: RoutesService) {
    RoutesState.routesService = routesService;
  }

  @Selector([RoutesState])
  @ImmutableSelector()
  static currentAgency(state: RoutesStateModel): string {
    return state.agency;
  }

  @Selector([RoutesState])
  @ImmutableSelector()
  static routesWithSelectionData(state: RoutesStateModel): RouteSelection[] {
    return state.availableRoutes.map(route => ({
      ...route,
      selected: state.selectedRouteTags.includes(route.tag)
    }));
  }

  @Selector([RoutesState])
  @ImmutableSelector()
  static lastToggledRoutes(state: RoutesStateModel): RouteSelection[] {
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

  @Receiver()
  @ImmutableContext()
  public static async loadRoutes(
    { setState, getState }: StateContext<RoutesStateModel>,
    { payload }: EmitterAction<string>
  ): Promise<void> {
    const routes = await RoutesState.routesService
      .loadAllRoutes(payload)
      .toPromise();
    const availableRouteTags = routes.map(route => route.tag);
    setState((state: RoutesStateModel) => {
      state.agency = payload;
      state.availableRoutes = routes;
      state.selectedRouteTags = state.selectedRouteTags.filter(tag =>
        availableRouteTags.includes(tag)
      );
      state.lastToggledRoutes = state.availableRoutes
        .filter(route => !availableRouteTags.includes(route.tag))
        .map(route => ({ ...route, selected: false }));
      return state;
    });
  }

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

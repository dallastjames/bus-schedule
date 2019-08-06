import { RouteOptionsService } from './route-options.service';

describe('RouteOptionsService', () => {
  let service: RouteOptionsService;

  beforeEach(() => {
    // TODO: localstorage was removed, need to update this once state is added
    service = new RouteOptionsService();
  });

  it('exists', () => {
    expect(service).toBeTruthy();
    [].slice(0, 0);
  });

  describe('show/hide', () => {
    it('defaults to hidden', () => {
      expect(service.shouldDisplayRoute('sf-muni', '1AX')).toBeFalsy();
    });

    it('changes as apporpriate', () => {
      service.hideRoute('sf-muni', '1AX');
      expect(service.shouldDisplayRoute('sf-muni', '1AX')).toBeFalsy();
      service.showRoute('sf-muni', '1AX');
      expect(service.shouldDisplayRoute('sf-muni', '1AX')).toBeTruthy();
      service.showRoute('sf-muni', '1AX');
      expect(service.shouldDisplayRoute('sf-muni', '1AX')).toBeTruthy();
      service.hideRoute('sf-muni', '1AX');
      expect(service.shouldDisplayRoute('sf-muni', '1AX')).toBeFalsy();
    });

    it('supports changing several routes at once', () => {
      service.showRoute('sf-muni', ['1', '1AX', '1BX']);
      expect(service.shouldDisplayRoute('sf-muni', '1')).toBeTruthy();
      expect(service.shouldDisplayRoute('sf-muni', '1AX')).toBeTruthy();
      expect(service.shouldDisplayRoute('sf-muni', '1BX')).toBeTruthy();
      service.hideRoute('sf-muni', ['1', '1AX', '1BX']);
      expect(service.shouldDisplayRoute('sf-muni', '1')).toBeFalsy();
      expect(service.shouldDisplayRoute('sf-muni', '1AX')).toBeFalsy();
      expect(service.shouldDisplayRoute('sf-muni', '1BX')).toBeFalsy();
    });

    it('emits the routes that were changed', () => {
      let opts;
      service.changedOptions.subscribe(o => (opts = o));
      service.showRoute('sf-muni', ['1', '1AX', '1BX']);
      expect(opts).toEqual([
        { agency: 'sf-muni', route: '1' },
        { agency: 'sf-muni', route: '1AX' },
        { agency: 'sf-muni', route: '1BX' }
      ]);
      service.hideRoute('wauk', '5');
      expect(opts).toEqual([{ agency: 'wauk', route: '5' }]);
    });
  });
});

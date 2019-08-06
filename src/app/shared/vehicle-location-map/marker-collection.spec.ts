import { MarkerCollection } from './marker-collection';
import { VehicleLocation } from '../../core/vehicle-locations/vehicle-location';

class MarkerMock {
  setAnimation() {}
  setMap() {}
  setPosition() {}
}

declare var google: any;

describe('MarkerCollection', () => {
  let testVehicle: VehicleLocation;

  beforeAll(() => {
    window['google'] = {
      maps: {
        Animation: {
          BOUNCE: 1,
          DROP: 2
        },
        LatLng: function() {},
        Map: function() {},
        MapTypeId: {
          ROADMAP: 1
        },
        Marker: function() {}
      }
    };
  });

  beforeEach(() => {
    initializeTestData();
  });

  it('exists', () => {
    const m = new MarkerCollection({});
    expect(m).toBeTruthy();
  });

  describe('merge', () => {
    it('adds a new marker', () => {
      const map = { name: 'I am map' };
      const m = new MarkerCollection(map);
      google.maps.LatLng = jest.fn();
      google.maps.Marker = jest.fn();
      google.maps.LatLng.mockImplementationOnce(() => ({
        lat: testVehicle.lat,
        lng: testVehicle.lon
      }));
      google.maps.Marker.mockImplementationOnce(() => {});
      m.merge(testVehicle, true);
      expect(google.maps.LatLng).toHaveBeenCalledTimes(1);
      expect(google.maps.LatLng).toHaveBeenCalledWith(
        testVehicle.lat,
        testVehicle.lon
      );
      expect(google.maps.Marker).toHaveBeenCalledTimes(1);
      expect(google.maps.Marker).toHaveBeenCalledWith({
        position: { lat: testVehicle.lat, lng: testVehicle.lon },
        map: map,
        title: testVehicle.id,
        animation: google.maps.Animation.DROP
      });
    });

    it('creates a new marker without a map if show is false', () => {
      const map = { name: 'I am map' };
      const m = new MarkerCollection(map);
      google.maps.LatLng = jest.fn();
      google.maps.Marker = jest.fn();
      google.maps.LatLng.mockImplementationOnce(() => ({
        lat: testVehicle.lat,
        lng: testVehicle.lon
      }));
      google.maps.Marker.mockImplementationOnce(() => {});
      m.merge(testVehicle, false);
      expect(google.maps.LatLng).toHaveBeenCalledTimes(1);
      expect(google.maps.LatLng).toHaveBeenCalledWith(
        testVehicle.lat,
        testVehicle.lon
      );
      expect(google.maps.Marker).toHaveBeenCalledTimes(1);
      expect(google.maps.Marker).toHaveBeenCalledWith({
        position: { lat: testVehicle.lat, lng: testVehicle.lon },
        map: null,
        title: testVehicle.id,
        animation: google.maps.Animation.DROP
      });
    });

    it('moves an existing marker', () => {
      const map = { name: 'I am map' };
      const m = new MarkerCollection(map);
      google.maps.LatLng = jest.fn();
      google.maps.Marker = jest.fn();
      google.maps.LatLng.mockImplementationOnce(() => ({
        lat: testVehicle.lat,
        lng: testVehicle.lon
      }));
      const marker = new MarkerMock();
      marker.setPosition = jest.fn();
      google.maps.Marker.mockImplementationOnce(() => marker);
      m.merge(testVehicle, true);
      testVehicle.lat = '74';
      testVehicle.lon = '-121.98';
      m.merge(testVehicle, true);
      expect((marker.setPosition as jest.Mock).mock.calls.length).toEqual(1);
    });
  });

  function initializeTestData() {
    testVehicle = {
      id: '314',
      routeTag: 'wauk',
      dirTag: '30___O_S10',
      lat: '73.995',
      lon: '-122.005',
      secsSinceReport: '20',
      predictable: 'true',
      heading: '350',
      speedKmHr: '0'
    };
  }
});

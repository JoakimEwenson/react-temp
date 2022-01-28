import React, { useEffect, useState, PureComponent } from "react";
import { Link } from "react-router-dom";
import { Popup, Marker, GeolocateControl } from "react-map-gl";
import ReactMapGL, { NavigationControl } from "react-map-gl";
import { colorTemperature, getRandomCli } from "../Utils/Common";
import apiCaller from "../Utils/apiCaller";

class Markers extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <>
        <Marker key={getRandomCli(4)} latitude={data.latitude} longitude={data.longitude} offsetTop={-16}>
          <i className="fas fa-map-marker-alt"></i>
        </Marker>
      </>
    );
  }
}

class Popups extends PureComponent {
  render() {
    const { data } = this.props;
    return data.map((loc) => (
      <Popup closeButton={false} key={loc.id} latitude={parseFloat(loc.lat)} longitude={parseFloat(loc.lon)}>
        <div className="p-1 text-center">
          <small className="font-bold">
            <Link to={`/plats/${loc.id}`}>{loc.title}</Link>
          </small>
          <br />
          <span className="temperatureSmall" style={{ color: colorTemperature(loc.temp) }}>
            {loc.temp}&deg;
          </span>
        </div>
      </Popup>
    ));
  }
}

export default function NearbyLocations({ lat, long, locationId, numResults, hasTimeStamp, showMarker = false }) {
  const defaultLat = 62.10237936;
  const defaultLong = 14.5632154;
  const defaultZoom = 10;
  const [locationList, setLocationList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState();
  const [coords, setCoords] = useState({
    latitude: Number(lat),
    longitude: Number(long),
  });
  const [mapWidth, setMapWidth] = useState("fit");
  const [mapHeight, setMapHeight] = useState("65vh");
  const [viewport, setViewport] = useState({
    width: mapWidth,
    height: mapHeight,
    latitude: coords.latitude ? coords.latitude : defaultLat,
    longitude: coords.longitude ? coords.longitude : defaultLong,
    zoom: defaultZoom,
  });

  // Get a list of locations
  async function getNearbyList(lat, long, num) {
    try {
      // Fetch data
      const result = await apiCaller(`lat=${lat}&lon=${long}&num=${num}&verbose=true&amm=true`);
      const data = await result.json();
      // Process data
      if (data?.stations?.length > 0) {
        setLocationList(data?.stations);
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      console.error(`Error: ${error}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    getNearbyList(lat, long, numResults);

    return () => {};
  }, [lat, long, locationId, numResults, hasTimeStamp, mapWidth]);

  return (
    <div className="container mx-auto p-3">
      {hasError ? (
        <div className="mx-auto p-3 text-center border bg-red-600 text-white font-semibold max-w-4xl">{hasError}</div>
      ) : (
        ""
      )}
      {isLoading ? "Laddar..." : ""}
      <div className="bg-white rounded-lg container max-w-4xl mx-auto p-3">
        <div id="mapContainer" class="hidden">
          <ReactMapGL
            mapboxApiAccessToken="pk.eyJ1IjoiamV3ZW5zb24iLCJhIjoiY2tkeWkxdDAxMndjaTJ0b2Rpc3p2a3pweSJ9.r_KppxmTaSixudgMmFpW7A"
            mapStyle="mapbox://styles/jewenson/ckbtk7ve70z1t1iqlcryenuzz"
            {...viewport}
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
            onResize={(e) => {
              setMapWidth("100%");
              setMapHeight("65vh");
            }}
          >
            <div className="p-0" style={{ position: "absolute", right: 0, zIndex: 42 }}>
              <NavigationControl showCompass={false} />
              {showMarker ? (
                <GeolocateControl
                  className="mt-2"
                  showUserLocation={true}
                  label="Hämta din position"
                  positionOptions={{ enableHighAccuracy: true }}
                  trackUserLocation={false}
                  onGeolocate={(pos) => {
                    setCoords({
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude,
                    });
                    setViewport(viewport);
                    getNearbyList(pos.coords.latitude, pos.coords.longitude, numResults);
                  }}
                />
              ) : (
                ""
              )}
            </div>
            {locationList ? <Popups data={locationList} /> : ""}
            {showMarker ? <Markers data={coords} /> : ""}
          </ReactMapGL>
        </div>
        <h3 className="text-xl md:text-3xl">Närliggande mätstationer</h3>
        <div className="overflow-auto">
          <table className="container max-w-4xl my-3 mx-auto prose">
            <thead>
              <tr>
                <th className="w-1/2 text-left">Plats</th>
                <th className="w-1/4 text-right">Avstånd</th>
                <th className="w-1/4 text-right">Temperatur</th>
              </tr>
            </thead>
            <tbody>
              {locationList.map((row) => (
                <tr key={row.id} className="border-bottom hover:bg-gray-100">
                  <td className="py-2 w-1/2 truncate">
                    <Link to={`/plats/${row.id}`}>{row.title}</Link>
                  </td>
                  <td className="py-2 w-1/4 text-right">{row.dist} km</td>
                  <td className="py-2 w-1/4 text-right">{row.temp}&deg;C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

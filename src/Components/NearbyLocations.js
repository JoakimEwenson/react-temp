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
  const defaultMapWidth = "100%";
  const defaultMapHeight = "65vh";
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
  const [viewport, setViewport] = useState({
    width: defaultMapWidth,
    height: defaultMapHeight,
    latitude: coords.latitude ? coords.latitude : defaultLat,
    longitude: coords.longitude ? coords.longitude : defaultLong,
    zoom: defaultZoom,
  });

  //console.log({ lat }, { long });

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
  }, [lat, long, locationId, numResults, hasTimeStamp]);

  return (
    <>
      {hasError ? (
        <div className="mx-auto my-3 p-3 text-center border bg-red-600 text-white font-semibold shadow-sm max-w-5xl">
          {hasError}
        </div>
      ) : (
        ""
      )}
      {isLoading ? "Laddar..." : ""}
      <div className="container bg-white shadow-sm max-w-5xl my-3">
        <div className="map_container">
          <ReactMapGL
            mapboxApiAccessToken="pk.eyJ1IjoiamV3ZW5zb24iLCJhIjoiY2tkeWkxdDAxMndjaTJ0b2Rpc3p2a3pweSJ9.r_KppxmTaSixudgMmFpW7A"
            mapStyle="mapbox://styles/jewenson/ckbtk7ve70z1t1iqlcryenuzz"
            {...viewport}
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
          >
            <div className="p-0" style={{ position: "absolute", right: 0, zIndex: 99 }}>
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
                    setViewport({
                      width: defaultMapWidth,
                      height: defaultMapHeight,
                      latitude: pos.coords.latitude ? pos.coords.latitude : defaultLat,
                      longitude: pos.coords.longitude ? pos.coords.longitude : defaultLong,
                      zoom: defaultZoom,
                    });
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
        <div className="py-10">
          <table className="container table-auto">
            <thead>
              <tr>
                <th colSpan="3" className="text-center py-3">
                  Kartans mätstationer
                </th>
              </tr>
              <tr>
                <th className="w-1/2">Plats</th>
                <th className="w-1/4">Avstånd</th>
                <th className="w-1/4">Temperatur</th>
              </tr>
            </thead>
            <tbody>
              {locationList.map((row) => (
                <tr key={row.id} className="border-bottom hover:bg-gray-100">
                  <td className="py-2">
                    <Link to={`/plats/${row.id}`}>{row.title}</Link>
                  </td>
                  <td className="py-2">{row.dist} km</td>
                  <td className="py-2">{row.temp}&deg;C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

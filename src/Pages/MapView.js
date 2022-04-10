import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Popup } from "react-map-gl";
import ReactMapGL from "react-map-gl";
import { colorTemperature, getRandomCli } from "../Utils/Common";

export default function MapView({ lat, long, locationId, numResults, hasTimeStamp }) {
  const defaultMapWidth = "100%";
  const defaultMapHeight = "75vh";
  const defaultLat = 62.10237936;
  const defaultLong = 14.5632154;
  const defaultZoom = 6;
  const [locationList, setLocationList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState();
  const [viewport, setViewport] = useState({
    width: defaultMapWidth,
    height: defaultMapHeight,
    latitude: Number(lat) ? Number(lat) : defaultLat,
    longitude: Number(long) ? Number(long) : defaultLong,
    zoom: defaultZoom,
  });

  // Get a list of locations
  async function getNearbyList(lat, long, num) {
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?lat=${lat}&lon=${long}&num=${num}&verbose=true&amm=true&cli=${CLI}`;
    console.log(APIURL);

    let locationList = [];
    console.log({ locationList });
    setLocationList(locationList);

    setLoading(false);
    setError(null);
  }

  useEffect(() => {
    setLoading(true);
    if (lat && long && numResults) {
      getNearbyList(lat, long, numResults);
    } else {
      getNearbyList(defaultLat, defaultLong, 10);
    }
  }, [lat, long, locationId, numResults, hasTimeStamp]);

  return (
    <>
      {hasError ? <div>{hasError}</div> : ""}
      {isLoading ? "Laddar..." : ""}
      <div className="my-3">
        <ReactMapGL
          mapboxApiAccessToken="pk.eyJ1IjoiamV3ZW5zb24iLCJhIjoiY2tkeWkxdDAxMndjaTJ0b2Rpc3p2a3pweSJ9.r_KppxmTaSixudgMmFpW7A"
          mapStyle="mapbox://styles/jewenson/ckbtk7ve70z1t1iqlcryenuzz"
          {...viewport}
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
        >
          {locationList.reverse().map((loc) => (
            <Popup closeButton={false} key={loc.id} latitude={parseFloat(loc.lat)} longitude={parseFloat(loc.lon)}>
              <div className="p-1 text-center">
                <small>
                  <Link to={`/plats/${loc.id}`}>{loc.title}</Link>
                </small>
                <br />
                <span className="temperatureSmall" style={{ color: colorTemperature(loc.temp) }}>
                  {loc.temp}&deg;C
                </span>
              </div>
            </Popup>
          ))}
        </ReactMapGL>
        <table className="container table-fixed">
          <thead>
            <tr>
              <th colSpan="3" className="text-center">
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
              <tr key={row.id}>
                <td>
                  <Link to={`/plats/${row.id}`}>{row.title}</Link>
                </td>
                <td>{row.dist} km</td>
                <td>{row.temp}&deg;C</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

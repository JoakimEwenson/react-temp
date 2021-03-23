import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Card, Table } from "react-bootstrap";
import { Popup } from "react-map-gl";
import ReactMapGL from "react-map-gl";
import { colorTemperature, getRandomCli } from "../Utils/Common";

export default function MapView({
  lat,
  long,
  locationId,
  numResults,
  hasTimeStamp,
}) {
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
    //console.log(APIURL);

    let parser = new DOMParser();
    let iconv = require("iconv-lite");
    let locationList = [];

    fetch(APIURL)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        iconv.decode(new Buffer(arrayBuffer), "utf-8").toString()
      )
      .then((str) => parser.parseFromString(str, "text/xml"))
      .then((res) => {
        let items = res.getElementsByTagName("item");
        // Iterate results and input into string
        for (let i = 0; i < items.length; i++) {
          let row = {
            id: items[i].getElementsByTagName("id")[0].childNodes[0]
              ? items[i].getElementsByTagName("id")[0].childNodes[0].nodeValue
              : null,
            title: items[i].getElementsByTagName("title")[0].childNodes[0]
              ? items[i].getElementsByTagName("title")[0].childNodes[0]
                  .nodeValue
              : null,
            temp: items[i].getElementsByTagName("temp")[0].childNodes[0]
              ? items[i].getElementsByTagName("temp")[0].childNodes[0].nodeValue
              : null,
            lat: items[i].getElementsByTagName("lat")[0].childNodes[0]
              ? items[i].getElementsByTagName("lat")[0].childNodes[0].nodeValue
              : null,
            lon: items[i].getElementsByTagName("lon")[0].childNodes[0]
              ? items[i].getElementsByTagName("lon")[0].childNodes[0].nodeValue
              : null,
            dist: items[i].getElementsByTagName("dist")[0].innerHTML
              ? items[i].getElementsByTagName("dist")[0].innerHTML
              : null,
          };
          locationList.push(row);
        }
        //console.log({ locationList });
        setLocationList(locationList);
        setViewport({
          width: defaultMapWidth,
          height: defaultMapHeight,
          latitude: Number(locationList[0].lat)
            ? Number(locationList[0].lat)
            : defaultLat,
          longitude: Number(locationList[0].lon)
            ? Number(locationList[0].lon)
            : defaultLong,
          zoom: defaultZoom,
        });
      })
      .catch((err) => {
        setError(err);
        console.error(`Error: ${err}`);
      });
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    if (lat && long && numResults) {
      getNearbyList(lat, long, numResults);
    }
    else {
      getNearbyList(defaultLat, defaultLong, 10)
    }
  }, [lat, long, locationId, numResults, hasTimeStamp]);

  return (
    <>
      {hasError ? <Alert variant="danger">{hasError}</Alert> : ""}
      {isLoading ? "Laddar..." : ""}
      <Card className="my-3">
        <ReactMapGL
          mapboxApiAccessToken="pk.eyJ1IjoiamV3ZW5zb24iLCJhIjoiY2tkeWkxdDAxMndjaTJ0b2Rpc3p2a3pweSJ9.r_KppxmTaSixudgMmFpW7A"
          mapStyle="mapbox://styles/jewenson/ckbtk7ve70z1t1iqlcryenuzz"
          {...viewport}
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
        >
          {locationList.map((loc) => (
            <Popup
              closeButton={false}
              key={loc.id}
              latitude={parseFloat(loc.lat)}
              longitude={parseFloat(loc.lon)}
            >
              <div className="p-1 text-center">
                <small><Link to={`/plats/${loc.id}`}>{loc.title}</Link></small>
                <br />
                <span
                  className="temperatureSmall"
                  style={{ color: colorTemperature(loc.temp) }}
                >
                  {loc.temp}&deg;C
                </span>
              </div>
            </Popup>
          ))}
        </ReactMapGL>
        <Table borderless responsive>
          <thead>
            <tr>
              <th colSpan="3" className="text-center">
                Kartans mätstationer
              </th>
            </tr>
            <tr>
              <th>Plats</th>
              <th>Avstånd</th>
              <th>Temperatur</th>
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
        </Table>
      </Card>
    </>
  );
}

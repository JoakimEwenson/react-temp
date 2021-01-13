import React, { useEffect, useState, PureComponent } from "react";
import { Link } from "react-router-dom";
import { Alert, Card, Table } from "react-bootstrap";
import { Popup, Marker, GeolocateControl } from "react-map-gl";
import ReactMapGL, { NavigationControl } from "react-map-gl";
import { colorTemperature, getRandomCli } from "../Utils/Common";

class Markers extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <>
        <Marker
          key={getRandomCli(4)}
          latitude={data.latitude}
          longitude={data.longitude}
          offsetTop={-16}
        >
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
      <Popup
        closeButton={false}
        key={loc.id}
        latitude={parseFloat(loc.lat)}
        longitude={parseFloat(loc.lon)}
      >
        <div className="p-1 text-center">
          <small>
            <Link to={`/plats/${loc.id}`}>{loc.title}</Link>
          </small>
          <br />
          <span
            className="temperatureSmall"
            style={{ color: colorTemperature(loc.temp) }}
          >
            {loc.temp}&deg;C
          </span>
        </div>
      </Popup>
    ));
  }
}

export default function NearbyLocations({
  lat,
  long,
  locationId,
  numResults,
  hasTimeStamp,
  showMarker = false,
}) {
  const defaultMapWidth = "100%";
  const defaultMapHeight = "75vh";
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
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?lat=${lat}&lon=${long}&num=${num}&verbose=true&amm=true&cli=${CLI}`;
    //console.log(APIURL);

    let parser = new DOMParser();
    let iconv = require("iconv-lite");
    let locationList = [];

    fetch(APIURL)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        iconv.decode(new Buffer(arrayBuffer), "iso-88591").toString()
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
      })
      .catch((err) => {
        setError(err);
        console.error(`Error: ${err}`);
      });
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getNearbyList(lat, long, numResults);
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
          <div
            className="p-2"
            style={{ position: "absolute", right: 0, zIndex: 99 }}
          >
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
                    latitude: pos.coords.latitude
                      ? pos.coords.latitude
                      : defaultLat,
                    longitude: pos.coords.longitude
                      ? pos.coords.longitude
                      : defaultLong,
                    zoom: defaultZoom,
                  });
                  getNearbyList(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    numResults
                  );
                }}
              />
            ) : (
              ""
            )}
          </div>
          {locationList ? <Popups data={locationList} /> : ""}
          {showMarker ? <Markers data={coords} /> : ""}
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

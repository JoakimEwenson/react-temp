import React, { useEffect, useState } from "react";
import { Table, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRandomCli, colorTemperature } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function NearbyList() {
  const [locations, setLocations] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState();

  const setGeoLocation = function (pos) {
    console.log(pos);
    setLatitude(pos.coords.latitude);
    setLongitude(pos.coords.longitude);
    getNearbyList(pos.coords.latitude, pos.coords.longitude);
  };

  const positionErrorHandler = function (err) {
    console.error(err);
    setError(err.message);
    setLoading(false);
  };

  // Get a list of locations
  async function getNearbyList(lat, long) {
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?lat=${lat}&lon=${long}&num=5&dc=true&verbose=true&amm=true&cli=${CLI}`;
    console.log(APIURL);

    let parser = new DOMParser();
    let locationList = [];

    fetch(APIURL)
      .then((response) => response.text())
      .then((str) => parser.parseFromString(str, "text/xml"))
      .then((res) => {
        let items = res.getElementsByTagName("item");
        // Iterate results and input into string
        for (let i = 0; i < items.length; i++) {
          let row = {
            id: items[i].getElementsByTagName("id")[0].innerHTML,
            title: items[i].getElementsByTagName("title")[0].innerHTML,
            temp: items[i].getElementsByTagName("temp")[0].innerHTML,
            dist: items[i].getElementsByTagName("dist")[0].innerHTML
              ? items[i].getElementsByTagName("dist")[0].innerHTML
              : null,
          };
          locationList.push(row);
        }
        console.log({ locationList });
        setLocations(locationList);
      })
      .catch((err) => console.error(`Error: ${err}`));
    setLoading(false);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        setGeoLocation,
        positionErrorHandler,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 500,
        }
      );
    }
  }, []);

  return (
    <>
      {isLoading ? <LoadingSpinner /> : ""}
      {hasError ? (
        <Alert variant="danger">GeoLocation Error: {hasError}</Alert>
      ) : !isLoading ? (
        <Card className="my-3">
          <Table borderless responsive>
            <thead>
              <tr>
                <th>Plats</th>
                <th>Avstånd</th>
                <th>Temperatur</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link to={`/plats/${row.id}`} className="text-muted">{row.title}</Link>
                  </td>
                  <td>{row.dist && row.dist} km</td>
                  <td style={{ color: colorTemperature(row.temp)}}>{row.temp}&deg;C</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      ) : (
        ""
      )}
      {latitude && longitude && (
        <Alert variant="info" className="text-center">
          <p>
            <b>Din position:</b>
            <br />
            <small>
              lat: {latitude} - long: {longitude}
            </small>
          </p>
        </Alert>
      )}
    </>
  );
}

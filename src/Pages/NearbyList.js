import React, { useEffect, useState } from "react";
import { Table, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRandomCli } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function NearbyList() {
  const [locations, setLocations] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const setGeoLocation = function (pos) {
    console.log(pos);
    setLatitude(pos.coords.latitude);
    setLongitude(pos.coords.longitude);
    getNearbyList(latitude, longitude);
  };

  // Get a list of locations
  async function getNearbyList(lat, long) {
    const CLI = getRandomCli(12);
    //const lat = "59.3722000350212";
    //const long = "13.498182325544061";
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?lat=${lat}&lon=${long}&num=5&verbose=true&amm=true&cli=${CLI}`;
    console.log(APIURL);

    let parser = new DOMParser();
    let locationList = [];

    fetch(APIURL)
      .then((response) => response.text())
      .then((str) => parser.parseFromString(str, "text/xml"))
      .then((res) => {
        let items = res.getElementsByTagName("item");
        // Iterate results and input into string
        for (let i = 1; i < items.length; i++) {
          let row = {
            id: items[i].getElementsByTagName("id")[0].innerHTML,
            title: items[i].getElementsByTagName("title")[0].innerHTML,
            temp: items[i].getElementsByTagName("temp")[0].innerHTML,
            dist: items[i].getElementsByTagName("dist")[0].innerHTML,
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
      navigator.geolocation.getCurrentPosition(setGeoLocation, null, {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 500,
      });
    }
  }, []);

  return (
    <>
      {isLoading ? <LoadingSpinner /> : ""}
      {latitude && longitude && (
        <Card>
          <Card.Body className="text-center">
            <b>Din position:</b>
            <br />
            lat: {latitude} - long: {longitude}
          </Card.Body>
        </Card>
      )}
      <Card className="my-3">
        <Table borderless>
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

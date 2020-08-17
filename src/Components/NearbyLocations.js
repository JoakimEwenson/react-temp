import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRandomCli } from "../Utils/Common";
import LoadingSpinner from "./LoadingSpinner";

export default function NearbyLocations({ lat, long, locationId, numResults, hasTimeStamp }) {
  const [locations, setLocations] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState();

  async function getNearbyLocations(lat, long, num) {
    setLoading(true);
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?lat=${lat}&lon=${long}&num=${num}&verbose=true&cli=${CLI}`;
    console.log(
      `${APIURL} requested at ${new Date().toLocaleTimeString("sv-SE")}`
    );

    let parser = new DOMParser();
    let iconv = require("iconv-lite");
    let locationList = [];

    fetch(APIURL)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        iconv.decode(new Buffer(arrayBuffer), "iso-8859-1").toString()
      )
      .then((str) => parser.parseFromString(str, "text/xml"))
      .then((res) => {
        let items = res.getElementsByTagName("item");
        // Iterate results and input into object list
        for (let i = 0; i < items.length; i++) {
          if (
            items[i].getElementsByTagName("id")[0].childNodes[0].nodeValue ===
            locationId
          ) {
            continue;
          }
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
            dist: items[i].getElementsByTagName("dist")[0].childNodes[0]
              ? items[i].getElementsByTagName("dist")[0].childNodes[0].nodeValue
              : null,
          };
          locationList.push(row);
        }
        setLocations(locationList);
      })
      .catch((err) => {
        setError(err);
        console.error(`Error: ${err}`);
      });
    setLoading(false);
  }

  useEffect(() => {
    getNearbyLocations(lat, long, numResults);
  }, [lat, long, numResults, hasTimeStamp]);

  return (
    <>
      {hasError ? <Alert variant="danger">{hasError}</Alert> : ""}
      {isLoading ? <LoadingSpinner /> : ""}
      <Table borderless responsive>
        <thead>
          <tr>
            <th colSpan="3" className="text-center">
              Närliggande mätstationer
            </th>
          </tr>
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
    </>
  );
}

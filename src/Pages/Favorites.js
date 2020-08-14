import React, { useEffect, useState } from "react";
import { Card, Alert, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRandomCli } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function Favorites() {
  const [isLoading, setLoading] = useState(false);
  const [hasErrors, setErrors] = useState(null);
  const [locations, setLocationData] = useState([]);
  const [locationList, setLocationList] = useState([
    "orrholmen",
    "romstad",
    "stampen",
  ]);

  // Get a list of locations
  async function getLocationData(favlist) {
    const favs = favlist.join(",");
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?p=${favs}&dc=true&verbose=true&amm=true&cli=${CLI}`;
    console.log(APIURL);

    let parser = new DOMParser();
    let iconv = require("iconv-lite");
    let favoritesList = [];

    fetch(APIURL)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => iconv.decode(new Buffer(arrayBuffer), 'iso-8859-1').toString())
      .then((str) => parser.parseFromString(str, "text/xml"))
      .then((res) => {
        let items = res.getElementsByTagName("item");

        for (let i = 0; i < items.length; i++) {
          let location = {
            id: items[i].getElementsByTagName("id")[0].childNodes[0].nodeValue
              ? items[i].getElementsByTagName("id")[0].childNodes[0].nodeValue
              : null,
            title: items[i].getElementsByTagName("title")[0].childNodes[0]
              .nodeValue
              ? items[i].getElementsByTagName("title")[0].childNodes[0]
                  .nodeValue
              : null,
            temp: items[i].getElementsByTagName("temp")[0].childNodes[0]
              .nodeValue
              ? items[i].getElementsByTagName("temp")[0].childNodes[0].nodeValue
              : null,
            lat: items[i].getElementsByTagName("lat")[0].childNodes[0].nodeValue
              ? items[i].getElementsByTagName("lat")[0].childNodes[0].nodeValue
              : null,
            lon: items[i].getElementsByTagName("lon")[0].childNodes[0].nodeValue
              ? items[i].getElementsByTagName("lon")[0].childNodes[0].nodeValue
              : null,
            lastUpdate: items[i].getElementsByTagName("lastUpdate")[0]
              .childNodes[0].nodeValue
              ? items[i].getElementsByTagName("lastUpdate")[0].childNodes[0]
                  .nodeValue
              : null,
            kommun: items[i].getElementsByTagName("kommun")[0].childNodes[0]
              .nodeValue
              ? items[i]
                  .getElementsByTagName("kommun")[0]
                  .childNodes[0].nodeValue.toString()
              : null,
            lan: items[i].getElementsByTagName("lan")[0].childNodes[0].nodeValue
              ? items[i].getElementsByTagName("lan")[0].childNodes[0].nodeValue
              : null,
            sourceInfo: items[i].getElementsByTagName("sourceInfo")[0]
              .childNodes[0].nodeValue
              ? items[i].getElementsByTagName("sourceInfo")[0].childNodes[0]
                  .nodeValue
              : null,
            url: items[i].getElementsByTagName("url")[0].childNodes[0].nodeValue
              ? items[i].getElementsByTagName("url")[0].childNodes[0].nodeValue
              : null,
            ammRange: items[i].getElementsByTagName("ammRange")[0].childNodes[0]
              .nodeValue
              ? items[i].getElementsByTagName("ammRange")[0].childNodes[0]
                  .nodeValue
              : null,
            average: items[i].getElementsByTagName("average")[0].childNodes[0]
              .nodeValue
              ? items[i].getElementsByTagName("average")[0].childNodes[0]
                  .nodeValue
              : null,
            min: items[i].getElementsByTagName("min")[0].childNodes[0].nodeValue
              ? items[i].getElementsByTagName("min")[0].childNodes[0].nodeValue
              : null,
            minTime: items[i].getElementsByTagName("minTime")[0].childNodes[0]
              .nodeValue
              ? items[i].getElementsByTagName("minTime")[0].childNodes[0]
                  .nodeValue
              : null,
            max: items[i].getElementsByTagName("max")[0].childNodes[0].nodeValue
              ? items[i].getElementsByTagName("max")[0].childNodes[0].nodeValue
              : null,
            maxTime: items[i].getElementsByTagName("maxTime")[0].childNodes[0]
              .nodeValue
              ? items[i].getElementsByTagName("maxTime")[0].childNodes[0]
                  .nodeValue
              : null,
          };
          favoritesList.push(location);
        }
        console.log({ favoritesList });
        setLocationData(favoritesList);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        setErrors(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    getLocationData(locationList);
  }, [locationList]);
  return (
    <>
      {hasErrors ? <Alert variant="danger">{hasErrors.message}</Alert> : ""}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <Table borderless responsive>
            <thead>
              <tr>
                <th>Plats</th>
                <th>Temperatur</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link to={`/plats/${row.id}`} className="text-muted">
                      {row.title}
                    </Link>
                  </td>
                  <td>{row.temp}&deg;C</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { Table, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRandomCli } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function LocationList() {
  const [locations, setLocations] = useState([]);
  const [hasErrors, setErrors] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // Get a list of locations
  async function getLocationList() {
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?verbose=true&dc=true&cli=${CLI}`;
    console.log(APIURL);

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
        // Iterate results and input into string
        for (let i = 0; i < items.length; i++) {
          let row = {
            id: items[i].getElementsByTagName("id")[0].innerHTML
              ? items[i].getElementsByTagName("id")[0].innerHTML
              : null,
            title: items[i].getElementsByTagName("title")[0].innerHTML
              ? items[i].getElementsByTagName("title")[0].innerHTML
              : null,
            temp: items[i].getElementsByTagName("temp")[0].innerHTML
              ? items[i].getElementsByTagName("temp")[0].innerHTML
              : null,
            lat: items[i].getElementsByTagName("lat")[0].innerHTML
              ? items[i].getElementsByTagName("lat")[0].innerHTML
              : null,
            lon: items[i].getElementsByTagName("lon")[0].innerHTML
              ? items[i].getElementsByTagName("lon")[0].innerHTML
              : null,
            lastUpdate: items[i].getElementsByTagName("lastUpdate")[0].innerHTML
              ? items[i].getElementsByTagName("lastUpdate")[0].innerHTML
              : null,
            kommun: items[i].getElementsByTagName("kommun")[0].innerHTML
              ? items[i].getElementsByTagName("kommun")[0].innerHTML
              : null,
            lan: items[i].getElementsByTagName("lan")[0].innerHTML
              ? items[i].getElementsByTagName("lan")[0].innerHTML
              : null,
            sourceInfo: items[i].getElementsByTagName("sourceInfo")[0].innerHTML
              ? items[i].getElementsByTagName("sourceInfo")[0].innerHTML
              : null,
            url: items[i].getElementsByTagName("url")[0].innerHTML
              ? items[i].getElementsByTagName("url")[0].innerHTML
              : null,
          };
          locationList.push(row);
        }
        console.log({ locationList });
        setLocations(locationList);
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
    getLocationList();
  }, []);

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

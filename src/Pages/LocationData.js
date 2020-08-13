import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Alert } from "react-bootstrap";
import { getRandomCli, colorTemperature } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function LocationData() {
  const { platsId } = useParams();
  const [hasErrors, setErrors] = useState(null);
  const [locationData, setLocationData] = useState({
    title: null,
    id: null,
    temp: null,
    lat: null,
    lon: null,
    lastUpdate: null,
    kommun: null,
    lan: null,
    sourceInfo: null,
    url: null,
    ammRange: null,
    average: null,
    min: null,
    minTime: null,
    max: null,
    maxTime: null,
  });

  // Get a list of locations
  async function getLocationData(loc) {
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?p=${loc}&dc=true&verbose=true&amm=true&cli=${CLI}`;
    console.log(APIURL);

    let parser = new DOMParser();
    let iconv = require("iconv-lite");

    fetch(APIURL)
      .then((response) => response.text())
      .then((str) =>
        parser.parseFromString(
          iconv.encode(new Buffer(str), "ISO-8859-1"),
          "text/xml"
        )
      )
      .then((res) => {
        let items = res.getElementsByTagName("item");

        let location = {
          id: items[0].getElementsByTagName("id")[0].childNodes[0].nodeValue
            ? items[0].getElementsByTagName("id")[0].childNodes[0].nodeValue
            : null,
          title: items[0].getElementsByTagName("title")[0].childNodes[0]
            .nodeValue
            ? items[0].getElementsByTagName("title")[0].childNodes[0].nodeValue
            : null,
          temp: items[0].getElementsByTagName("temp")[0].childNodes[0].nodeValue
            ? items[0].getElementsByTagName("temp")[0].childNodes[0].nodeValue
            : null,
          lat: items[0].getElementsByTagName("lat")[0].childNodes[0].nodeValue
            ? items[0].getElementsByTagName("lat")[0].childNodes[0].nodeValue
            : null,
          lon: items[0].getElementsByTagName("lon")[0].childNodes[0].nodeValue
            ? items[0].getElementsByTagName("lon")[0].childNodes[0].nodeValue
            : null,
          lastUpdate: items[0].getElementsByTagName("lastUpdate")[0]
            .childNodes[0].nodeValue
            ? items[0].getElementsByTagName("lastUpdate")[0].childNodes[0]
                .nodeValue
            : null,
          kommun: items[0].getElementsByTagName("kommun")[0].childNodes[0]
            .nodeValue
            ? items[0]
                .getElementsByTagName("kommun")[0]
                .childNodes[0].nodeValue.toString()
            : null,
          lan: items[0].getElementsByTagName("lan")[0].childNodes[0].nodeValue
            ? items[0].getElementsByTagName("lan")[0].childNodes[0].nodeValue
            : null,
          sourceInfo: items[0].getElementsByTagName("sourceInfo")[0]
            .childNodes[0].nodeValue
            ? items[0].getElementsByTagName("sourceInfo")[0].childNodes[0]
                .nodeValue
            : null,
          url: items[0].getElementsByTagName("url")[0].childNodes[0].nodeValue
            ? items[0].getElementsByTagName("url")[0].childNodes[0].nodeValue
            : null,
          ammRange: items[0].getElementsByTagName("ammRange")[0].childNodes[0]
            .nodeValue
            ? items[0].getElementsByTagName("ammRange")[0].childNodes[0]
                .nodeValue
            : null,
          average: items[0].getElementsByTagName("average")[0].childNodes[0]
            .nodeValue
            ? items[0].getElementsByTagName("average")[0].childNodes[0]
                .nodeValue
            : null,
          min: items[0].getElementsByTagName("min")[0].childNodes[0].nodeValue
            ? items[0].getElementsByTagName("min")[0].childNodes[0].nodeValue
            : null,
          minTime: items[0].getElementsByTagName("minTime")[0].childNodes[0]
            .nodeValue
            ? items[0].getElementsByTagName("minTime")[0].childNodes[0]
                .nodeValue
            : null,
          max: items[0].getElementsByTagName("max")[0].childNodes[0].nodeValue
            ? items[0].getElementsByTagName("max")[0].childNodes[0].nodeValue
            : null,
          maxTime: items[0].getElementsByTagName("maxTime")[0].childNodes[0]
            .nodeValue
            ? items[0].getElementsByTagName("maxTime")[0].childNodes[0]
                .nodeValue
            : null,
        };
        console.log(location);
        setLocationData(location);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        setErrors(err);
      });
  }

  useEffect(() => {
    getLocationData(platsId);
  }, [platsId]);

  return (
    <>
      {hasErrors && <Alert variant="danger">{hasErrors.message}</Alert>}
      {locationData.temp ? (
        <Card className="my-3">
          <Card.Body>
            <div className="text-center">
              <Card.Title className="citytitle">
                {locationData.title}
              </Card.Title>
              {locationData.kommun && locationData.lan && (
                <Card.Subtitle className="text-muted">
                  {locationData.kommun} - {locationData.lan}
                </Card.Subtitle>
              )}

              <h1
                className="temperature p-3"
                style={{ color: colorTemperature(locationData.temp) }}
              >
                {locationData.temp}°C
              </h1>

              <p>
                <small className="text-muted">{locationData.lastUpdate}</small>
                <br />
                <small className="text-muted">
                  min: {locationData.min}°c • max: {locationData.max}°c • medel:{" "}
                  {locationData.average}°c
                </small>
              </p>
            </div>
          </Card.Body>
          <p className="align-text-bottom text-right m-1">
            <small>
              <a href={locationData.url} className="text-muted">
                {locationData.sourceInfo}
              </a>
            </small>
          </p>
        </Card>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRandomCli } from "../Utils/Common";
import { Card, Alert } from "react-bootstrap";

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

    fetch(APIURL)
      .then((response) => response.text())
      .then((str) => parser.parseFromString(str, "text/xml"))
      .then((res) => {
        let items = res.getElementsByTagName("item");
        let location = {
          id: items[0].getElementsByTagName("id")[0].innerHTML
            ? items[0].getElementsByTagName("id")[0].innerHTML
            : null,
          title: items[0].getElementsByTagName("title")[0].innerHTML
            ? decodeURIComponent(items[0].getElementsByTagName("title")[0].innerHTML)
            : null,
          temp: items[0].getElementsByTagName("temp")[0].innerHTML
            ? items[0].getElementsByTagName("temp")[0].innerHTML
            : null,
          lat: items[0].getElementsByTagName("lat")[0].innerHTML
            ? items[0].getElementsByTagName("lat")[0].innerHTML
            : null,
          lon: items[0].getElementsByTagName("lon")[0].innerHTML
            ? items[0].getElementsByTagName("lon")[0].innerHTML
            : null,
          lastUpdate: items[0].getElementsByTagName("lastUpdate")[0].innerHTML
            ? items[0].getElementsByTagName("lastUpdate")[0].innerHTML
            : null,
          kommun: items[0].getElementsByTagName("kommun")[0].innerHTML
            ? items[0].getElementsByTagName("kommun")[0].innerHTML
            : null,
          lan: items[0].getElementsByTagName("lan")[0].innerHTML
            ? items[0].getElementsByTagName("lan")[0].innerHTML
            : null,
          sourceInfo: items[0].getElementsByTagName("sourceInfo")[0].innerHTML
            ? items[0].getElementsByTagName("sourceInfo")[0].innerHTML
            : null,
          url: items[0].getElementsByTagName("url")[0].innerHTML
            ? items[0].getElementsByTagName("url")[0].innerHTML
            : null,
          ammRange: items[0].getElementsByTagName("ammRange")[0].innerHTML
            ? items[0].getElementsByTagName("ammRange")[0].innerHTML
            : null,
          average: items[0].getElementsByTagName("average")[0].innerHTML
            ? items[0].getElementsByTagName("average")[0].innerHTML
            : null,
          min: items[0].getElementsByTagName("min")[0].innerHTML
            ? items[0].getElementsByTagName("min")[0].innerHTML
            : null,
          minTime: items[0].getElementsByTagName("minTime")[0].innerHTML
            ? items[0].getElementsByTagName("minTime")[0].innerHTML
            : null,
          max: items[0].getElementsByTagName("max")[0].innerHTML
            ? items[0].getElementsByTagName("max")[0].innerHTML
            : null,
          maxTime: items[0].getElementsByTagName("maxTime")[0].innerHTML
            ? items[0].getElementsByTagName("maxTime")[0].innerHTML
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
      {hasErrors && (<Alert variant="danger">{hasErrors.message}</Alert>)}
      {locationData && (
        <Card className="my-3">
          <Card.Body>
            <div className="text-center">
              <Card.Title>{locationData.title}</Card.Title>
              {locationData.kommun && locationData.lan && (
                <Card.Subtitle>
                  {locationData.kommun} - {locationData.lan}
                </Card.Subtitle>
              )}
              <h1>{locationData.temp}°C</h1>
              <h5>{locationData.lastUpdate}</h5>
            </div>
            <p className="text-right">
              <small>
                <a href={locationData.url}>{locationData.sourceInfo}</a>
              </small>
            </p>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

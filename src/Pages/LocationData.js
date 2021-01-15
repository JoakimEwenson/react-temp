import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Alert } from "react-bootstrap";

import {
  getRandomCli,
  colorTemperature,
  isOldTimeStamp,
  removeFavorite,
  addFavorite,
  setHome,
  removeHome,
} from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";
import NearbyLocations from "../Components/NearbyLocations";

export default function LocationData({
  userFavorites,
  setUserFavorites,
  userHome,
  setUserHome,
  hideMap,
}) {
  const { platsId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [hasErrors, setErrors] = useState(null);
  const [hasTimeStamp, setTimeStamp] = useState(null);
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
    setLoading(true);
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?p=${loc}&verbose=true&amm=true&cli=${CLI}`;
    /*     console.log(
      `${APIURL} requested at ${new Date().toLocaleTimeString("sv-SE")}`
    ); */

    let parser = new DOMParser();
    let iconv = require("iconv-lite");

    fetch(APIURL)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        iconv.decode(new Buffer(arrayBuffer), "iso-8859-1").toString()
      )
      .then((str) => parser.parseFromString(str, "text/xml"))
      .then((res) => {
        let items = res.getElementsByTagName("item");

        if (items.length > 0) {
          let location = {
            id: items[0].getElementsByTagName("id")[0].childNodes[0]
              ? items[0].getElementsByTagName("id")[0].childNodes[0].nodeValue
              : null,
            title: items[0].getElementsByTagName("title")[0].childNodes[0]
              ? items[0].getElementsByTagName("title")[0].childNodes[0]
                  .nodeValue
              : null,
            temp: items[0].getElementsByTagName("temp")[0].childNodes[0]
              ? items[0].getElementsByTagName("temp")[0].childNodes[0].nodeValue
              : null,
            lat: items[0].getElementsByTagName("lat")[0].childNodes[0]
              ? items[0].getElementsByTagName("lat")[0].childNodes[0].nodeValue
              : null,
            lon: items[0].getElementsByTagName("lon")[0].childNodes[0]
              ? items[0].getElementsByTagName("lon")[0].childNodes[0].nodeValue
              : null,
            lastUpdate: items[0].getElementsByTagName("lastUpdate")[0]
              .childNodes[0]
              ? items[0].getElementsByTagName("lastUpdate")[0].childNodes[0]
                  .nodeValue
              : null,
            kommun: items[0].getElementsByTagName("kommun")[0].childNodes[0]
              ? items[0]
                  .getElementsByTagName("kommun")[0]
                  .childNodes[0].nodeValue.toString()
              : null,
            lan: items[0].getElementsByTagName("lan")[0].childNodes[0]
              ? items[0].getElementsByTagName("lan")[0].childNodes[0].nodeValue
              : null,
            sourceInfo: items[0].getElementsByTagName("sourceInfo")[0]
              .childNodes[0]
              ? items[0].getElementsByTagName("sourceInfo")[0].childNodes[0]
                  .nodeValue
              : null,
            url: items[0].getElementsByTagName("url")[0].childNodes[0]
              ? items[0].getElementsByTagName("url")[0].childNodes[0].nodeValue
              : "https://www.temperatur.nu",
            ammRange: items[0].getElementsByTagName("ammRange")[0].childNodes[0]
              ? items[0].getElementsByTagName("ammRange")[0].childNodes[0]
                  .nodeValue
              : null,
            average: items[0].getElementsByTagName("average")[0].childNodes[0]
              ? items[0].getElementsByTagName("average")[0].childNodes[0]
                  .nodeValue
              : null,
            min: items[0].getElementsByTagName("min")[0].childNodes[0]
              ? items[0].getElementsByTagName("min")[0].childNodes[0].nodeValue
              : null,
            minTime: items[0].getElementsByTagName("minTime")[0].childNodes[0]
              ? items[0].getElementsByTagName("minTime")[0].childNodes[0]
                  .nodeValue
              : null,
            max: items[0].getElementsByTagName("max")[0].childNodes[0]
              ? items[0].getElementsByTagName("max")[0].childNodes[0].nodeValue
              : null,
            maxTime: items[0].getElementsByTagName("maxTime")[0].childNodes[0]
              ? items[0].getElementsByTagName("maxTime")[0].childNodes[0]
                  .nodeValue
              : null,
          };
          document.title = `${location.temp}°C vid ${location.title}`;
          setLocationData(location);
          setTimeStamp(new Date().getTime());
        }
        setErrors(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        setErrors(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    let interval;

    if (platsId) {
      getLocationData(platsId);

      interval = setInterval(() => {
        getLocationData(platsId);
      }, 300000);
    }

    return function cleanup() {
      clearInterval(interval);
    };
  }, [platsId]);

  return (
    <>
      {hasErrors && (
        <Alert variant="danger" className="my-3">
          {hasErrors.message}
        </Alert>
      )}
      {locationData.temp ? (
        <>
          {isOldTimeStamp(locationData.lastUpdate) ? (
            <Alert variant="danger" className="my-3 text-center">
              Temperaturen har inte uppdaterats de senaste 30 minuterna.
            </Alert>
          ) : (
            ""
          )}
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
                  <small className="text-muted">
                    {locationData.lastUpdate}
                  </small>
                  <br />
                  <small className="text-muted">
                    <span className="ammTooltip" title={locationData.minTime}>
                      min: {locationData.min}°c
                    </span>{" "}
                    •{" "}
                    <span className="ammTooltip" title={locationData.maxTime}>
                      max: {locationData.max}°c
                    </span>{" "}
                    • medel: {locationData.average}°c
                  </small>
                </p>
                <p className="iconRow">
                  {userHome === locationData.id ? (
                    <svg
                      className="uiIcon uiIconHouseSelected"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        removeHome(locationData.id);
                        setUserHome(null);
                      }}
                      title="Ta bort från startsidan"
                    >
                      <path
                        d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="uiIcon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        setHome(locationData.id);
                        setUserHome(locationData.id);
                      }}
                      title="Ställ in som startsidan"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  )}
                  {userFavorites.includes(locationData.id) ? (
                    <svg
                      className="uiIcon uiIconFavorited"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        let tempFavs = removeFavorite(locationData.id);
                        setUserFavorites(tempFavs);
                      }}
                      title="Ta bort från favoriter"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="uiIcon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        let tempFavs = addFavorite(locationData.id);
                        setUserFavorites(tempFavs);
                      }}
                      title="Lägg till i favoriter"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      ></path>
                    </svg>
                  )}
                  {isLoading ? (
                    <svg
                      className="uiIcon uiIconRefreshing"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="uiIcon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        getLocationData(platsId);
                      }}
                      title="Uppdatera informationen"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                  )}
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
          {hideMap ? (
            ""
          ) : (
            <>
              <NearbyLocations
                lat={locationData.lat}
                long={locationData.lon}
                locationId={locationData.id}
                hasTimeStamp={hasTimeStamp}
                numResults="10"
                showMarker={false}
              />
            </>
          )}
        </>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

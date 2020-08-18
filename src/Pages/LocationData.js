import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Alert } from "react-bootstrap";

import {
  getRandomCli,
  colorTemperature,
  timeChecker,
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
}) {
  //console.log({ userFavorites });
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
    console.log(
      `${APIURL} requested at ${new Date().toLocaleTimeString("sv-SE")}`
    );

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

        let location = {
          id: items[0].getElementsByTagName("id")[0].childNodes[0]
            ? items[0].getElementsByTagName("id")[0].childNodes[0].nodeValue
            : null,
          title: items[0].getElementsByTagName("title")[0].childNodes[0]
            ? items[0].getElementsByTagName("title")[0].childNodes[0].nodeValue
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
          {timeChecker(locationData.lastUpdate) ? (
            ""
          ) : (
            <Alert variant="danger" className="my-3 text-center">
              Temperaturen har inte uppdaterats de senaste 30 minuterna.
            </Alert>
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
                    <i
                      className="fas fa-house-user uiIcon uiIconHouseSelected"
                      onClick={() => {
                        removeHome(locationData.id);
                        setUserHome(null);
                      }}
                      title="Ta bort från startsidan"
                    ></i>
                  ) : (
                    <i
                      className="fas fa-home uiIcon"
                      onClick={() => {
                        setHome(locationData.id);
                        setUserHome(locationData.id);
                      }}
                      title="Ställ in som startsidan"
                    ></i>
                  )}
                  {userFavorites.includes(locationData.id) ? (
                    <i
                      className="fas fa-star uiIcon uiIconFavorited"
                      onClick={() => {
                        let tempFavs = removeFavorite(locationData.id);
                        setUserFavorites(tempFavs);
                      }}
                      title="Ta bort från favoriter"
                    ></i>
                  ) : (
                    <i
                      className="far fa-star uiIcon"
                      onClick={() => {
                        let tempFavs = addFavorite(locationData.id);
                        setUserFavorites(tempFavs);
                      }}
                      title="Lägg till i favoriter"
                    ></i>
                  )}
                  {isLoading ? (
                    <i className="fas fa-sync fa-spin uiIcon uiIconRefreshing"></i>
                  ) : (
                    <i
                      className="fas fa-sync-alt uiIcon"
                      onClick={() => {
                        getLocationData(platsId);
                      }}
                      title="Uppdatera informationen"
                    ></i>
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
          <NearbyLocations
            lat={locationData.lat}
            long={locationData.lon}
            locationId={locationData.id}
            hasTimeStamp={hasTimeStamp}
            numResults="10"
          />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { Table, Card, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getRandomCli, removeFavorite, addFavorite } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function NearbyList({ userFavorites, setUserFavorites }) {
  const [locations, setLocations] = useState([]);
  const [currentPosition, setCurrentPosition] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState();

  const setGeoLocation = function (pos) {
    setCurrentPosition(pos);
    console.log(pos);
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
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?lat=${lat}&lon=${long}&num=5&verbose=true&amm=true&cli=${CLI}`;
    console.log(APIURL);

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
            id: items[i].getElementsByTagName("id")[0].innerHTML,
            title: items[i].getElementsByTagName("title")[0].innerHTML,
            temp: items[i].getElementsByTagName("temp")[0].innerHTML,
            dist: items[i].getElementsByTagName("dist")[0].innerHTML
              ? items[i].getElementsByTagName("dist")[0].innerHTML
              : null,
          };
          locationList.push(row);
        }
        document.title = "Visar närliggande mätpunkter";
        console.log({ locationList });
        setLocations(locationList);
      })
      .catch((err) => console.error(`Error: ${err}`));
    setLoading(false);
  }

  useEffect(() => {
    let interval;

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

      interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          setGeoLocation,
          positionErrorHandler,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 500,
          }
        );
      }, 600000);
    }

    return () => {
      clearInterval(interval);
    }
  }, [currentPosition]);

  return (
    <>
      {isLoading ? <LoadingSpinner /> : ""}
      {hasError ? (
        <Alert variant="danger" className="my-3">
          GeoLocation Error: {hasError}
        </Alert>
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
                    <Link to={`/plats/${row.id}`}>{row.title}</Link>
                  </td>
                  <td>{row.dist && row.dist} km</td>
                  <td>{row.temp}&deg;C</td>
                  <td>
                    {userFavorites.includes(row.id) ? (
                      <i
                        className="fas fa-star uiIcon uiIconFavorited"
                        onClick={() => {
                          let tempFavs = removeFavorite(row.id);
                          setUserFavorites(tempFavs);
                        }}
                      ></i>
                    ) : (
                      <i
                        className="far fa-star uiIcon"
                        onClick={() => {
                          let tempFavs = addFavorite(row.id);
                          setUserFavorites(tempFavs);
                        }}
                      ></i>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="my-3 mx-auto">
            <Button
              title="Ladda om listan"
              onClick={() => {
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
              }}
              className="btn btn-dark"
            >
              {isLoading ? (
                <i className="fas fa-sync fa-spin mr-1"></i>
              ) : (
                <i className="fas fa-sync-alt mr-1"></i>
              )}
              Uppdatera listan
            </Button>
          </div>
        </Card>
      ) : (
        ""
      )}
    </>
  );
}

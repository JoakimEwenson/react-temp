import React, { useEffect, useState } from "react";
import { Table, Card, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { removeFavorite, addFavorite } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";
import NearbyLocations from "../Components/NearbyLocations";

export default function NearbyList({ userFavorites, setUserFavorites }) {
  const [locations] = useState([]);
  const [coords, setCoords] = useState();
  const [isLoading, setLoading] = useState(false);
  const [hasError, setError] = useState();

  document.title = "Visar närliggande mätpunkter";

  const setGeoLocation = function (pos) {
    //console.log(pos);
    setCoords(pos.coords);
    //getNearbyList(pos.coords.latitude, pos.coords.longitude);
  };

  const positionErrorHandler = function (err) {
    console.error(err);
    setError(err.message);
    setLoading(false);
  };

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
    };
  }, []);

  if (coords) {
    return (
      <NearbyLocations
        lat={coords.latitude}
        long={coords.longitude}
        numResults="10"
        showMarker={true}
      />
    );
  } else {
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
}

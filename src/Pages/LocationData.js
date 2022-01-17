import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { colorTemperature, isOldTimeStamp, removeFavorite, addFavorite, setHome, removeHome } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";
import NearbyLocations from "../Components/NearbyLocations";
import apiCaller from "../Utils/apiCaller";

export default function LocationData({ userFavorites, setUserFavorites, userHome, setUserHome, hideMap }) {
  const { platsId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [hasErrors, setErrors] = useState(null);
  const [hasTimeStamp] = useState(null);
  const [locationData, setLocationData] = useState(null);

  // Get a list of locations
  async function getLocationData(loc) {
    try {
      const result = await apiCaller(`p=${loc}&verbose=true&amm=true`);
      const data = await result.json();
      if (data?.stations?.length > 0) {
        setLocationData(data?.stations[0]);
        document.title = `${data?.stations[0]?.temp}°C vid ${data?.stations[0]?.title}`;
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setErrors(error);

      setLoading(false);
    }
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
        <div className="mx-auto my-3 p-3 text-center border bg-red-600 text-white font-semibold shadow-sm max-w-5xl">
          {hasErrors.message}
        </div>
      )}
      {locationData?.temp ? (
        <>
          {isOldTimeStamp(locationData?.lastUpdate) ? (
            <div className="mx-auto my-3 p-3 text-center border bg-red-600 text-white font-semibold shadow-sm max-w-5xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Temperaturen har inte uppdaterats de senaste 30 minuterna.
            </div>
          ) : (
            ""
          )}
          <div className="container bg-white shadow-sm max-w-5xl my-3 p-3">
            <div className="text-center">
              <div className="citytitle">{locationData?.title}</div>
              {locationData?.kommun && locationData?.lan && (
                <div className="text-muted">
                  {locationData?.kommun} - {locationData?.lan}
                </div>
              )}
              <h1 className="temperature p-3" style={{ color: colorTemperature(locationData?.temp) }}>
                {locationData?.temp}°C
              </h1>
              <p>
                <small className="text-muted">{locationData?.lastUpdate}</small>
                <br />
                <small className="text-muted">
                  <span className="ammTooltip" title={locationData?.minTime}>
                    min: {locationData?.min}°c
                  </span>{" "}
                  •{" "}
                  <span className="ammTooltip" title={locationData?.maxTime}>
                    max: {locationData?.max}°c
                  </span>{" "}
                  • medel: {locationData?.average}°c
                </small>
              </p>
              <div className="flex items-center justify-center mx-auto text-center">
                {userHome === locationData?.id ? (
                  <svg
                    className="uiIcon uiIconHouseSelected"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                      removeHome(locationData?.id);
                      setUserHome(null);
                    }}
                    title="Ta bort från startsidan"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                ) : (
                  <svg
                    className="uiIcon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                      setHome(locationData?.id);
                      setUserHome(locationData?.id);
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
                {userFavorites.includes(locationData?.id) ? (
                  <svg
                    className="uiIcon uiIconFavorited"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                      let tempFavs = removeFavorite(locationData?.id);
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
                      let tempFavs = addFavorite(locationData?.id);
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
              </div>
            </div>
            <p className="align-text-bottom text-right m-1">
              <small>
                <a href={locationData?.url} className="text-muted">
                  {locationData?.sourceInfo}
                </a>
              </small>
            </p>
          </div>
          {hideMap ? (
            ""
          ) : (
            <>
              <NearbyLocations
                lat={locationData?.lat}
                long={locationData?.lon}
                locationId={locationData?.id}
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

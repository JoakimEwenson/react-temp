import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { colorTemperature, isOldTimeStamp, removeFavorite, addFavorite, setHome, removeHome } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";
import NearbyLocations from "../Components/NearbyLocations";
import apiCaller from "../Utils/apiCaller";

export default function LocationData({ userFavorites, setUserFavorites, userHome, setUserHome, hideMap }) {
  const { platsId } = useParams();
  const [hasErrors, setErrors] = useState(null);
  const [hasTimeStamp] = useState(null);
  const [locationData, setLocationData] = useState(null);

  // Get a list of locations
  async function getLocationData(loc) {
    try {
      const result = await apiCaller(`p=${loc}&verbose=true&amm=true`);
      const data = await result.json();
      console.log(data);
      if (data?.stations?.length > 0) {
        setLocationData(data?.stations[0]);
        document.title = `${data?.stations[0]?.temp}°C vid ${data?.stations[0]?.title}`;
      }

    } catch (error) {
      console.error(error);
      setErrors(error);
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
      <div className="container mx-auto p-3">
        {hasErrors && (
          <div className="mx-auto my-3 p-3 text-center bg-red-600 text-white font-semibold max-w-4xl">
            {hasErrors.message}
          </div>
        )}
        {locationData?.temp ? (
          <>
            {isOldTimeStamp(locationData?.lastUpdate) ? (
              <div className="mx-auto mb-3 p-3 text-center bg-red-600 rounded-xl text-white font-semibold max-w-4xl flex items-center justify-center">
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
            <div className="container bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 rounded-lg max-w-4xl mx-auto p-3">
              <div className="text-center">
                <h1 className="text-xl sm:text-3xl font-bold">{locationData?.title}</h1>
                {locationData?.kommun && locationData?.lan && (
                  <h2 className="text-sm sm:text-base">
                    {locationData?.kommun} - {locationData?.lan}
                  </h2>
                )}
                <h1
                  className="text-7xl sm:text-9xl font-bold font-mono drop-shadow-md my-5"
                  style={{ color: colorTemperature(locationData?.temp) }}
                >
                  {locationData?.temp}°C
                </h1>
                <p className="text-xs my-3">
                  <span className="font-semibold">Senast uppdaterat</span>
                  <br />
                  {locationData?.lastUpdate}
                </p>
                <p className="my-3 text-xs">
                  <span className="font-semibold" title={locationData?.amm?.minTime}>
                    min:
                  </span>{" "}
                  {locationData?.amm?.min}°c •{" "}
                  <span className="font-semibold" title={locationData?.amm?.maxTime}>
                    max:
                  </span>{" "}
                  {locationData?.amm?.max}°c • <span className="font-semibold">medel:</span>{" "}
                  {locationData?.amm?.average}°c
                </p>
                <p className="text-xs my-1">
                  <a href={locationData?.url}>{locationData?.sourceInfo}</a>
                </p>
                <div className="flex items-center justify-center mx-auto text-center my-3">
                  {userHome === locationData?.id ? (
                    <svg
                      className="w-8 h-8 mx-3 text-indigo-900 dark:text-indigo-500 cursor-pointer"
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
                      className="w-8 h-8 mx-3 text-neutral-300 dark:text-neutral-500 cursor-pointer"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        setHome(locationData?.id);
                        setUserHome(locationData?.id);
                      }}
                      title="Ställ in som startsidan"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                  )}
                  {userFavorites.includes(locationData?.id) ? (
                    <svg
                      className="w-8 h-8 mx-3 text-yellow-500 cursor-pointer"
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
                      className="w-8 h-8 mx-3 text-neutral-300 dark:text-neutral-500 cursor-pointer"
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
                </div>
              </div>
            </div>
          </>
        ) : (
          <LoadingSpinner />
        )}
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
  );
}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { removeFavorite } from "../Utils/Common";
import LoadingSpinner from "../Components/LoadingSpinner";
import apiCaller from "../Utils/apiCaller";

export default function Favorites({ userFavorites }) {
  const [isLoading, setLoading] = useState(false);
  const [hasErrors, setErrors] = useState(null);
  const [locations, setLocationData] = useState([]);
  const [locationList, setLocationList] = useState(userFavorites);

  // Get a list of locations
  async function getLocationData(favlist) {
    try {
      // Fetch data
      const favs = favlist.join(",");
      const result = await apiCaller(`p=${favs}&verbose=true&amm=true&num=25`);
      const data = await result.json();
      // Process data
      if (data?.stations?.length > 0) {
        setLocationData(data?.stations);
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

    if (userFavorites) {
      setLoading(true);
      getLocationData(locationList);
      interval = setInterval(() => {
        getLocationData(locationList);
      }, 600000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [locationList, userFavorites]);

  return (
    <div className="container mx-auto p-3">
      {hasErrors ? <div className="container max-w-4xl mx-auto">{hasErrors.message}</div> : ""}
      {isLoading ? <LoadingSpinner /> : ""}
      {locationList.length === 0 ? (
        <div className="container bg-white dark:bg-neutral-700 prose dark:prose-invert rounded-lg max-w-4xl p-3 mx-auto">
          <div className="text-center">Du har ännu inte favoritmarkerat några mätstationer.</div>
        </div>
      ) : (
        <div className="container bg-white dark:bg-neutral-700 rounded-lg max-w-4xl p-3 mx-auto overflow-hidden">
          <table className="container max-w-4xl prose dark:prose-invert">
            <thead>
              <tr>
                <th className="w-1/2 text-left">Plats</th>
                <th className="w-1/4 text-right">Temperatur</th>
                <th className="w-1/4">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-100 dark:hover:bg-neutral-600">
                  <td className="w-1/2 py-2 truncate">
                    <Link to={`/plats/${row.id}`}>{row.title}</Link>
                  </td>
                  <td className="w-1/4 py-2 text-right">{row.temp}&deg;C</td>
                  <td className="w-1/4 py-2">
                    <svg
                      className="w-5 h-5 mx-3 text-yellow-500 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => {
                        let tempFavs = removeFavorite(row.id);
                        setLocationList(tempFavs);
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

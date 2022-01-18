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
    <>
      {hasErrors ? <div className="container max-w-4xl my-3 mx-auto">{hasErrors.message}</div> : ""}
      {isLoading ? <LoadingSpinner /> : ""}
      {locationList.length === 0 ? (
        <div className="container max-w-4xl my-3 mx-auto">
          <div className="text-center">Du har ännu inte favoritmarkerat några mätstationer.</div>
        </div>
      ) : (
        <div className="container max-w-4xl my-3 p-3 mx-auto prose">
          <table className="container table-fixed">
            <thead>
              <tr>
                <th className="w-1/2">Plats</th>
                <th className="w-1/4">Temperatur</th>
                <th className="w-1/4"></th>
              </tr>
            </thead>
            <tbody>
              {locations.map((row) => (
                <tr key={row.id} className="border-bottom hover:bg-gray-100">
                  <td className="py-2">
                    <Link to={`/plats/${row.id}`}>{row.title}</Link>
                  </td>
                  <td className="py-2">{row.temp}&deg;C</td>
                  <td className="py-2">
                    <i
                      className="fas fa-star uiIcon uiIconFavorited"
                      onClick={() => {
                        let tempFavs = removeFavorite(row.id);
                        setLocationList(tempFavs);
                      }}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

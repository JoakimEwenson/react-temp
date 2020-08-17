import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Popup } from "react-map-gl";
import ReactMapGL from "react-map-gl";
import { colorTemperature, getRandomCli } from "../Utils/Common";

export default function MapView() {
  const defaultMapWidth = "100%";
  const defaultMapHeight = "85vh";
  const [locationList, setLocationList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [viewport, setViewport] = useState({
    width: defaultMapWidth,
    height: defaultMapHeight,
    latitude: 62.10237936,
    longitude: 14.5632154,
    zoom: 8,
  });

  // Get a list of locations
  async function getNearbyList(lat, long) {
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?lat=${lat.toString()}&lon=${long.toString()}&num=5&verbose=true&amm=true&cli=${CLI}`;
    //console.log(APIURL);

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
        //console.log({ locationList });
        setLocationList(locationList);
      })
      .catch((err) => console.error(`Error: ${err}`));
    setLoading(false);
  }

  useEffect(() => {
    let interval;

    setLoading(true);
    getNearbyList(viewport.latitude, viewport.longitude);
    interval = setInterval(() => {
      getNearbyList(viewport.latitude, viewport.longitude);
    }, 600000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {isLoading ? "Laddar..." : ""}
      <Card className="my-3">
        <ReactMapGL
          mapboxApiAccessToken="pk.eyJ1IjoiamV3ZW5zb24iLCJhIjoiY2tkeWkxdDAxMndjaTJ0b2Rpc3p2a3pweSJ9.r_KppxmTaSixudgMmFpW7A"
          mapStyle="mapbox://styles/jewenson/ckbtk7ve70z1t1iqlcryenuzz"
          {...viewport}
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
        >
          {locationList.map((loc) => (
            <Popup
              closeButton={false}
              key={loc.id}
              latitude={Number(loc.lat)}
              longitude={Number(loc.lon)}
            >
              <div className="p-1 text-center">
                <i className="fas fa-temperature-high"></i>
                <br />
                <span
                  className="temperatureSmall"
                  style={{ color: colorTemperature(loc.temp) }}
                >
                  {loc.temp}&deg;C
                </span>
              </div>
            </Popup>
          ))}
        </ReactMapGL>
      </Card>
    </>
  );
}

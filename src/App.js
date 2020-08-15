import React, { useState, useEffect } from "react";
import "./App.css";
import PageNav from "./Components/PageNav";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import LocationList from "./Pages/LocationList";
import NearbyList from "./Pages/NearbyList";
import LocationData from "./Pages/LocationData";
import Favorites from "./Pages/Favorites";
import { getRandomCli } from "./Utils/Common";

function App() {
  const [locationList, setLocationList] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);

  async function getLocationList() {
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?verbose=true&dc=true&cli=${CLI}`;
    console.log(APIURL);

    const parser = new DOMParser();
    const iconv = require("iconv-lite");
    let locations = [];

    fetch(APIURL)
      .then((response) => response.arrayBuffer())
      .then((buff) => iconv.decode(new Buffer(buff), "iso-8859-1").toString())
      .then((str) => parser.parseFromString(str, "text/xml"))
      .then((res) => {
        let items = res.getElementsByTagName("item");
        // Iterate results and input into string
        for (let i = 0; i < items.length; i++) {
          let row = {
            id: items[i].getElementsByTagName("id")[0].innerHTML
              ? items[i].getElementsByTagName("id")[0].innerHTML
              : null,
            title: items[i].getElementsByTagName("title")[0].innerHTML
              ? items[i].getElementsByTagName("title")[0].innerHTML
              : null,
            temp: items[i].getElementsByTagName("temp")[0].innerHTML
              ? items[i].getElementsByTagName("temp")[0].innerHTML
              : null,
            lat: items[i].getElementsByTagName("lat")[0].innerHTML
              ? items[i].getElementsByTagName("lat")[0].innerHTML
              : null,
            lon: items[i].getElementsByTagName("lon")[0].innerHTML
              ? items[i].getElementsByTagName("lon")[0].innerHTML
              : null,
            lastUpdate: items[i].getElementsByTagName("lastUpdate")[0].innerHTML
              ? items[i].getElementsByTagName("lastUpdate")[0].innerHTML
              : null,
            kommun: items[i].getElementsByTagName("kommun")[0].innerHTML
              ? items[i].getElementsByTagName("kommun")[0].innerHTML
              : null,
            lan: items[i].getElementsByTagName("lan")[0].innerHTML
              ? items[i].getElementsByTagName("lan")[0].innerHTML
              : null,
            sourceInfo: items[i].getElementsByTagName("sourceInfo")[0].innerHTML
              ? items[i].getElementsByTagName("sourceInfo")[0].innerHTML
              : null,
            url: items[i].getElementsByTagName("url")[0].innerHTML
              ? items[i].getElementsByTagName("url")[0].innerHTML
              : null,
          };
          locations.push(row);
        }
        setLocationList(locations);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
      });
  }

  useEffect(() => {
    getLocationList();
  }, []);

  return (
    <BrowserRouter>
      <PageNav />
      <Container>
        <Switch>
          <Route exact path="/">
            <>
              <h1>Hem</h1>
            </>
          </Route>
          <Route exact path="/favoriter">
            <Favorites userFavorites={userFavorites} setUserFavorites={setUserFavorites} />
          </Route>
          <Route exact path="/narliggande">
            <NearbyList userFavorites={userFavorites} setUserFavorites={setUserFavorites} />
          </Route>
          <Route exact path="/platslista">
            <LocationList locationList={locationList} getLocationList={getLocationList} userFavorites={userFavorites} setUserFavorites={setUserFavorites} />
          </Route>
          <Route exact path="/plats/:platsId">
            <LocationData userFavorites={userFavorites} setUserFavorites={setUserFavorites} />
          </Route>
          <Route exact path="/om">
            <>
              <h1>Om tjänsten</h1>
            </>
          </Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

export default App;

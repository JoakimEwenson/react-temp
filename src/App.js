import React, { useState, useEffect } from "react";
import PageNav from "./Components/PageNav";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Container } from "react-bootstrap";
import LocationList from "./Pages/LocationList";
import NearbyList from "./Pages/NearbyList";
import LocationData from "./Pages/LocationData";
import Favorites from "./Pages/Favorites";
import { getRandomCli, getFavorites, getHome } from "./Utils/Common";
import About from "./Pages/About";
import "./App.css";
import PageFooter from "./Components/PageFooter";
import MapView from "./Pages/MapView";

function App() {
  const [locationList, setLocationList] = useState([]);
  const [locationListAge, setLocationListAge] = useState(new Date().getTime());
  const [isLoading, setLoading] = useState(false);

  const [userFavorites, setUserFavorites] = useState(
    getFavorites() ? getFavorites() : []
  );
  const [userHome, setUserHome] = useState(getHome() ? getHome() : "");

  async function getLocationList() {
    setLocationListAge(new Date().getTime());
    const CLI = getRandomCli(12);
    const APIURL = `https://api.temperatur.nu/tnu_1.15.php?verbose=true&cli=${CLI}`;
    console.log(
      `${APIURL} requested at ${new Date().toLocaleTimeString("sv-SE")}`
    );

    const parser = new DOMParser();
    const iconv = require("iconv-lite");
    let locations = [];

    fetch(APIURL)
      .then((response) => response.arrayBuffer())
      .then((buff) => iconv.decode(new Buffer(buff), "iso-8859-1").toString())
      .then((str) => parser.parseFromString(str, "text/xml"))
      .then((res) => {
        try {
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
              lastUpdate: items[i].getElementsByTagName("lastUpdate")[0]
                .innerHTML
                ? items[i].getElementsByTagName("lastUpdate")[0].innerHTML
                : null,
            };
            locations.push(row);
          }
          //console.log(`All locations size: ${JSON.stringify(locations).length} chars`);
          setLocationList(locations);
        } catch (error) {
          console.errror(error);
        }
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
      });
  }

  useEffect(() => {
    let interval;

    getLocationList();

    interval = setInterval(() => {
      getLocationList();
    }, 1800000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <PageNav />
      <Container>
        <Switch>
          <Route exact path="/">
            {userHome ? <Redirect to={`/plats/${userHome}`} /> : <About />}
          </Route>
          <Route exact path="/favoriter">
            <Favorites
              userFavorites={userFavorites}
              setUserFavorites={setUserFavorites}
            />
          </Route>
          <Route exact path="/karta">
            <MapView locationList={locationList} />
          </Route>
          <Route exact path="/narliggande">
            <NearbyList
              userFavorites={userFavorites}
              setUserFavorites={setUserFavorites}
            />
          </Route>
          <Route exact path="/platslista">
            <LocationList
              isLoading={isLoading}
              setLoading={setLoading}
              locationList={locationList}
              getLocationList={getLocationList}
              locationListAge={locationListAge}
              setLocationListAge={setLocationListAge}
              userFavorites={userFavorites}
              setUserFavorites={setUserFavorites}
            />
          </Route>
          <Route exact path="/plats/:platsId">
            <LocationData
              userFavorites={userFavorites}
              setUserFavorites={setUserFavorites}
              userHome={userHome}
              setUserHome={setUserHome}
            />
          </Route>
          <Route exact path="/:platsId">
            <LocationData
              userFavorites={userFavorites}
              setUserFavorites={setUserFavorites}
              userHome={userHome}
              setUserHome={setUserHome}
              hideMap="true"
            />
          </Route>
          <Route exact path="/om">
            <About />
          </Route>
        </Switch>
      </Container>
      <PageFooter />
    </BrowserRouter>
  );
}

export default App;

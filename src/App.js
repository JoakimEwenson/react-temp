import React, { useState, useEffect } from "react";
import PageNav from "./Components/PageNav";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import LocationList from "./Pages/LocationList";
import NearbyList from "./Pages/NearbyList";
import LocationData from "./Pages/LocationData";
import Favorites from "./Pages/Favorites";
import { getFavorites, getHome } from "./Utils/Common";
import About from "./Pages/About";
import "./App.css";
import PageFooter from "./Components/PageFooter";
import MapView from "./Pages/MapView";
import apiCaller from "./Utils/apiCaller";

function App() {
  const [locationList, setLocationList] = useState([]);
  const [locationListAge, setLocationListAge] = useState(new Date().getTime());
  const [isLoading, setLoading] = useState(false);

  const [userFavorites, setUserFavorites] = useState(getFavorites() ? getFavorites() : []);
  const [userHome, setUserHome] = useState(getHome() ? getHome() : "");

  async function getLocationList() {
    setLocationListAge(new Date().getTime());
    try {
      const result = await apiCaller(`verbose=true`);
      const data = await result.json();
      if (data?.stations?.length > 0) {
        setLocationList(data?.stations);
      }
    } catch (error) {
      console.error(error);
    }
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
      <Switch>
        <Route exact path="/">
          {userHome ? <Redirect to={`/plats/${userHome}`} /> : <About />}
        </Route>
        <Route exact path="/extra/:platsId">
          <LocationData
            userFavorites={userFavorites}
            setUserFavorites={setUserFavorites}
            userHome={userHome}
            setUserHome={setUserHome}
          />
        </Route>
        <Route exact path="/favoriter">
          <Favorites userFavorites={userFavorites} setUserFavorites={setUserFavorites} />
        </Route>
        <Route exact path="/karta">
          <MapView locationList={locationList} />
        </Route>
        <Route exact path="/narliggande">
          <NearbyList userFavorites={userFavorites} setUserFavorites={setUserFavorites} />
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
            hideMap={true}
          />
        </Route>
        <Route exact path="/om">
          <About />
        </Route>
      </Switch>
      <PageFooter />
    </BrowserRouter>
  );
}

export default App;

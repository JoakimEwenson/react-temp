import React from "react";
import "./App.css";
import PageNav from "./Components/PageNav";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import LocationList from "./Pages/LocationList";
import NearbyList from "./Pages/NearbyList";
import LocationData from "./Pages/LocationData";

function App() {
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
            <>
              <h1>Favoriter</h1>
            </>
          </Route>
          <Route exact path="/narliggande">
            <NearbyList />
          </Route>
          <Route exact path="/platslista">
            <LocationList />
          </Route>
          <Route exact path="/plats/:platsId">
            <LocationData />
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

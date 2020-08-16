import React from "react";
import { Card } from "react-bootstrap";

export default function About() {
  document.title = "Om tjänsten";
  return (
    <Card className="my-3">
      <Card.Body>
        <h2>Temperatur.nu-webbapp skriven med React</h2>
        <p className="text-muted">
          <em>
            Av <a href="https://www.ewenson.se">Joakim Ewenson</a>, augusti 2020
          </em>
        </p>
        <h4>Beskrivning</h4>
        <p>
          En simpel webbapp skriven i React med Bootstrap som stilmallsramverk.
          Syftet är att hämta temperaturer från nätverket av mätstationer på&nbsp;
          <a href="https://temperatur.nu/">temperatur.nu</a>.
        </p>

        <h4>Funktioner</h4>
        <ul>
          <li>Lista över närliggande stationer</li>
          <li>Lista över samtliga stationer, sökbar i realtid</li>
          <li>Detaljerad vy över station och dess information</li>
          <li>Favoritlista baserat på Javascripts LocalStorage</li>
          <li>Möjlighet att välja en mätstation som hemskärm vid återbesök</li>
          <li>Möjlighet att sortera på högsta/lägsta temperatur</li>
        </ul>

        <h4>Kommande</h4>
        <ul>
          <li>Möjlighet att söka närmsta station via positioneringstjänst</li>
          <li>Karta på detaljvyn</li>
          <li>Närliggande stationer på detaljvyn</li>
          <li>Kartvy</li>
        </ul>

        <h4>Övrigt</h4>
        <p>
          Information om temperatur.nu och dess API finns på adressen&nbsp;
          <a href="http://wiki.temperatur.nu/index.php/API">
            http://wiki.temperatur.nu/index.php/API
          </a>
          .
        </p>
        <p>
          Vill du följa projektet på Github så hittar du repot på&nbsp;
          <a href="https://github.com/JoakimEwenson/react-temp/">
            https://github.com/JoakimEwenson/react-temp/
          </a>
          .
        </p>
      </Card.Body>
    </Card>
  );
}

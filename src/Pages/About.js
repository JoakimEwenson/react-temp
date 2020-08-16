import React from "react";
import { Card } from "react-bootstrap";

export default function About() {
  document.title = "Om tjänsten";
  return (
    <Card className="my-3">
      <Card.Body>
        <h2>Temperatur.nu-webbapp skriven med React</h2>
        <p className="text-muted"><em>Av <a href="https://www.ewenson.se">Joakim Ewenson</a>, augusti 2020</em></p>
        <h4>Beskrivning</h4>
        <p>
          En simpel webbapp skriven i React med Bootstrap för att hämta
          temperaturer från nätverket av mätstationer på temperatur.nu.
        </p>

        <h4>Funktioner</h4>
        <ul>
          <li>Lista över närliggande stationer</li>
          <li>Lista över samtliga stationer, sökbar i realtid</li>
          <li>Detaljerad vy över station och dess information</li>
        </ul>

        <h4>Kommande</h4>
        <ul>
          <li>Fungerande favoriter baserat på Javascripts LocalStorage</li>
          <li>Karta på detaljvyn</li>
          <li>Närliggande stationer på detaljvyn</li>
          <li>Kartvy</li>
        </ul>

        <h4>Övrigt</h4>
        <p>
          Information om temperatur.nu och dess API finns på adressen{" "}
          <a href="http://wiki.temperatur.nu/index.php/API">
            http://wiki.temperatur.nu/index.php/API
          </a>
        </p>
      </Card.Body>
    </Card>
  );
}

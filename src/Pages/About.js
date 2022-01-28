import React from "react";

export default function About() {
  document.title = "Om tjänsten";
  return (
    <div className="container mx-auto p-3">
      <div className="bg-white rounded-lg max-w-4xl mx-auto p-5">
        <article className="prose">
          <h1 className="text-3xl sm:text-5xl">Webbapp för temperatur.nu skriven med React</h1>
          <p className="text-xs -mt-5 sm:-mt-8">
            <em>
              Av <a href="https://www.ewenson.se">Joakim Ewenson</a>, augusti 2020
            </em>
          </p>
          <h2 className="">Beskrivning</h2>
          <p className="">
            En simpel webbapp skriven i React med syfte att hämta temperaturer från nätverket av mätstationer som
            rapporterar temperaturdata till tjänsten&nbsp;
            <a href="https://temperatur.nu/">temperatur.nu</a>.
          </p>

          <h2 className="">Funktioner</h2>
          <ul className="">
            <li>Lista över närliggande stationer</li>
            <li>Lista över samtliga stationer, sökbar i realtid</li>
            <li>Detaljerad vy över station och dess information</li>
            <li>Favoritlista baserat på Javascripts LocalStorage</li>
            <li>Möjlighet att välja en mätstation som hemskärm vid återbesök</li>
            <li>Möjlighet att sortera på högsta/lägsta temperatur</li>
            <li>Närliggande stationer på detaljvyn</li>
            <li>Karta på detaljvyn</li>
          </ul>

          <h2 className="">Kommande</h2>
          <ul className="">
            <li>Kartvy</li>
          </ul>

          <h2 className="">Teknik</h2>
          <ul className="list-disc ml-4">
            <li>
              <a href="https://reactjs.org/">React</a>
            </li>
            <li>
              <a href="https://tailwindcss.com">Tailwind CSS</a>
            </li>
            <li>
              <a href="https://heroicons.dev">Heroicons</a> (ikoner)
            </li>
            <li>
              <a href="https://fontawesome.com">Font Awesome</a> (footer-ikoner)
            </li>
          </ul>

          <h2 className="">Övrigt</h2>
          <p className="">
            Information om temperatur.nu och dess API finns på&nbsp;
            <a href="https://temperatur.nu/info/api/">temperatur.nu</a>.
          </p>
          <p className="">
            Vill du följa projektet rent tekniskt så hittar du repot på&nbsp;
            <a href="https://github.com/JoakimEwenson/react-temp/">github.com</a>.
          </p>
        </article>
      </div>
    </div>
  );
}

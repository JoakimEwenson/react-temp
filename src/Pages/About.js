import React from "react";

export default function About() {
  document.title = "Om tjänsten";
  return (
    <article className="container max-w-4xl my-3 mx-auto p-5 prose">
      <h1 className="">Webbapp för temperatur.nu skriven med React</h1>
      <p className="text-muted">
        <em>
          Av <a href="https://www.ewenson.se">Joakim Ewenson</a>, augusti 2020
        </em>
      </p>
      <h4 className="text-lg md:text-2xl font-bold mt-4 mb-2">Beskrivning</h4>
      <p className="mb-2">
        En simpel webbapp skriven i React med syfte att hämta temperaturer från nätverket av mätstationer som rapporterar temperaturdata till tjänsten&nbsp;
        <a href="https://temperatur.nu/">temperatur.nu</a>.
      </p>

      <h4 className="text-lg md:text-2xl font-bold mt-4 mb-2">Funktioner</h4>
      <ul className="list-disc ml-4">
        <li>Lista över närliggande stationer</li>
        <li>Lista över samtliga stationer, sökbar i realtid</li>
        <li>Detaljerad vy över station och dess information</li>
        <li>Favoritlista baserat på Javascripts LocalStorage</li>
        <li>Möjlighet att välja en mätstation som hemskärm vid återbesök</li>
        <li>Möjlighet att sortera på högsta/lägsta temperatur</li>
        <li>Närliggande stationer på detaljvyn</li>
        <li>Karta på detaljvyn</li>
      </ul>

      <h4 className="text-lg md:text-2xl font-bold mt-4 mb-2">Kommande</h4>
      <ul className="list-disc ml-4">
        <li>Kartvy</li>
      </ul>

      <h4 className="text-lg md:text-2xl font-bold mt-4 mb-2">Teknik</h4>
      <ul className="list-disc ml-4">
        <li>React</li>
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

      <h4 className="text-lg md:text-2xl font-bold mt-4 mb-2">Övrigt</h4>
      <p className="mb-2">
        Information om temperatur.nu och dess API finns på&nbsp;
        <a href="https://temperatur.nu/info/api/">temperatur.nu</a>.
      </p>
      <p className="mb-2">
        Vill du följa projektet rent tekniskt så hittar du repot på&nbsp;
        <a href="https://github.com/JoakimEwenson/react-temp/">github.com</a>.
      </p>
    </article>
  );
}

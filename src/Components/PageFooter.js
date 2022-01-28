import React from "react";

export default function PageFooter() {
  return (
    <footer className="w-full text-center mt-32 mb-5">
      <a
        href="https://github.com/JoakimEwenson/react-temp"
        className="text-indigo-900 hover:text-indigo-600"
        target="_blank"
        rel="noreferrer"
      >
        <i className="fab fa-github h-6 w-6 mx-5"></i>
      </a>
      <a
        href="https://twitter.com/JoakimEwenson"
        className="text-indigo-900 hover:text-indigo-600"
        target="_blank"
        rel="noreferrer"
      >
        <i className="fab fa-twitter h-6 w-6 mx-5"></i>
      </a>
      <a
        href="https://www.linkedin.com/in/joakim-ewenson-a1586377/"
        className="text-indigo-900 hover:text-indigo-600"
        target="_blank"
        rel="noreferrer"
      >
        <i className="fab fa-linkedin-in h-6 w-6 mx-5"></i>
      </a>
      <a href="https://www.ewenson.se" className="text-indigo-900 hover:text-indigo-600" target="_blank" rel="noreferrer">
        <i className="fab fa-wordpress h-6 w-6 mx-5"></i>
      </a>
    </footer>
  );
}

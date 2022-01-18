import React from "react";

export default function PageFooter() {
  return (
    <footer className="fixed bottom-0 bg-indigo-900 w-full text-center mt-64 pt-1 pb-3 md:pb-1" style={{zIndex: 100}}>
      <a
        href="https://github.com/JoakimEwenson/react-temp"
        className="text-white hover:text-gray-400"
        target="_blank"
        rel="noreferrer"
      >
        <i className="fab fa-github h-5 w-5 m-2"></i>
      </a>
      <a
        href="https://twitter.com/JoakimEwenson"
        className="text-white hover:text-gray-400"
        target="_blank"
        rel="noreferrer"
      >
        <i className="fab fa-twitter h-5 w-5 m-2"></i>
      </a>
      <a
        href="https://www.linkedin.com/in/joakim-ewenson-a1586377/"
        className="text-white hover:text-gray-400"
        target="_blank"
        rel="noreferrer"
      >
        <i className="fab fa-linkedin-in h-5 w-5 m-2"></i>
      </a>
      <a href="https://www.ewenson.se" className="text-white hover:text-gray-400" target="_blank" rel="noreferrer">
        <i className="fab fa-wordpress h-5 w-5 m-2"></i>
      </a>
    </footer>
  );
}

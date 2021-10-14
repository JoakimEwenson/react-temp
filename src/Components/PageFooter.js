import React from "react";

export default function PageFooter() {
  return (
    <div className="text-center mt-36">
      <a href="https://github.com/JoakimEwenson/react-temp" target="_blank" rel="noreferrer">
        <i className="fab fa-github h-5 w-5 m-2"></i>
      </a>
      <a href="https://twitter.com/JoakimEwenson" target="_blank" rel="noreferrer">
        <i className="fab fa-twitter h-5 w-5 m-2"></i>
      </a>
      <a href="https://www.linkedin.com/in/joakim-ewenson-a1586377/" target="_blank" rel="noreferrer">
        <i className="fab fa-linkedin-in h-5 w-5 m-2"></i>
      </a>
      <a href="https://www.ewenson.se" target="_blank" rel="noreferrer">
        <i className="fab fa-wordpress h-5 w-5 m-2"></i>
      </a>
    </div>
  );
}

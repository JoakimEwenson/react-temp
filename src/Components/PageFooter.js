import React from "react";

export default function PageFooter() {
  return (
    <div className="bg-dark mx-auto text-center fixed-bottom sticky-bottom pb-2">
      <a href="https://github.com/JoakimEwenson/react-temp">
        <i className="fab fa-github footerIcon m-2"></i>
      </a>
      <a href="https://twitter.com/JoakimEwenson">
        <i className="fab fa-twitter footerIcon m-2"></i>
      </a>
      <a href="https://www.linkedin.com/in/joakim-ewenson-a1586377/">
        <i className="fab fa-linkedin-in footerIcon m-2"></i>
      </a>
      <a href="https://www.ewenson.se"><i className="fab fa-wordpress footerIcon m-2"></i></a>
    </div>
  );
}
